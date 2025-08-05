/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CSpinner,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { backendReceiving } from '../../api/axios'

const SearchBar = ({ value, onChange }) => (
  <CRow className="mb-3 align-items-center">
    <CCol md={6}>
      <CFormInput
        type="text"
        placeholder="Search by GR Number or PO Number..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </CCol>
  </CRow>
)

const ReceivingList = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')

  const fetchReceiving = useCallback(async () => {
    setLoading(true)
    try {
      const res = await backendReceiving.get('/receiving-headers', {
        params: {
          page,
          limit,
          search: searchKeyword,
          status: '',
        },
      })
      setData(res.data.data || [])
      setTotalRows(res.data.pagination?.totalCount || 0)
    } catch (error) {
      toast.error('Failed to fetch receiving headers')
    } finally {
      setLoading(false)
    }
  }, [page, limit, searchKeyword])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchReceiving()
    }, 500)
    return () => clearTimeout(delayDebounce)
  }, [fetchReceiving])

  const columns = [
    {
      name: 'No',
      width: '60px',
      cell: (row, index) => <div className="text-center">{(page - 1) * limit + index + 1}</div>,
    },
    { name: 'GR Number', selector: (row) => row.gr_number, sortable: true },
    { name: 'PO Number', selector: (row) => row.purchase_order?.po_number || '-', sortable: true },
    { name: 'Batch', selector: (row) => row.batch },
    { name: 'Received Date', selector: (row) => new Date(row.received_date).toLocaleDateString() },
    { name: 'Location', selector: (row) => row.location },
    { name: 'Status', selector: (row) => row.status },
  ]

  const ExpandedComponent = ({ data }) => (
    <div className="p-3 border-top bg-light rounded">
      <CRow className="mb-2">
        <CCol md={6}>
          <strong>GR Number:</strong> {data.gr_number}
        </CCol>
        <CCol md={6}>
          <strong>PO Number:</strong> {data.purchase_order?.po_number || '-'}
        </CCol>
      </CRow>
      <CRow className="mb-2">
        <CCol md={6}>
          <strong>Received By:</strong> {data.received_by}
        </CCol>
        <CCol md={6}>
          <strong>Location:</strong> {data.location}
        </CCol>
      </CRow>
      <CRow>
        <CCol md={12}>
          <strong>Notes:</strong> {data.notes || '-'}
        </CCol>
      </CRow>
      <CRow className="mb-2">
        <CCol md={12}>
          <strong>Items:</strong>
          <ul className="mt-2">
            {data.receiving_items?.map((item, index) => (
              <li key={index}>
                <strong>{item.item_type}</strong> – Qty: {item.quantity}
              </li>
            ))}
          </ul>
        </CCol>
      </CRow>
    </div>
  )

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Receiving List</strong>
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
                expandableRows
                expandableRowsComponent={ExpandedComponent}
              />
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ReceivingList
