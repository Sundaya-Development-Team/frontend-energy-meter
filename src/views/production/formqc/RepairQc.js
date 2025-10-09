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
import { useAuth } from '../../../context/AuthContext'

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
  const inspected_by = 'ADMIN_RECEIVING'
  const [formData, setFormData] = useState({ serialNumber: '' })
  const [isFormLocked] = useState(false)
  const serialNumberInputRef = useRef(null)
  const [repairInfo, setRepairInfo] = useState(null)

  const resetStates = () => {
    setProductData(null)
    // setTrackingProduct(null)
    setQuestionData([])
    setAnswers({})
    setRepairInfo(null)
    setFormData({ serialNumber: '', notes: '' })
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

    // Bersihkan semua state dulu
    resetStates()
    // Panggil fetch validasi serial
    fetchValidationSnumb(formData.serialNumber)

    // Reset input serial number
    // setFormData({ serialNumber: '' })
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
        toast.error(response.data.message ?? 'Serial number already scan')
      }
    } catch (error) {
      console.log('ERROR')
      toast.error(error.response?.data?.message || 'Serial Number Validation Failed')
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

        const assemblyId = response.data.data.assembly_id
        console.log('assemblyId :', assemblyId)
      } else {
        toast.error(response.data.message || 'Failed get product data')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'ERROR get data product')
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
    //login validation
    if (!user?.id || !user?.username) {
      toast.error('You must be logged in to submit a Purchase Order.')
      setTimeout(() => navigate('/login'), 1500)
      return
    }

    console.log('QC Name : ', qcName)
    // Validasi field wajib
    if (!productData?.serial_number) {
      toast.error('Serial number wajib diisi!')
      return
    }
    if (!inspected_by) {
      toast.error('Inspector name wajib diisi!')
      return
    }
    if (!qcName) {
      toast.error('QC Name wajib diisi!')
      return
    }
    if (!qcCodeSerial) {
      toast.error('QC ID wajib diisi!')
      return
    }

    if (Object.keys(answers).length === 0) {
      toast.error('Jawaban pertanyaan QC wajib diisi!')
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
      serialNumberInputRef.current.focus()
    } catch (error) {
      console.error('QC submit error:', error)
      toast.error(error.response?.data?.message || error.message || 'Gagal submit QC')
    }

    // Bersihkan semua state
    resetStates()
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CRow className="g-4 mb-4">
          {/* Scan Serial Number */}
          <CCol md={6}>
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
          <CCol md={6}>
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
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="primary" type="submit">
                  Submit
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default QcAqlSerial
