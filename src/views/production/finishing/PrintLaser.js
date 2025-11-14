import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
  CFormSwitch,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { backendGenerate, backendQc, backendTracking } from '../../../api/axios'
import PlnSerialCard from '../../components/PlnSerialCard'
import ErrorCard from '../../components/ErrorCard'
import SuccessCard from '../../components/SuccessCard'
import { CounterCard6 } from '../../components/CounterCard'
import '../../../scss/style.scss'

const FormRow = ({ label, children }) => (
  <CRow className="mb-3 align-items-center">
    <CCol md={4}>
      <CFormLabel className="fw-semibold">{label}</CFormLabel>
    </CCol>
    <CCol md={8}>{children}</CCol>
  </CRow>
)

const PrintLaser = () => {
  const location = useLocation()

  // States untuk flow control
  const [currentStep, setCurrentStep] = useState('SCAN_SERIAL') // SCAN_SERIAL, QC_QUESTIONS, PRINT_READY, PRINTING, SCAN_RESULT, COMPLETED

  // States untuk data
  const [serialNumber, setSerialNumber] = useState('')
  const [generatedPlnSerial, setGeneratedPlnSerial] = useState('')
  const [scannedPlnSerial, setScannedPlnSerial] = useState('')
  const [productData, setProductData] = useState(null)
  const [trackingProduct, setTrackingProduct] = useState(null)

  // States untuk QC
  const [questionData, setQuestionData] = useState([])
  const [answers, setAnswers] = useState({})
  const [qcName, setQcName] = useState('')
  const [notes, setNotes] = useState('')

  // States untuk UI
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorSerialNumber, setErrorSerialNumber] = useState(null)
  const [isSerialLocked, setIsSerialLocked] = useState(false)
  const [showPrintButton, setShowPrintButton] = useState(false)

  // Refs
  const serialInputRef = useRef(null)
  const scanResultInputRef = useRef(null)

  // Tentukan post
  let postName = 'Post ?'
  let lasserNo = 0
  if (location.pathname.includes('post1')) {
    postName = 'Post 1'
    lasserNo = 1
  } else if (location.pathname.includes('post2')) {
    postName = 'Post 2'
    lasserNo = 2
  }

  // QC ID untuk print laser
  const qcIdPrintLaser = `QC-PRINT-LASER-${lasserNo}`

  // Ambil user dari localStorage
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

  // fokus otomatis saat page load / nav pindah
  useEffect(() => {
    serialInputRef.current?.focus()
  }, [location.pathname])

  // Reset semua states
  const resetStates = () => {
    setCurrentStep('SCAN_SERIAL')
    setSerialNumber('')
    setGeneratedPlnSerial('')
    setScannedPlnSerial('')
    setProductData(null)
    setTrackingProduct(null)
    setQuestionData([])
    setAnswers({})
    setQcName('')
    setNotes('')
    setErrorMessage(null)
    setErrorSerialNumber(null)
    setIsSerialLocked(false)
    setShowPrintButton(false)
    serialInputRef.current?.focus()
  }

  // ============ STEP 1-4: Scan Serial, Validasi, Generate PLN, Fetch QC ============
  const handleSerialScan = async (e) => {
    e.preventDefault()
    if (!serialNumber) {
      toast.error('Serial number cannot be empty')
      return
    }

    const currentSerialNumber = serialNumber

    try {
      // STEP 1-2: Validasi serial number
      const validateRes = await backendGenerate.post('/validate', {
        serialCode: currentSerialNumber,
      })

      if (!validateRes.data.data?.isValid) {
        setErrorMessage(validateRes.data.data.message || 'Invalid serial')
        setErrorSerialNumber(currentSerialNumber)
        setSerialNumber('')
        return
      }

      // STEP 3: Generate PLN Serial (DUMMY untuk sekarang)
      const dummyPlnSerial = `PLN-${lasserNo}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-6)}`
      setGeneratedPlnSerial(dummyPlnSerial)
      // Lock serial input
      setIsSerialLocked(true)

      // STEP 4: Fetch QC Questions
      await fetchQcValidation(currentSerialNumber)
    } catch (err) {
      console.error(err)
      const errorMsg = err.response?.data?.message || 'Terjadi kesalahan validasi'
      setErrorMessage(errorMsg)
      setErrorSerialNumber(currentSerialNumber)
      setSerialNumber('')
    }
  }

  // Fetch QC Validation dan Questions
  const fetchQcValidation = async (serialNumber) => {
    try {
      const response = await backendQc.get('/validation', {
        params: {
          serial_number: serialNumber,
          qc_id: qcIdPrintLaser,
        },
      })

      if (response.data.valid === true) {
        setErrorMessage(null)
        setErrorSerialNumber(null)

        // Convert object questions → array
        const convertedQuestions = Object.entries(response.data.questions).map(([id, text]) => ({
          id: Number(id),
          question: text,
        }))

        setQcName(response.data.category)
        setQuestionData(convertedQuestions)

        // Inisialisasi semua jawaban default ke true
        const initialAnswers = {}
        convertedQuestions.forEach((q) => {
          initialAnswers[q.id] = true
        })
        setAnswers(initialAnswers)

        // Fetch product data
        await fetchProduct(serialNumber)

        // Update step
        setCurrentStep('QC_QUESTIONS')
        toast.success('Serial valid! Silakan jawab pertanyaan QC.')
      } else {
        const errorMsg = response.data.message ?? 'Serial tidak bisa masuk tahap print laser'
        setErrorMessage(errorMsg)
        setErrorSerialNumber(serialNumber)
        setSerialNumber('')
        setIsSerialLocked(false)
      }
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || 'Gagal validasi QC'
      setErrorMessage(errorMsg)
      setErrorSerialNumber(serialNumber)
      setSerialNumber('')
      setIsSerialLocked(false)
    }
  }

  // Fetch product data
  const fetchProduct = async (serialNumber) => {
    try {
      const response = await backendTracking.get(`/serial/${serialNumber}`)

      if (response.data.success === true) {
        setProductData(response.data.data)

        const assemblyId = response.data.data.assembly_id
        if (assemblyId) {
          await fetchTrackingProduct(assemblyId)
        }
      } else {
        const errorMsg = response.data.message || 'Failed get product data'
        setErrorMessage(errorMsg)
        setErrorSerialNumber(serialNumber)
      }
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || 'ERROR get data product'
      setErrorMessage(errorMsg)
      setErrorSerialNumber(serialNumber)
    }
  }

  // Fetch tracking product untuk counter
  const fetchTrackingProduct = async (assemblyId) => {
    try {
      const response = await backendTracking.get('/sample-inspections/quantity-summary', {
        params: {
          assembly_id: assemblyId,
          qc_id: qcIdPrintLaser,
        },
      })
      setTrackingProduct(response.data.data)
    } catch (error) {
      console.error('Error fetching tracking:', error)
    }
  }

  // ============ STEP 6-7: Validasi QC dan Print ============
  const handleQcSubmit = async (e) => {
    e.preventDefault()

    // Cek apakah semua jawaban Pass (true)
    const allPass = Object.values(answers).every((answer) => answer === true)

    if (!allPass) {
      setErrorMessage('Tidak semua pertanyaan QC dijawab Ya (Pass). Tidak bisa lanjut print!')
      setErrorSerialNumber(serialNumber)
      toast.error('QC tidak Pass! Perbaiki jawaban untuk melanjutkan.')
      return
    }

    // Jika semua Pass, tampilkan tombol Print
    setShowPrintButton(true)
    setCurrentStep('PRINT_READY')
    toast.success('QC Pass! Silakan klik tombol Print Laser.')
  }

  // ============ STEP 8-9: Print Laser ============
  const handlePrintLaser = async () => {
    setCurrentStep('PRINTING')

    try {
      const lasserRes = await backendGenerate.post('/lassered', {
        serialNumber: serialNumber,
        lasser: lasserNo,
        plnSerial: generatedPlnSerial, // kirim PLN serial jika diperlukan
      })

      if (lasserRes.data.success) {
        toast.success('PRINT SELESAI! Silakan scan hasil print laser.')
        setCurrentStep('SCAN_RESULT')

        // Focus ke input scan hasil
        setTimeout(() => {
          scanResultInputRef.current?.focus()
        }, 100)
      } else {
        toast.error(lasserRes.data.message || 'Print gagal')
        setCurrentStep('PRINT_READY')
      }
    } catch (err) {
      console.error(err)
      const errorMsg = err.response?.data?.message || 'Terjadi kesalahan saat print'
      toast.error(errorMsg)
      setCurrentStep('PRINT_READY')
    }
  }

  // ============ STEP 10-12: Scan Hasil Print dan Compare ============
  const handleScanResult = async (e) => {
    e.preventDefault()

    if (!scannedPlnSerial) {
      toast.error('Silakan scan hasil print laser')
      return
    }

    // Compare dengan PLN Serial yang di-generate
    if (scannedPlnSerial.trim() === generatedPlnSerial.trim()) {
      // SAMA - Submit QC ke backend
      await submitQcToBackend()
    } else {
      // BEDA - Error
      setErrorMessage(
        `Serial tidak cocok!\nGenerated: ${generatedPlnSerial}\nScanned: ${scannedPlnSerial}`,
      )
      setErrorSerialNumber(scannedPlnSerial)
      toast.error('Serial hasil print tidak sesuai!')
    }
  }

  // Submit QC ke backend setelah print berhasil
  const submitQcToBackend = async () => {
    if (!user || !user.id || !user.name) {
      toast.error('User tidak ditemukan di localStorage!')
      return
    }

    const payload = {
      serial_number: serialNumber,
      pln_serial: generatedPlnSerial,
      inspector_by: user.id,
      inspector_name: user.name,
      qc_name: qcName,
      qc_id: qcIdPrintLaser,
      qc_place: 'Workshop A',
      tracking_id: productData?.id,
      batch: productData?.batch,
      notes: notes,
      answers,
      lasser_no: lasserNo,
    }

    try {
      const res = await backendQc.post('/submit', payload)

      const qcStatus = res.data?.data?.qcStatus ?? ''
      const messageShow = (
        <span>
          {res.data?.message ?? 'QC Submit berhasil'}. QC Status:{' '}
          <span style={{ color: qcStatus.toUpperCase() === 'FAIL' ? 'red' : 'green' }}>
            {qcStatus}
          </span>
        </span>
      )

      toast.success(messageShow)
      setCurrentStep('COMPLETED')

      // Tampilkan success card sebentar, lalu reset
      setTimeout(() => {
        resetStates()
      }, 3000)
    } catch (error) {
      console.error('QC submit error:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Gagal submit QC'
      setErrorMessage(errorMsg)
      setErrorSerialNumber(serialNumber)
      toast.error(errorMsg)
    }
  }

  // Handle keydown untuk input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (currentStep === 'SCAN_SERIAL') {
        handleSerialScan(e)
      } else if (currentStep === 'SCAN_RESULT') {
        handleScanResult(e)
      }
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CRow className="g-4 align-items-stretch">
          {/* Kolom Kiri - Form & Questions */}
          <CCol md={8} className="d-flex flex-column">
            {/* Card Serial Number & Notes */}
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Print Laser {postName}</strong>
              </CCardHeader>
              <CCardBody>
                <FormRow label="Product Name">
                  <div className="fw-semibold">{productData?.product?.name ?? '-'}</div>
                </FormRow>

                <FormRow label="Serial Number">
                  <CFormInput
                    name="serialNumber"
                    placeholder="Scan or input serial number"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    onKeyDown={handleKeyDown}
                    ref={serialInputRef}
                    disabled={isSerialLocked}
                  />
                </FormRow>

                {/* Input Scan Hasil Print - muncul setelah print */}
                {currentStep === 'SCAN_RESULT' && (
                  <FormRow label="Scan Hasil Print">
                    <CFormInput
                      name="scannedPlnSerial"
                      placeholder="Scan hasil print laser"
                      value={scannedPlnSerial}
                      onChange={(e) => setScannedPlnSerial(e.target.value)}
                      onKeyDown={handleKeyDown}
                      ref={scanResultInputRef}
                      autoComplete="off"
                    />
                  </FormRow>
                )}

                <FormRow label="Notes">
                  <CFormTextarea
                    rows={3}
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catatan tambahan (opsional)"
                  />
                </FormRow>
              </CCardBody>
            </CCard>

            {/* Card QC Questions */}
            {(currentStep === 'QC_QUESTIONS' ||
              currentStep === 'PRINT_READY' ||
              currentStep === 'PRINTING' ||
              currentStep === 'SCAN_RESULT') && (
              <CCard className="mb-4 flex-grow-1">
                <CCardHeader>
                  <strong>Quality Control - {qcName}</strong>
                </CCardHeader>
                <CCardBody>
                  <CForm onSubmit={handleQcSubmit}>
                    {questionData.length === 0 ? (
                      <p className="text-muted">Questions not yet available...</p>
                    ) : (
                      questionData.map((q) => (
                        <div
                          key={q.id}
                          className="border rounded p-3 mb-3 d-flex align-items-center justify-content-between"
                        >
                          <CFormLabel className="mb-0">{q.question}</CFormLabel>
                          <CFormSwitch
                            name={`question-${q.id}`}
                            label={answers[q.id] ? 'Ya' : 'Tidak'}
                            checked={!!answers[q.id]}
                            onChange={(e) =>
                              setAnswers((prev) => ({
                                ...prev,
                                [q.id]: e.target.checked,
                              }))
                            }
                            disabled={currentStep !== 'QC_QUESTIONS'}
                          />
                        </div>
                      ))
                    )}

                    {/* Tombol Submit QC */}
                    {currentStep === 'QC_QUESTIONS' && questionData.length > 0 && !errorMessage && (
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="primary" type="submit">
                          Submit QC
                        </CButton>
                      </div>
                    )}

                    {/* Tombol Print Laser */}
                    {currentStep === 'PRINT_READY' && showPrintButton && (
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="success" onClick={handlePrintLaser} size="lg">
                          🖨️ Print Laser
                        </CButton>
                      </div>
                    )}

                    {/* Status Printing */}
                    {currentStep === 'PRINTING' && (
                      <div className="text-center p-4">
                        <div className="spinner-border text-primary mb-3" role="status">
                          <span className="visually-hidden">Printing...</span>
                        </div>
                        <p className="text-muted">Printing in progress...</p>
                      </div>
                    )}
                  </CForm>
                </CCardBody>
              </CCard>
            )}
          </CCol>

          {/* Kolom Kanan - PLN Serial Card, Counter, Error/Success */}
          <CCol md={4} className="d-flex flex-column">
            {/* PLN Serial Card */}
            {generatedPlnSerial && (
              <PlnSerialCard
                plnSerial={generatedPlnSerial}
                productName={productData?.product?.name}
              />
            )}

            {/* Error Card */}
            {errorMessage && <ErrorCard serialNumber={errorSerialNumber} message={errorMessage} />}

            {/* Success Card */}
            {currentStep === 'COMPLETED' && (
              <SuccessCard
                serialNumber={serialNumber}
                message="Print Laser dan QC berhasil!"
                additionalInfo={`PLN Serial: ${generatedPlnSerial}`}
              />
            )}

            {/* Counter Card */}
            {trackingProduct && !errorMessage && currentStep !== 'COMPLETED' && (
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Counter</strong>
                </CCardHeader>
                <CCardBody>
                  <CRow className="mb-3">
                    <CounterCard6
                      title="Required Quantity"
                      value={trackingProduct?.quantity_summary?.total_quantity ?? `-`}
                    />
                    <CounterCard6
                      title="Remaining Quantity"
                      value={trackingProduct?.quantity_summary?.remaining_quantity ?? `-`}
                    />
                    <CounterCard6
                      title="Pass Quantity"
                      value={trackingProduct?.quantity_summary?.pass_quantity ?? `-`}
                    />
                    <CounterCard6
                      title="Fail Quantity"
                      value={trackingProduct?.quantity_summary?.fail_quantity ?? `-`}
                    />
                  </CRow>
                </CCardBody>
              </CCard>
            )}
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  )
}

export default PrintLaser
