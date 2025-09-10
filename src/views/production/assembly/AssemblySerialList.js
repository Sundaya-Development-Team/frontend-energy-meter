import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { CCard, CCardBody, CSpinner, CFormInput, CRow, CCol, CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { backendGenerate } from '../../../api/axios'

const AssemblySerialList = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')
  const navigate = useNavigate()

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await backendGenerate.get('/production/generated', {
        params: {
          page,
          limit,
          search: searchKeyword || undefined,
        },
      })

      if (response.data.success) {
        setRecords(response.data.data || [])
        setTotalRows(
          response.data.pagination?.itemsPerPage * response.data.pagination?.totalPages || 0,
        )
      }
    } catch (error) {
      console.error('Error fetching records:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [page, limit, searchKeyword])

  const columns = [
    {
      name: 'Nomor',
      selector: (row, index) => (page - 1) * limit + index + 1,
      sortable: false,
      width: '90px',
    },
    {
      name: 'Company',
      selector: (row) => row.companyCode,
      sortable: true,
    },
    {
      name: 'Year',
      selector: (row) => row.year,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Month',
      selector: (row) => row.month,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Sequence',
      selector: (row) => row.sequence,
      sortable: true,
    },
    {
      name: 'Serial Number',
      selector: (row) => row.serialNumber,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: 'Created At',
      selector: (row) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
      grow: 2,
    },
  ]

  return (
    <CCard>
      <CCardBody>
        <CRow className="mb-3">
          <CCol md={4}>
            <CFormInput
              placeholder="Search serial number..."
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value)
                setPage(1)
              }}
            />
          </CCol>
        </CRow>

        <DataTable
          columns={columns}
          data={records}
          progressPending={loading}
          progressComponent={<CSpinner />}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={limit}
          onChangePage={(p) => setPage(p)}
          onChangeRowsPerPage={(newLimit) => {
            setLimit(newLimit)
            setPage(1)
          }}
          highlightOnHover
          striped
        />
      </CCardBody>
    </CCard>
  )
}

export default AssemblySerialList
