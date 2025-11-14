import React, { useState, useRef, useEffect } from 'react'
import {
  CRow,
  CCard,
  CCol,
  CCardBody,
  CCardHeader,
  CFormLabel,
  CFormInput,
  CForm,
  CButton,
  CFormTextarea,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { backendGenerate } from '../../../api/axios'
import BoxInfoCard from '../../components/BoxInfoCard'
import SerialListTable from '../../components/SerialListTable'
import QRDisplayCard from '../../components/QRDisplayCard'
import '../../../scss/style.scss'

const FormRow = ({ label, children, required }) => (
  <CRow className="mb-3 align-items-center">
    <CCol md={4}>
      <CFormLabel className="fw-semibold">
        {label}
        {required && <span className="text-danger"> *</span>}
      </CFormLabel>
    </CCol>
    <CCol md={8}>{children}</CCol>
  </CRow>
)

const GenerateBoxSerial = () => {
  // Step Management
  const [currentStep, setCurrentStep] = useState('CREATE_BOX') // CREATE_BOX, SCANNING, FINALIZED

  // User from localStorage
  const getUserFromStorage = () => {
    try {
      const userString = localStorage.getItem('user')
      if (userString) {
        return JSON.parse(userString)
      }
      return null
    } catch (error) {
      console.error('Error parsing user from localStorage:', error)
      return null
    }
  }

  const user = getUserFromStorage()

  // Box Data
  const [boxData, setBoxData] = useState({
    id: null,
    capacity: 18,
    notes: '',
    createdBy: user?.name || 'Unknown',
  })

  // Scanned Serials
  const [scannedSerials, setScannedSerials] = useState([])

  // Serial Input
  const [serialInput, setSerialInput] = useState('')
  const serialInputRef = useRef(null)

  // QR Data
  const [qrData, setQrData] = useState(null)

  // Loading States
  const [isCreatingBox, setIsCreatingBox] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)

  // Auto-focus
  useEffect(() => {
    if (currentStep === 'SCANNING' && serialInputRef.current) {
      serialInputRef.current?.focus()
    }
  }, [currentStep, scannedSerials])

  // ============ STEP 1: CREATE BOX ============
  const handleCreateBox = async (e) => {
    e.preventDefault()

    if (boxData.capacity <= 0) {
      toast.error('Capacity must be greater than 0')
      return
    }

    setIsCreatingBox(true)

    try {
      const payload = {
        capacity: parseInt(boxData.capacity),
        createdBy: boxData.createdBy,
        notes: boxData.notes || undefined,
      }

      const response = await backendGenerate.post('/api/v1/boxes', payload)

      if (response.data.success) {
        const newBoxId = response.data.data?.id || response.data.data?.boxId
        setBoxData((prev) => ({ ...prev, id: newBoxId }))
        setCurrentStep('SCANNING')
        toast.success('Box created successfully! Start scanning serials.')
      } else {
        toast.error(response.data.message || 'Failed to create box')
      }
    } catch (error) {
      console.error('Error creating box:', error)
      toast.error(error.response?.data?.message || 'Failed to create box')
    } finally {
      setIsCreatingBox(false)
    }
  }

  // ============ STEP 2: SCAN SERIALS ============
  const handleScanSerial = async (e) => {
    e.preventDefault()

    const partialCode = serialInput.trim()

    if (!partialCode) {
      toast.error('Please enter a serial number')
      return
    }

    // Check capacity
    if (scannedSerials.length >= boxData.capacity) {
      toast.warning('Box is already full!')
      setSerialInput('')
      return
    }

    // Check duplicate
    const isDuplicate = scannedSerials.some((s) => s.partialCode === partialCode)
    if (isDuplicate) {
      toast.error('Serial already scanned!')
      setSerialInput('')
      serialInputRef.current?.focus()
      return
    }

    setIsScanning(true)

    try {
      // Fetch serial data from API to validate
      const response = await backendGenerate.get('/pln-codes/partial', {
        params: {
          search: partialCode,
          limit: 1,
        },
      })

      if (response.data.success && response.data.data?.data?.length > 0) {
        const serialData = response.data.data.data.find((s) => s.partialCode === partialCode)

        if (!serialData) {
          toast.error('Serial not found in database')
          setSerialInput('')
          serialInputRef.current?.focus()
          return
        }

        // Check if already in a box
        if (serialData.boxId) {
          toast.error('Serial already assigned to another box!')
          setSerialInput('')
          serialInputRef.current?.focus()
          return
        }

        // Check if already printed (optional validation)
        // if (serialData.isPrinted) {
        //   toast.warning('Serial already marked as printed')
        // }

        // Add to scanned list
        setScannedSerials((prev) => [
          ...prev,
          {
            id: serialData.id,
            partialCode: serialData.partialCode,
          },
        ])

        toast.success(`Serial ${partialCode} added!`)
        setSerialInput('')
        serialInputRef.current?.focus()
      } else {
        toast.error('Serial not found')
        setSerialInput('')
        serialInputRef.current?.focus()
      }
    } catch (error) {
      console.error('Error validating serial:', error)
      toast.error(error.response?.data?.message || 'Failed to validate serial')
      setSerialInput('')
      serialInputRef.current?.focus()
    } finally {
      setIsScanning(false)
    }
  }

  const handleRemoveSerial = (serialId) => {
    setScannedSerials((prev) => prev.filter((s) => s.id !== serialId))
    toast.info('Serial removed')
  }

  // ============ STEP 3: FINALIZE BOX ============
  const handleFinalizeBox = async () => {
    if (scannedSerials.length === 0) {
      toast.error('No serials to finalize')
      return
    }

    // Confirmation if not full
    if (scannedSerials.length < boxData.capacity) {
      const confirmed = window.confirm(
        `Box is not full (${scannedSerials.length}/${boxData.capacity}). Continue to finalize?`,
      )
      if (!confirmed) return
    }

    setIsFinalizing(true)

    try {
      // Step 1: Add PLN Codes to Box
      const plnCodeIds = scannedSerials.map((s) => s.id)
      await backendGenerate.post(`/api/v1/boxes/${boxData.id}/add-pln-codes`, {
        plnCodeIds,
      })

      // Step 2: Generate QR Code
      const qrResponse = await backendGenerate.post(`/api/v1/boxes/${boxData.id}/generate-qr`)

      if (qrResponse.data.success) {
        setQrData(qrResponse.data.data)
        setCurrentStep('FINALIZED')
        toast.success('Box finalized successfully!')
      } else {
        toast.error('Failed to generate QR code')
      }
    } catch (error) {
      console.error('Error finalizing box:', error)
      toast.error(error.response?.data?.message || 'Failed to finalize box')
    } finally {
      setIsFinalizing(false)
    }
  }

  // ============ UTILITIES ============
  const handleCreateNewBox = () => {
    // Reset all states
    setCurrentStep('CREATE_BOX')
    setBoxData({
      id: null,
      capacity: 18,
      notes: '',
      createdBy: user?.name || 'Unknown',
    })
    setScannedSerials([])
    setSerialInput('')
    setQrData(null)
    toast.info('Ready to create a new box')
  }

  const handleDownloadQR = () => {
    if (!qrData?.qrCodeUrl && !qrData?.qrCodeBase64) {
      toast.error('No QR code to download')
      return
    }

    const link = document.createElement('a')
    if (qrData.qrCodeUrl) {
      link.href = qrData.qrCodeUrl
    } else {
      link.href = `data:image/png;base64,${qrData.qrCodeBase64}`
    }
    link.download = `box-qr-${boxData.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('QR code downloaded')
  }

  const handlePrintQR = () => {
    if (!qrData?.qrCodeUrl && !qrData?.qrCodeBase64) {
      toast.error('No QR code to print')
      return
    }

    const printWindow = window.open('', '_blank')
    const imgSrc = qrData.qrCodeUrl || `data:image/png;base64,${qrData.qrCodeBase64}`

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code - Box ${boxData.id}</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              flex-direction: column;
            }
            img {
              max-width: 400px;
            }
            h3 {
              margin-top: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <img src="${imgSrc}" alt="Box QR Code" />
          <h3>Box ID: ${boxData.id}</h3>
          <p>Total Serials: ${scannedSerials.length}</p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  // ============ RENDER ============
  return (
    <CRow>
      <CCol xs={12}>
        {/* STEP 1: CREATE BOX */}
        {currentStep === 'CREATE_BOX' && (
          <CCard className="mb-4">
            <CCardHeader>
              <strong>📦 Step 1: Create New Box</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleCreateBox}>
                <FormRow label="Capacity" required>
                  <CFormInput
                    type="number"
                    min="1"
                    value={boxData.capacity}
                    onChange={(e) =>
                      setBoxData((prev) => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))
                    }
                    placeholder="Enter box capacity"
                  />
                </FormRow>

                <FormRow label="Notes">
                  <CFormTextarea
                    rows={3}
                    value={boxData.notes}
                    onChange={(e) => setBoxData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional notes for this box"
                  />
                </FormRow>

                <FormRow label="Created By">
                  <CFormInput value={boxData.createdBy} disabled />
                </FormRow>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <CButton color="primary" type="submit" disabled={isCreatingBox} className="text-white">
                    {isCreatingBox ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating...
                      </>
                    ) : (
                      <>+ Create Box</>
                    )}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        )}

        {/* STEP 2: SCAN SERIALS */}
        {currentStep === 'SCANNING' && (
          <CRow className="g-4 align-items-stretch">
            {/* Left Column - Scan Form & Serial List */}
            <CCol md={8} className="d-flex flex-column">
              {/* Scan Form */}
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>📱 Step 2: Scan Assembly Serial Codes</strong>
                </CCardHeader>
                <CCardBody>
                  <CForm onSubmit={handleScanSerial}>
                    <FormRow label="Serial Number" required>
                      <CFormInput
                        value={serialInput}
                        onChange={(e) => setSerialInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleScanSerial(e)
                          }
                        }}
                        ref={serialInputRef}
                        placeholder="Scan or enter serial number"
                        autoComplete="off"
                        disabled={isScanning || scannedSerials.length >= boxData.capacity}
                      />
                    </FormRow>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <CButton color="secondary" type="submit" disabled={isScanning} className="text-white">
                        {isScanning ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Validating...
                          </>
                        ) : (
                          <>+ Add Serial</>
                        )}
                      </CButton>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>

              {/* Serial List */}
              <SerialListTable
                serials={scannedSerials}
                onRemove={handleRemoveSerial}
                disabled={isFinalizing}
              />
            </CCol>

            {/* Right Column - Box Info */}
            <CCol md={4} className="d-flex flex-column">
              <BoxInfoCard
                boxId={boxData.id}
                capacity={boxData.capacity}
                scannedCount={scannedSerials.length}
                onFinalize={handleFinalizeBox}
                disabled={isFinalizing || scannedSerials.length === 0}
                loading={isFinalizing}
              />
            </CCol>
          </CRow>
        )}

        {/* STEP 3: FINALIZED - QR CODE */}
        {currentStep === 'FINALIZED' && (
          <CRow>
            <CCol md={{ span: 6, offset: 3 }}>
              <QRDisplayCard
                qrData={qrData}
                boxId={boxData.id}
                serialCount={scannedSerials.length}
                onCreateNew={handleCreateNewBox}
                onDownload={handleDownloadQR}
                onPrint={handlePrintQR}
              />
            </CCol>
          </CRow>
        )}
      </CCol>
    </CRow>
  )
}

export default GenerateBoxSerial
