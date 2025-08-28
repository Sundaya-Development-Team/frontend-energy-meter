/* eslint-disable prettier/prettier */
import React, { useState, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CButton,
} from '@coreui/react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { backendWh } from '../../api/axios'
import { CounterCard6, CounterCard12 } from '../components/CounterCard'

const FormRow = ({ label, children }) => (
  <CRow className="mb-3 align-items-center">
    <CCol md={4}>
      <CFormLabel className="fw-semibold">{label}</CFormLabel>
    </CCol>
    <CCol md={8}>{children}</CCol>
  </CRow>
)

const WarehouseScanUI = () => {
  const [serialNumber, setSerialNumber] = useState('')
  const [summary, setSummary] = useState(null)
  const [serials, setSerials] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [receivingItemId, setReceivingItemId] = useState(null)

  // scan serial
  const handleSerial = async () => {
    if (!serialNumber.trim()) return
    try {
      const scanRes = await backendWh.post('/stock-transactions/scan', {
        serial_number: serialNumber,
        performed_by: 1,
      })

      if (scanRes.data.success) {
        toast.success(scanRes.data.message ?? 'Serial scanned successfully')
        const itemId = scanRes.data.data?.stock_unit?.receiving_item_id
        setReceivingItemId(itemId)

        // fetch staging setelah scan
        fetchStaging(itemId)
      } else {
        toast.error(scanRes.data.message ?? 'Scan failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Scan failed')
    } finally {
      setSerialNumber('')
    }
  }

  // fetch staging data
  const fetchStaging = useCallback(async (itemId) => {
    if (!itemId) return
    try {
      const res = await backendWh.get('/stock-units/zero-quantity-staging', {
        params: { receiving_item_id: itemId },
      })

      if (res.data.success) {
        setSummary(res.data.data.summary)
        setSerials(res.data.data.serial_numbers || [])
      } else {
        toast.error(res.data.message ?? 'Failed to fetch staging')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching staging')
    }
  }, [])

  // pagination serials
  const paginatedSerials = serials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <CRow>
      {/* Scan + Counter */}
      <CCol md={6}>
        <CCard className="mb-4 h-100">
          <CCardHeader>
            <strong>Warehouse Scan</strong>
          </CCardHeader>
          <CCardBody>
            <FormRow label="Serial Number">
              <CFormInput
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSerial()
                  }
                }}
                placeholder="Scan Serial Number"
              />
              {/* <CButton
                color="primary"
                className="mt-2"
                onClick={handleSerial}
                disabled={!serialNumber.trim()}
              >
                Scan
              </CButton> */}
            </FormRow>

            <div className="mt-3">
              <FormRow label="Counter Remaining" />
              {summary ? (
                <CRow className="mb-3">
                  <CounterCard12 title="Total Found" value={summary.total_found} />
                  <CounterCard12 title="Displayed" value={summary.displayed} />
                  {/* <CounterCard6 title="Serial Retrieved" value={summary.serial_retrieved} />
                  <CounterCard6 title="Missing Serials" value={summary.missing_serials} /> */}
                </CRow>
              ) : (
                <CRow className="mb-3">
                  <CounterCard12 title="Total Found" value={'No Data'} />
                  <CounterCard12 title="Displayed" value={'No Data'} />
                  {/* <CounterCard6 title="Serial Retrieved" value={'No Data'} />
                  <CounterCard6 title="Missing Serials" value={'No Data'} /> */}
                </CRow>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Tabel Serial Numbers */}
      <CCol md={6}>
        <CCard className="mb-4 h-100">
          <CCardHeader>
            <strong>
              List of Remaining Serial Numbers {summary ? `|| Total: ${serials.length}` : ''}
            </strong>
          </CCardHeader>
          <CCardBody className="d-flex flex-column">
            <div className="flex-grow-1 overflow-auto">
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>No</CTableHeaderCell>
                    <CTableHeaderCell>Serial Number</CTableHeaderCell>
                    <CTableHeaderCell>Staged At</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {paginatedSerials.length > 0 ? (
                    paginatedSerials.map((sn, idx) => (
                      <CTableRow key={idx}>
                        <CTableDataCell>
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </CTableDataCell>
                        <CTableDataCell>{sn.serial_number}</CTableDataCell>
                        <CTableDataCell>{new Date(sn.created_at).toLocaleString()}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={3} className="text-center text-muted">
                        No serials scanned yet...
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <CPagination>
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </CPaginationItem>
                {Array.from({ length: Math.ceil(serials.length / itemsPerPage) }).map((_, i) => (
                  <CPaginationItem
                    key={i}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === Math.ceil(serials.length / itemsPerPage)}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default WarehouseScanUI
