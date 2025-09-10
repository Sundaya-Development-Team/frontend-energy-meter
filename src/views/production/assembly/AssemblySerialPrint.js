import React, { useEffect, useState, useCallback } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CFormInput, CRow, CSpinner } from '@coreui/react'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { backendTracking } from '../../api/axios'

// Search bar
const SearchBar = ({ value, onChange }) => (
  <CRow className="mb-3 align-items-center">
    <CCol md={6}>
      <CFormInput
        type="text"
        placeholder="Search by Serial Number or Status..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </CCol>
  </CRow>
)

const AssemblySerialPrint = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')

  // Fetch generated production records
  const fetchGenerated = useCallback(async () => {
    setLoading(true)
    try {
      const res = await backendTracking.get('/production/generated', {
        params: {
          page,
          limit,
          search: searchKeyword || undefined,
        },
      })

      const items = res.data.data || []
      const pagination = res.data.pagination || {}

      setData(items)
      setTotalRows(pagination.totalPages * pagination.itemsPerPage || 0)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch generated production records')
    } finally {
      setLoading(false)
    }
  }, [page, limit, searchKeyword])

  useEffect(() => {
    const debounceDelay = 300
    const delayDebounce = setTimeout(() => {
      fetchGenerated()
    }, debounceDelay)

    return () => clearTimeout(delayDebounce)
  }, [fetchGenerated])

  // DataTable columns
  const columns = [
    {
      name: 'No',
      width: '60px',
      cell: (row, index) => <div className="text-center">{(page - 1) * limit + index + 1}</div>,
    },
    { name: 'Serial Number', selector: (row) => row.serialNumber, sortable: true },
    { name: 'Company Code', selector: (row) => row.companyCode, sortable: true },
    { name: 'Year', selector: (row) => row.year, sortable: true },
    { name: 'Month', selector: (row) => row.month, sortable: true },
    { name: 'Sequence', selector: (row) => row.sequence, sortable: true },
    { name: 'Status', selector: (row) => row.status, sortable: true },
    {
      name: 'Created At',
      selector: (row) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Generated Production Records</strong>
          </CCardHeader>
          <CCardBody>
            <SearchBar
              value={searchKeyword}
              onChange={(value) => {
                setSearchKeyword(value)
                setPage(1)
              }}
            />
            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: '300px' }}
              >
                <CSpinner color="primary" size="lg" />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={data}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationDefaultPage={page}
                onChangePage={(p) => setPage(p)}
                onChangeRowsPerPage={(newLimit) => {
                  setLimit(newLimit)
                  setPage(1)
                }}
                responsive
                highlightOnHover
                striped
              />
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AssemblySerialPrint
