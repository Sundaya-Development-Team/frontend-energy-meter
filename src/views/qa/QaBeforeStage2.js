import React, { useState, useRef, useEffect } from 'react'
import {
  CButton,
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
} from '@coreui/react'
import { backendQc } from '../../api/axios'
import { toast } from 'react-toastify'

const FormRow = ({ label, children }) => (
  <CRow className="mb-3 align-items-center">
    <CCol md={4}>
      <CFormLabel className="fw-semibold">{label}</CFormLabel>
    </CCol>
    <CCol md={8}>{children}</CCol>
  </CRow>
)

const QaBeforeStage2 = () => {
  const serialInputRef = useRef(null)
  const [serialNumber, setSerialNumber] = useState('')
  const [inspectionDetails, setInspectionDetails] = useState([])
  const [isProcessStarted, setIsProcessStarted] = useState(false)
  const [isInputLocked, setIsInputLocked] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    serialInputRef.current?.focus()
  }, [])

  const handleStartProcess = async () => {
    const serials = inspectionDetails.map((d) => d.serial_number).filter(Boolean)
    if (serials.length === 0) {
      toast.warning('Belum ada serial yang di-scan. Scan minimal 1 serial.')
      return
    }
    try {
      await backendQc.post('/tamper/tts007/start', { serial_number: serials })
      toast.success('Proses berhasil dimulai.')
      setIsProcessStarted(true)
      setInspectionDetails([])
      setCurrentPage(1)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal start proses.')
    }
  }

  const handleStopProcess = () => {
    setIsProcessStarted(false)
    setIsInputLocked(false)
  }

  const clearSerialNumber = () => {
    setInspectionDetails([])
    setCurrentPage(1)
    setIsInputLocked(false)
    toast.info('The Serial Number data has been reset..')
    setTimeout(() => serialInputRef.current?.focus(), 0)
  }

  const handleResetProcess = async () => {
    const serials = inspectionDetails.map((d) => d.serial_number).filter(Boolean)
    if (serials.length === 0) {
      toast.warning('Tidak ada serial untuk reset process.')
      return
    }
    try {
      await backendQc.post('/tamper/tts007/reset', { serial_numbers: serials })
      toast.success('Reset process berhasil.')
      setInspectionDetails([])
      setCurrentPage(1)
      setIsInputLocked(false)
      setTimeout(() => serialInputRef.current?.focus(), 0)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal reset process.')
    }
  }

  const handleSerial = async () => {
    const serial = serialNumber.trim()
    if (!serial) return

    if (isInputLocked) return

    try {
      const response = await backendQc.get('/validation/tts007', {
        params: { serial_number: serial },
      })
      const data = response.data

      const isStop = data.status === 'stop'
      const isLanjut = data.status === 'lanjut'

      if (isStop) {
        const group = data.serial_number_group || []
        setInspectionDetails(
          group.map((item) => ({ serial_number: item.serial_number })),
        )
        setCurrentPage(1)
        setIsInputLocked(true)
        toast.info(data?.message || 'Serial sudah START Tamper.')
      } else if (isLanjut) {
        const exists = inspectionDetails.some((d) => d.serial_number === serial)
        if (exists) {
          toast.warning('Serial number sudah ada di tabel.')
          setSerialNumber('')
          return
        }
        setInspectionDetails((prev) => [...prev, { serial_number: serial }])
        toast.success(data?.message || 'Serial masuk tabel.')
      } else {
        const exists = inspectionDetails.some((d) => d.serial_number === serial)
        if (exists) {
          toast.warning('Serial number sudah ada di tabel.')
          setSerialNumber('')
          return
        }
        setInspectionDetails((prev) => [...prev, { serial_number: serial }])
        toast.success(data?.message || 'Serial masuk tabel.')
      }
      setSerialNumber('')
    } catch (err) {
      setSerialNumber('')
      toast.error(err.response?.data?.message || 'Gagal validasi serial.')
      setTimeout(() => serialInputRef.current?.focus(), 0)
    }
  }

  const paginatedDetails = inspectionDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <CRow>
      {/* Scan Product Serial Number */}
      <CCol md={6}>
        <CCard className="mb-4 h-100">
          <CCardHeader>
            <strong>QC Aging Test Sample</strong>
          </CCardHeader>
          <CCardBody className="d-flex flex-column h-100">
            <FormRow label="Product Serial Number">
              <CFormInput
                ref={serialInputRef}
                value={serialNumber}
                disabled={isInputLocked}
                onChange={(e) => setSerialNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSerial()
                  }
                }}
              />
            </FormRow>
            <div className="mt-auto d-flex justify-content-end pt-3 gap-2">
              {isInputLocked && (
                <>
                  <CButton
                    color="secondary"
                    className="text-white"
                    onClick={handleResetProcess}
                    disabled={inspectionDetails.length === 0}
                  >
                    Reset Process
                  </CButton>
                  <CButton
                    color="danger"
                    className="text-white"
                    onClick={handleStopProcess}
                  >
                    Stop Process
                  </CButton>
                </>
              )}
              {!isInputLocked && (
                <CButton
                  color="primary"
                  className="text-white"
                  onClick={handleStartProcess}
                  disabled={inspectionDetails.length === 0}
                >
                  Start Process
                </CButton>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Tabel Inspection Details */}
      <CCol md={6}>
        <CCard className="mb-4 h-100">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Inspection Details || Total: {inspectionDetails.length}</strong>
            <div className="d-flex gap-2">
              <CButton
                color="warning"
                size="sm"
                className="text-white"
                onClick={clearSerialNumber}
                disabled={inspectionDetails.length === 0}
              >
                Clear Serial Number
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody className="d-flex flex-column">
            <div className="flex-grow-1 overflow-auto">
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>No</CTableHeaderCell>
                    <CTableHeaderCell>Serial Number</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {paginatedDetails.map((item, index) => (
                    <CTableRow key={(currentPage - 1) * itemsPerPage + index}>
                      <CTableDataCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </CTableDataCell>
                      <CTableDataCell>{item.serial_number}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <CPagination>
                <CPaginationItem
                  className="cursor-pointer"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </CPaginationItem>
                {Array.from({
                  length: Math.ceil(inspectionDetails.length / itemsPerPage),
                }).map((_, i) => (
                  <CPaginationItem
                    key={i}
                    className="cursor-pointer"
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  className="cursor-pointer"
                  disabled={currentPage === Math.ceil(inspectionDetails.length / itemsPerPage)}
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

export default QaBeforeStage2
