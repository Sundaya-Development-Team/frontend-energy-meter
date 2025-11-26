import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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
  const { qcIdParams, postNameParams, qcPlaceParams } = useParams()

  // States untuk flow control
  const [currentStep, setCurrentStep] = useState('SCAN_SERIAL') // SCAN_SERIAL, QC_QUESTIONS, PRINT_READY, PRINTING, SCAN_RESULT, COMPLETED

  // States untuk data
  const [serialNumber, setSerialNumber] = useState('')
  const [generatedPlnSerial, setGeneratedPlnSerial] = useState('')
  const [scannedPlnSerial, setScannedPlnSerial] = useState('')
  const [productData, setProductData] = useState(null)
  const [trackingProduct, setTrackingProduct] = useState(null)
  const [forceShowQuestions, setForceShowQuestions] = useState(false)

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

  // Tentukan post dari params
  // Cara 1: Dari postNameParams (contoh: "Post 1" atau "Post 2")
  // Cara 2: Dari qcIdParams (contoh: "QC-LE016-1" atau "QC-LE016-2")
  let lasserNo = 0
  let postName = 'Post ?'

  if (postNameParams) {
    // Extract angka dari "Post 1" atau "Post 2"
    const postMatch = postNameParams.match(/(\d+)/)
    if (postMatch) {
      lasserNo = parseInt(postMatch[1]) || 0
      postName = postNameParams
    }
  }

  // Jika belum dapat dari postNameParams, coba dari qcIdParams
  if (lasserNo === 0 && qcIdParams) {
    // Extract angka dari "QC-LE016-1" atau "QC-LE016-2"
    const qcMatch = qcIdParams.match(/-(\d+)$/)
    if (qcMatch) {
      lasserNo = parseInt(qcMatch[1]) || 0
      postName = `Post ${lasserNo}`
    }
  }

  // QC ID untuk print laser dari params
  const qcIdPrintLaser =
    (qcIdParams || `QC-LE016-${lasserNo || 1}`).replace(/-\d+$/, '') || 'QC-LE016'

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

  // Reset semua states
  const resetStates = () => {
    setCurrentStep('SCAN_SERIAL')
    setSerialNumber('')
    setGeneratedPlnSerial('')
    setScannedPlnSerial('')
    setProductData(null)
    setTrackingProduct(null)
    setForceShowQuestions(false)
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

  // fokus otomatis saat page load / nav pindah
  useEffect(() => {
    resetStates()
  }, [qcIdParams, postNameParams, qcPlaceParams])

  // ============ STEP 1: Scan Serial, Validasi QC (ambil pertanyaan tapi jangan tampilkan) ============
  const handleSerialScan = async (e) => {
    e.preventDefault()
    if (!serialNumber) {
      toast.error('Serial number cannot be empty')
      return
    }

    const currentSerialNumber = serialNumber

    try {
      // STEP 1: Validasi QC dan ambil pertanyaan (tapi jangan tampilkan dulu)
      await fetchQcValidation(currentSerialNumber)
    } catch (err) {
      console.error(err)
      const errorMsg = err.response?.data?.message || 'Terjadi kesalahan validasi'
      setErrorMessage(errorMsg)
      setErrorSerialNumber(currentSerialNumber)
      setSerialNumber('')
    }
  }

  // STEP 1: Fetch QC Validation dan Questions (simpan tapi jangan tampilkan)
  const fetchQcValidation = async (serialNumber) => {
    try {
      const response = await backendQc.get('/validation', {
        params: {
          serial_number: serialNumber,
          qc_id: qcIdPrintLaser,
          pln_code_id: serialNumber, // pakai serial assembly
        },
      })

      if (response.data.valid === true) {
        setErrorMessage(null)
        setErrorSerialNumber(null)

        // Convert object questions → array dan SIMPAN (jangan tampilkan dulu)
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

        // Lock serial input
        setIsSerialLocked(true)

        // STEP 2: Generate PLN Code
        await generatePlnCode(serialNumber)
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

  // STEP 2: Generate PLN Code
  const generatePlnCode = async (serialNumber) => {
    try {
      const response = await backendGenerate.patch(`/pln-codes/${serialNumber}/add-material`)

      if (response.data.success) {
        const plnSerial = response.data.data?.fullCode || ''
        setGeneratedPlnSerial(plnSerial)

        // Fetch product data
        await fetchProduct(serialNumber)

        const currentStatus = response.data.data?.status

        const normalizedStatus = currentStatus?.toUpperCase()

        if (normalizedStatus === 'LASERED') {
          // Serial sudah pernah selesai proses print laser, lanjutkan langsung ke scan hasil
          setShowPrintButton(false)
          setForceShowQuestions(true)
          setCurrentStep('SCAN_RESULT')
          toast.info('Serial telah diproses. Silakan scan hasil print dan lanjutkan QC.')
        } else {
          // Update step ke PRINT_READY (tampilkan PLN dan tombol print)
          setCurrentStep('PRINT_READY')
          setShowPrintButton(true)
          setForceShowQuestions(false)
          toast.success('PLN Serial berhasil di-generate! Silakan klik tombol Print.')
        }
      } else {
        const errorMsg = response.data.message || 'Gagal generate PLN Serial'
        setErrorMessage(errorMsg)
        setErrorSerialNumber(serialNumber)
        setSerialNumber('')
        setIsSerialLocked(false)
      }
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || 'Gagal generate PLN Serial'
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

  // ============ STEP 5-6: Print Laser (kirim perintah ke mesin) ============
  const handlePrintLaser = async () => {
    setCurrentStep('PRINTING')

    if (!user || !user.name) {
      toast.error('User tidak ditemukan di localStorage!')
      setCurrentStep('PRINT_READY')
      return
    }

    try {
      const response = await backendGenerate.patch(`/pln-codes/${serialNumber}/mark-lasered`, {
        station: lasserNo, // station 1 atau 2 sesuai post yang dipilih
        laseredBy: user.name, // nama operator dari localStorage
        laserNotes: notes || 'Laser marking completed successfully', // notes dari form atau default
      })

      if (response.data.success) {
        toast.success('PRINT SELESAI! Silakan scan hasil print laser.')
        setCurrentStep('SCAN_RESULT')

        // Focus ke input scan hasil
        setTimeout(() => {
          scanResultInputRef.current?.focus()
        }, 100)
      } else {
        toast.error(response.data.message || 'Print gagal')
        setCurrentStep('PRINT_READY')
      }
    } catch (err) {
      console.error(err)
      const errorMsg = err.response?.data?.message || 'Terjadi kesalahan saat print'
      toast.error(errorMsg)
      setCurrentStep('PRINT_READY')
    }
  }

  // ============ STEP 7-8: Scan Hasil Print dan Compare, lalu tampilkan QC Questions ============
  const handleScanResult = async (e) => {
    e.preventDefault()

    if (!scannedPlnSerial) {
      toast.error('Silakan scan hasil print laser')
      return
    }

    // Compare dengan PLN Serial yang di-generate
    if (scannedPlnSerial.trim() === generatedPlnSerial.trim()) {
      // SAMA - Tampilkan QC Questions
      setCurrentStep('QC_QUESTIONS')
      setForceShowQuestions(false)
      setErrorMessage(null)
      toast.success('Serial cocok! Silakan jawab pertanyaan QC.')
    } else {
      // BEDA - Error
      setErrorMessage(
        `Serial tidak cocok!\nGenerated:\n${generatedPlnSerial}\nScanned:\n${scannedPlnSerial}`,
      )
      setErrorSerialNumber(scannedPlnSerial)
      toast.error('Serial hasil print tidak sesuai!')
      setScannedPlnSerial('')
      setTimeout(() => {
        scanResultInputRef.current?.focus()
      }, 100)
    }
  }

  // ============ STEP 9: Submit QC ============
  const handleQcSubmit = async (e) => {
    e.preventDefault()

    // Cek apakah semua jawaban Pass (true)
    const allPass = Object.values(answers).every((answer) => answer === true)

    if (!allPass) {
      setErrorMessage('Tidak semua pertanyaan QC dijawab Ya (Pass). Tidak bisa submit!')
      setErrorSerialNumber(serialNumber)
      toast.error('QC tidak Pass! Perbaiki jawaban untuk melanjutkan.')
      return
    }

    // Jika semua Pass, submit QC
    await submitQcToBackend()
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
      qc_place: qcPlaceParams || 'Print Stages',
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

      if (productData?.assembly_id) {
        await fetchTrackingProduct(productData.assembly_id)
      }

      setTimeout(() => {
        resetStates()
        serialInputRef.current?.focus()
      }, 0)
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
        {/* PLN Serial Card Full Width */}
        {generatedPlnSerial &&
          (currentStep === 'PRINT_READY' ||
            currentStep === 'PRINTING' ||
            currentStep === 'SCAN_RESULT' ||
            currentStep === 'QC_QUESTIONS') && (
            <div className="mb-4">
              <PlnSerialCard plnSerial={generatedPlnSerial} productName={productData?.product?.name} />
            </div>
          )}

        <CRow className="g-4 align-items-stretch">
          {/* Kolom Kiri - Form & Questions */}
          <CCol md={8} className="d-flex flex-column">
            {/* Card Serial Number & Notes */}
            <CCard className="mb-4 flex-grow-1 d-flex flex-column">
              <CCardHeader>
                <strong>Print Laser {postName}</strong>
              </CCardHeader>
              <CCardBody className="flex-grow-1 d-flex flex-column">
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
            {(currentStep === 'SCAN_RESULT' || forceShowQuestions) && (
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

            {/* Card Tombol Print Laser - muncul setelah generate PLN */}
            {currentStep === 'PRINT_READY' && showPrintButton && !errorMessage && (
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Print Laser Ready</strong>
                </CCardHeader>
                <CCardBody>
                  <div className="d-grid gap-2">
                    <CButton color="success" onClick={handlePrintLaser} size="lg">
                      🖨️ Print Laser {postName}
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            )}

            {/* Status Printing */}
            {currentStep === 'PRINTING' && (
              <CCard className="mb-4">
                <CCardBody>
                  <div className="text-center p-4">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Printing...</span>
                    </div>
                    <p className="text-muted">Printing in progress...</p>
                  </div>
                </CCardBody>
              </CCard>
            )}

            {/* Card QC Questions - muncul setelah scan hasil print cocok */}
            {(currentStep === 'QC_QUESTIONS' || forceShowQuestions) && (
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
                          />
                        </div>
                      ))
                    )}

                    {/* Tombol Submit QC */}
                    {questionData.length > 0 && !errorMessage && currentStep === 'QC_QUESTIONS' && (
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="primary" type="submit">
                          Submit QC
                        </CButton>
                      </div>
                    )}
                  </CForm>
                </CCardBody>
              </CCard>
            )}
          </CCol>

          {/* Kolom Kanan - PLN Serial Card, Counter, Error/Success */}
          <CCol md={4} className="d-flex flex-column">

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
              <CCard className="mb-4 flex-grow-1 d-flex flex-column">
                <CCardHeader>
                  <strong>Counter</strong>
                </CCardHeader>
                <CCardBody className="flex-grow-1 d-flex flex-column justify-content-center">
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
