import React, { useState, useEffect, useCallback } from 'react'
import { CCard, CCardBody, CSpinner, CButton } from '@coreui/react'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import { backendTracking } from '../../api/axios'
import { useNavigate } from 'react-router-dom'

const ReceivingNonSerialQc = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')

  const navigate = useNavigate()

  const fetchTracking = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit,
        sort_by: 'created_at',
        sort_order: 'desc',
        is_serialize: false, // 🔑 hanya ambil non-serial
      }

      if (searchKeyword.trim() !== '') {
        params.search = searchKeyword.trim()
      }

      const res = await backendTracking.get('/', { params })

      setData(res.data.data.records || [])
      setTotalRows(res.data.data.pagination?.total || 0)
    } catch (error) {
      toast.error('Failed to fetch tracking data')
    } finally {
      setLoading(false)
    }
  }, [page, limit, searchKeyword])

  useEffect(() => {
    fetchTracking()
  }, [fetchTracking])

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const handlePerRowsChange = (newLimit, newPage) => {
    setLimit(newLimit)
    setPage(newPage)
  }

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value)
    setPage(1)
  }

  const handleDetailClick = (id) => {
    const trackingId = id
    navigate(`/ /detail/${trackingId}`)
  }

  const columns = [
    { name: 'Serial Number', selector: (row) => row.serial_number, sortable: true },
    { name: 'Item Code', selector: (row) => row.code_item, sortable: true },
    { name: 'Batch', selector: (row) => row.batch, sortable: true },
    { name: 'Qty', selector: (row) => row.original_quantity, sortable: true },
    { name: 'Serialized', selector: (row) => (row.is_serialize ? 'Yes' : 'No'), sortable: true },
    { name: 'Tracking', selector: (row) => row.tracking_type, sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <CButton size="sm" color="primary" onClick={() => handleDetailClick(row.id)}>
          Select Product
        </CButton>
      ),
      ignoreRowClick: true,
    },
  ]

  return (
    <CCard>
      <CCardBody>
        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchKeyword}
            onChange={handleSearchChange}
            className="form-control w-25"
          />
        </div>

        <DataTable
          columns={columns}
          data={data}
          progressPending={loading}
          progressComponent={<CSpinner size="sm" />}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
          highlightOnHover
          persistTableHead
        />
      </CCardBody>
    </CCard>
  )
}

export default ReceivingNonSerialQc
