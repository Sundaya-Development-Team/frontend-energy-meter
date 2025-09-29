import React, { useState, useEffect, useCallback } from 'react'
import DataTable from 'react-data-table-component'
import { CCard, CCardBody, CSpinner, CFormInput, CRow, CCol, CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { backendGenerate } from '../../../api/axios'
import { toast } from 'react-toastify'

const AssemblySerialList = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')
  const navigate = useNavigate()

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true)
      const response = await backendGenerate.get('/production/generated', {
        params: { page, limit, search: searchKeyword || undefined },
      })

      if (response.data.success) {
        setRecords(response.data.data || [])
        setTotalRows(response.data.pagination?.totalItems || 0)
      }
    } catch (error) {
      console.error('Error fetching records:', error)
      toast.error('Failed to fetch records')
    } finally {
      setLoading(false)
    }
  }, [page, limit, searchKeyword])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  // Download CSV + update ke API
  const downloadCSV = async () => {
    if (records.length === 0) {
      toast.error('No data to export!')
      return
    }

    const headers = [
      'No',
      'Company',
      'Year',
      'Month',
      'Sequence',
      'Serial Number',
      'Status',
      'Created At',
    ]

    const rows = records.map((row, index) => [
      (page - 1) * limit + index + 1,
      row.companyCode,
      row.year,
      row.month,
      row.sequence,
      row.serialNumber,
      row.status,
      new Date(row.createdAt).toLocaleString(),
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers, ...rows].map((e) => e.join(',')).join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `assembly_serials_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Ambil semua id dari records
    const ids = records.map((row) => row.id)

    try {
      await backendGenerate.patch('/production/print-by-ids', { ids })
      toast.success('Print status updated successfully!')

      fetchRecords()
    } catch (error) {
      console.error('Error update print status:', error)
      toast.error(error.response?.data?.message || 'Failed to update print status')
    }
  }

  const columns = [
    {
      name: 'No',
      selector: (row, index) => (page - 1) * limit + index + 1,
      sortable: false,
      width: '90px',
    },
    {
      name: 'Serial Number',
      selector: (row) => row.serialNumber,
      sortable: true,
      grow: 2,
    },
    { name: 'Status', selector: (row) => row.status, sortable: true },
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
          <CCol className="d-flex justify-content-end">
            <CButton
              color="success"
              className="text-white"
              onClick={downloadCSV}
              disabled={records.length === 0}
            >
              Download CSV
            </CButton>
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
