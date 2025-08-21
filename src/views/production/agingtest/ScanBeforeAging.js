import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
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
} from '@coreui/react'
import { CounterCard6 } from '../../components/CounterCard'

const FormRow = ({ label, children }) => (
  <CRow className="mb-3 align-items-center">
    <CCol md={4}>
      <CFormLabel className="fw-semibold">{label}</CFormLabel>
    </CCol>
    <CCol md={8}>{children}</CCol>
  </CRow>
)

const ScanBeforeAging = () => {
  const [formData, setFormData] = useState({
    barcode: '',
    productionBatch: '10',
    agingBatch: '',
    serialNumber: '',
  })

  // scanningItem langsung dummy
  const [scanningItem, setScanningItem] = useState({
    itemName: 'Product ABC',
    expectedQuantity: 10,
    remainingStage: 10,
    totalStaged: 0,
    serialNumbers: [],
  })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // scan Product Serial Number → push ke list
  const handleSerial = () => {
    console.log('scan brow')
    if (!formData.serialNumber.trim()) return
    setScanningItem((prev) => {
      const newSerial = {
        serial_number: formData.serialNumber,
        created_at: new Date(),
      }
      const updatedList = [...prev.serialNumbers, newSerial]
      return {
        ...prev,
        serialNumbers: updatedList,
        totalStaged: updatedList.length,
        remainingStage: prev.expectedQuantity - updatedList.length,
      }
    })
    setFormData((prev) => ({
      ...prev,
      serialNumber: '',
    }))
  }

  const paginatedSerialNumbers = scanningItem.serialNumbers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <CRow>
      {/* Scan Product Serial Number */}
      <CCol md={6}>
        <CCard className="mb-4 h-100">
          <CCardHeader>
            <strong>Product Name : {scanningItem.itemName}</strong>
          </CCardHeader>
          <CCardBody>
            <FormRow label="Product Serial Number">
              <CFormInput
                name="serialNumber"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSerial()
                  }
                }}
              />
            </FormRow>
            {/* <CFormLabel>Production Product Serial Number</CFormLabel>
            <CFormInput
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSerial()
                }
              }}
            /> */}

            <div className="mt-3">
              {' '}
              <FormRow label="Counter"></FormRow>
              <CRow className="mb-3">
                <CounterCard6 title="Expected Quantity" value={scanningItem.expectedQuantity} />
                <CounterCard6 title="Remaining Quantity" value={scanningItem.remainingStage} />
                <CounterCard6 title="Expected Quantity" value={scanningItem.expectedQuantity} />
                <CounterCard6 title="Remaining Quantity" value={scanningItem.remainingStage} />
              </CRow>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Tabel Product Serial Numbers */}
      <CCol md={6}>
        <CCard className="mb-4 h-100">
          <CCardHeader>
            <strong>Staged Product Serial Numbers || Total: {scanningItem.totalStaged}</strong>
          </CCardHeader>
          <CCardBody className="d-flex flex-column">
            <div className="flex-grow-1 overflow-auto">
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>No</CTableHeaderCell>
                    <CTableHeaderCell>Product Serial Number</CTableHeaderCell>
                    <CTableHeaderCell>Staged At</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {paginatedSerialNumbers.map((sn, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </CTableDataCell>
                      <CTableDataCell>{sn.serial_number}</CTableDataCell>
                      <CTableDataCell>{new Date(sn.created_at).toLocaleString()}</CTableDataCell>
                    </CTableRow>
                  ))}
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
                {Array.from({
                  length: Math.ceil(scanningItem.serialNumbers.length / itemsPerPage),
                }).map((_, i) => (
                  <CPaginationItem
                    key={i}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={
                    currentPage === Math.ceil(scanningItem.serialNumbers.length / itemsPerPage)
                  }
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

export default ScanBeforeAging
