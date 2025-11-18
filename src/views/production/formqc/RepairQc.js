import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {
  CRow,
  CCard,
  CCol,
  CCardBody,
  CCardHeader,
  CBadge,
  CFormLabel,
  CFormInput,
  CButton,
  CForm,
  CFormTextarea,
  CFormSwitch,
} from '@coreui/react'

import { backendQc, backendTracking } from '../../../api/axios'
import { toast } from 'react-toastify'
import { CounterCard6 } from '../../components/CounterCard'
import SuccessCard from '../../components/SuccessCard'
import { useAuth } from '../../../context/AuthContext'
import '../../../scss/style.scss'

const FormRow = ({ label, children }) => (
  <CRow className="mb-3 align-items-center">
    <CCol md={4}>
      <CFormLabel className="fw-semibold">{label}</CFormLabel>
    </CCol>
    <CCol md={8}>{children}</CCol>
  </CRow>
)

const QcAqlSerial = () => {
  const { user } = useAuth()
  const { qcIdParams } = useParams()
  const [productData, setProductData] = useState(null)
  // const [trackingProduct, setTrackingProduct] = useState(null)
  const [answers, setAnswers] = useState({})
  const [questionData, setQuestionData] = useState([])
  const [qcName, setQcName] = useState([])
  const qcCodeSerial = qcIdParams
  const [formData, setFormData] = useState({ serialNumber: '' })
  const [isFormLocked, setIsFormLocked] = useState(false)
  const serialNumberInputRef = useRef(null)
  const [repairInfo, setRepairInfo] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorSerialNumber, setErrorSerialNumber] = useState(null)
  const [successValidation, setSuccessValidation] = useState(null) // untuk success card

  const resetStates = () => {
    setProductData(null)
    // setTrackingProduct(null)
    setQuestionData([])
    setAnswers({})
    setRepairInfo(null)
    setFormData({ serialNumber: '', notes: '' })
    setErrorMessage(null)
    setErrorSerialNumber(null)
    setSuccessValidation(null)
    setIsFormLocked(false)
  }

  useEffect(() => {
    resetStates()
    serialNumberInputRef.current.focus()
    console.clear()
  }, [qcIdParams])

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSerial = () => {
    console.log('Serial Number di-scan:', formData.serialNumber)

    // Simpan serial number sebelum reset
    const currentSerialNumber = formData.serialNumber

    // Bersihkan semua state dan clear input field
    setProductData(null)
    setQuestionData([])
    setAnswers({})
    setRepairInfo(null)
    setErrorMessage(null)
    setErrorSerialNumber(null)
    setSuccessValidation(null)
    setFormData({ serialNumber: '', notes: '' })

    // Panggil fetch validasi serial
    fetchValidationSnumb(currentSerialNumber)
  }
  // Fetch validation serial number
  const fetchValidationSnumb = async (serialNumber) => {
    console.log('qcCodeSerial :', qcCodeSerial)
    try {
      const response = await backendQc.get('/validation', {
        params: {
          serial_number: serialNumber,
          qc_id: qcCodeSerial,
        },
      })

      if (response.data.valid === true) {
        setErrorMessage(null)
        setErrorSerialNumber(null)

        // Set success validation untuk success card
        setSuccessValidation({
          serialNumber: serialNumber,
          message: response.data.message ?? 'Serial number valid for repair',
        })

        const convertedQuestions = Object.entries(response.data.questions).map(([id, text]) => ({
          id: Number(id),
          question: text,
        }))

        setQcName(response.data.fail_qc_name)
        setQuestionData(convertedQuestions)

        const initialAnswers = {}
        convertedQuestions.forEach((q) => {
          initialAnswers[q.id] = true
        })
        setAnswers(initialAnswers)

        // simpan info mode repair
        setRepairInfo({
          mode: response.data.mode,
          message: response.data.message,
          fail_qc_id: response.data.fail_qc_id,
          fail_qc_name: response.data.fail_qc_name,
        })

        fetchProduct(serialNumber)
      } else {
        const errorMsg = response.data.message ?? 'Serial number already scan'
        setErrorMessage(errorMsg)
        // Simpan serial number untuk ditampilkan di error card (input field tetap kosong)
        setErrorSerialNumber(serialNumber)
        // toast.error(errorMsg)
      }
    } catch (error) {
      console.log('ERROR')
      const errorMsg = error.response?.data?.message || 'Serial Number Validation Failed'
      setErrorMessage(errorMsg)
      // Simpan serial number untuk ditampilkan di error card (input field tetap kosong)
      setErrorSerialNumber(serialNumber)
      // toast.error(errorMsg)
    }
  }

  const fetchProduct = async (serialNumber) => {
    console.log('masuk fetch product')
    try {
      const response = await backendTracking.get(`/serial/${serialNumber}`)

      if (response.data.success == true) {
        // toast.success(response.data.message || 'Serial number valid')
        setProductData(response.data.data)

        // isi kembali serial number di form
        setFormData((prev) => ({
          ...prev,
          serialNumber: serialNumber,
        }))

        // Lock serial number field setelah berhasil fetch data
        setIsFormLocked(true)

        const assemblyId = response.data.data.assembly_id
        console.log('assemblyId :', assemblyId)
      } else {
        const errorMsg = response.data.message || 'Failed get product data'
        setErrorMessage(errorMsg)
        // Simpan serial number untuk ditampilkan di error card (input field tetap kosong)
        setErrorSerialNumber(serialNumber)
        // toast.error(errorMsg)
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'ERROR get data product'
      setErrorMessage(errorMsg)
      // Simpan serial number untuk ditampilkan di error card (input field tetap kosong)
      setErrorSerialNumber(serialNumber)
      // toast.error(errorMsg)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <CBadge color="warning">Pending</CBadge>
      case 'complete':
        return <CBadge color="success">Complete</CBadge>
      case 'reject':
        return <CBadge color="danger">Reject</CBadge>
      default:
        return <CBadge color="secondary">{status}</CBadge>
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validasi field wajib
    if (!productData?.serial_number) {
      const errorMsg = 'Serial number wajib diisi!'
      setErrorMessage(errorMsg)
      // toast.error(errorMsg)
      return
    }
    if (!user || !user.id || !user.username) {
      const errorMsg = 'User tidak ditemukan, silakan login kembali!'
      setErrorMessage(errorMsg)
      // toast.error(errorMsg)
      return
    }
    if (!qcName) {
      const errorMsg = 'QC Name wajib diisi!'
      setErrorMessage(errorMsg)
      // toast.error(errorMsg)
      return
    }
    if (!qcCodeSerial) {
      const errorMsg = 'QC ID wajib diisi!'
      setErrorMessage(errorMsg)
      // toast.error(errorMsg)
      return
    }

    if (Object.keys(answers).length === 0) {
      const errorMsg = 'Jawaban pertanyaan QC wajib diisi!'
      setErrorMessage(errorMsg)
      // toast.error(errorMsg)
      return
    }

    const payload = {
      serial_number: productData.serial_number,
      inspector_by: user?.id,
      inspector_name: user?.username,
      qc_name: 'qc-repair-mode',
      qc_id: qcCodeSerial,
      qc_place: 'Workshop Repair',
      tracking_id: productData.id,
      batch: productData.batch,
      notes: formData.notes,
      fail_qc_id: repairInfo.fail_qc_id,
      fail_qc_name: repairInfo.fail_qc_name,
      answers,
    }

    try {
      const res = await backendQc.post('/submit', payload)

      const qcStatus = res.data?.data?.qcStatus ?? ''
      const messageShow = (
        <span>
          {res.data?.message ?? ''}. QC Status :{' '}
          <span style={{ color: qcStatus.toUpperCase() === 'FAIL' ? 'red' : 'green' }}>
            {qcStatus}
          </span>
        </span>
      )

      toast.success(messageShow)
      setErrorMessage(null)
      serialNumberInputRef.current.focus()
    } catch (error) {
      console.error('QC submit error:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Gagal submit QC'
      setErrorMessage(errorMsg)
      // Simpan serial number untuk ditampilkan di error card (input field tetap kosong)
      const currentSerialNumber = productData?.serial_number || formData.serialNumber
      if (currentSerialNumber) {
        setErrorSerialNumber(currentSerialNumber)
      }
      // toast.error(errorMsg)
      return // Jangan reset states jika ada error
    }

    // Bersihkan semua state hanya jika submit berhasil
    resetStates()
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CRow className="g-4 mb-4">
          {/* Scan Serial Number */}
          <CCol md={4}>
            <CCard className="mb-4 h-100">
              <CCardHeader>
                <strong>Product Name : {productData?.product?.name ?? '-'}</strong>
              </CCardHeader>
              <CCardBody>
                <FormRow label="Production Serial Number">
                  <CFormInput
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSerial()
                      }
                    }}
                    ref={serialNumberInputRef}
                    disabled={isFormLocked}
                  />
                </FormRow>
                <FormRow label="Notes">
                  <CFormTextarea
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInput}
                  />
                </FormRow>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Detail */}
          <CCol md={4}>
            <CCard className="mb-4 h-100">
              <CCardHeader>
                <strong>Detail</strong>
              </CCardHeader>
              <CCardBody>
                <FormRow label="Product Detail :"></FormRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <div className="fw-semibold">Item Code</div>
                    <div> {productData?.code_item ?? '-'}</div>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={4}>
                    <div className="fw-semibold">Mode</div>
                    <div>{repairInfo?.mode ?? '-'}</div>
                  </CCol>
                  <CCol md={4}>
                    <div className="fw-semibold">Fail QC ID</div>
                    <div>{repairInfo?.fail_qc_id ?? '-'}</div>
                  </CCol>
                  <CCol md={4}>
                    <div className="fw-semibold">Fail QC Name</div>
                    <div>{repairInfo?.fail_qc_name ?? '-'}</div>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  {' '}
                  <CCol md={12}>
                    <div className="fw-semibold">Message Status</div>
                    <div>{repairInfo?.message ?? '-'}</div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Error Card, Success Card, atau Status Info */}
          <CCol md={4}>
            {errorMessage ? (
              /* Error Card */
              <CCard className="mb-4 h-100 d-flex flex-column error-card">
                <CCardHeader className="error-card-header">
                  <strong>⚠️ Error</strong>
                </CCardHeader>
                <CCardBody className="d-flex flex-column justify-content-center align-items-center flex-grow-1 error-card-body">
                  <div className="text-center">
                    <div className="error-icon">❌</div>
                    <h4 className="error-title">ERROR</h4>
                    {errorSerialNumber && (
                      <div className="error-serial-number">Serial: {errorSerialNumber}</div>
                    )}
                    <p className="error-message">{errorMessage}</p>
                  </div>
                </CCardBody>
              </CCard>
            ) : successValidation ? (
              /* Success Card */
              <SuccessCard
                serialNumber={successValidation.serialNumber}
                message={successValidation.message}
              />
            ) : (
              /* Status Info Card */
              <CCard className="mb-4 h-100">
                <CCardHeader>
                  <strong>Status</strong>
                </CCardHeader>
                <CCardBody className="d-flex flex-column justify-content-center">
                  <div className="text-center text-muted">
                    <p>Scan serial number untuk memulai QC Repair</p>
                  </div>
                </CCardBody>
              </CCard>
            )}
          </CCol>
        </CRow>
      </CCol>

      {/* Quality Control Assembly */}
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Quality Control</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {questionData.length === 0 ? (
                <p className="text-muted">Questions not yet available...</p>
              ) : (
                questionData.map((q) => {
                  const isYes = answers[q.id] === true // memastikan boolean

                  return (
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
                            [q.id]: e.target.checked, // true kalau on, false kalau off
                          }))
                        }
                      />
                    </div>
                  )
                })
              )}
              {/* Tombol Submit hanya muncul jika ada questions dan tidak ada error */}
              {questionData.length > 0 && !errorMessage && (
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <CButton color="primary" type="submit">
                    Submit
                  </CButton>
                </div>
              )}
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default QcAqlSerial
