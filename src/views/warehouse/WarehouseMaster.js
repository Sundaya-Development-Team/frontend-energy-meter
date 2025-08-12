/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormInput } from '@coreui/react'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import { backendWh } from '../../api/axios'

// Komponen detail row
const ExpandedComponent = ({ data }) => (
  <div className="p-3 border-top bg-light rounded">
    <CRow className="mb-2">
      <CCol md={6}>
        <strong>Warehouse Code:</strong> {data.code}
      </CCol>
      <CCol md={6}>
        <strong>Name:</strong> {data.name}
      </CCol>
    </CRow>
    <CRow className="mb-2">
      <CCol md={6}>
        <strong>Location:</strong> {data.location || '-'}
      </CCol>
      <CCol md={6}>
        <strong>Created:</strong> {data.created_at || '-'}
      </CCol>
    </CRow>
    {/* <CRow>
      <CCol>
        <strong>Image:</strong>
        <div className="mt-2">
          {data.image_url ? (
            <img
              src={data.image_url}
              alt="Product"
              style={{
                width: '100%',
                maxWidth: '300px',
                height: 'auto',
                borderRadius: '8px',
              }}
            />
          ) : (
            <span>-</span>
          )}
        </div>
      </CCol>
    </CRow> */}
  </div>
)

const WarehouseList = () => {
  const [data, setData] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchWarehouses = useCallback(
    async (page = currentPage, limit = perPage, search = searchKeyword) => {
      setLoading(true)
      try {
        const res = await backendWh.get('/', {
          params: { page, limit, search },
        })
        const { data: warehouses, pagination } = res.data
        setData(warehouses || [])
        setTotalRows(pagination?.total || 0)
      } catch (error) {
        toast.error('Failed to fetch warehouses')
      } finally {
        setLoading(false)
      }
    },
    [currentPage, perPage, searchKeyword],
  )

  useEffect(() => {
    fetchWarehouses(currentPage, perPage, searchKeyword)
  }, [fetchWarehouses])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage)
    setCurrentPage(page)
  }

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value)
    setCurrentPage(1)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchWarehouses(1, perPage, searchKeyword)
  }

  const columns = [
    { name: 'Warehouse Code', selector: (row) => row.code || '-', sortable: true },
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'Location', selector: (row) => row.location || '-', sortable: true },
    { name: 'Created', selector: (row) => row.created_at || '-', sortable: true },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Warehouses</strong>
          </CCardHeader>
          <CCardBody>
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <CRow>
                <CCol md={4}>
                  <CFormInput
                    type="text"
                    placeholder="Search..."
                    value={searchKeyword}
                    onChange={handleSearchChange}
                  />
                </CCol>
              </CRow>
            </form>
            <DataTable
              columns={columns}
              data={data}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              expandableRows
              expandableRowsComponent={ExpandedComponent}
              highlightOnHover
              striped
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default WarehouseList
