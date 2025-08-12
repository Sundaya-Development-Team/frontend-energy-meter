import React, { useState, useMemo, useCallback } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CFormLabel,
  CFormInput,
  CFormCheck,
  CButton,
  CForm,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CFormSwitch,
} from '@coreui/react'

import { backendQc, backendTracking } from '../../api/axios'
import { toast } from 'react-toastify'

const FormRow = ({ label, children }) => (
  <CRow className="mb-3 align-items-center">
    <CCol md={4}>
      <CFormLabel className="fw-semibold">{label}</CFormLabel>
    </CCol>
    <CCol md={8}>{children}</CCol>
  </CRow>
)

const CounterCard = ({ title, value }) => (
  <CCol md={6}>
    {' '}
    <CCard className="mb-3">
      <CCardBody>
        <h6 className="text-muted">{title}</h6>
        <h4>{value}</h4>
      </CCardBody>
    </CCard>
  </CCol>
)

const ReceivingSerialQc = () => {
  const [partner_barcode, setPartnerBarcode] = useState('')
  const [inspected_by, setInspectedBy] = useState('')
  const [productData, setProductData] = useState(null)
  const [trackingProduct, setTrackingProduct] = useState(null)
  const [answers, setAnswers] = useState({})

  // Dummy data untuk scanningItem
  // const [scanningItem] = useState({
  //   itemName: 'Produk ABC',
  //   expectedQuantity: 50,
  //   remainingStage: 20,
  //   totalStaged: 12,
  //   serialNumbers: Array.from({ length: 12 }, (_, i) => ({
  //     serial_number: `SN-${i + 1}`,
  //     created_at: new Date().toISOString(),
  //   })),
  // })

  const [formData, setFormData] = useState({ serialNumber: '' })
  const [isFormLocked] = useState(false)

  // Pagination state
  // const [currentPage, setCurrentPage] = useState(1)
  // const itemsPerPage = 5

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSerial = () => {
    console.log('Serial Number di-scan:', formData.serialNumber)

    // Panggil fetch dulu baru reset input
    fetchValidationSnumb(formData.serialNumber)

    setFormData({ ...formData })
  }
  // Fetch validation serial number
  const fetchValidationSnumb = async (serialNumber) => {
    try {
      const res = await backendQc.get('/validation', {
        params: {
          serial_number: serialNumber,
          qc_id: 'QC-SPS001', // ini bisa diubah ke dynamic kalau perlu
        },
      })

      if (res.data.valid == true) {
        toast.success(res.data.message || 'Serial number valid')

        fetchProduct(serialNumber)
      } else {
        toast.error(res.data.message || 'Serial number already scan')
      }
    } catch (error) {
      toast.error(res.data.message || 'Serial Number Validation Failed')
    }
  }

  const fetchProduct = async (serialNumber) => {
    try {
      const response = await backendTracking.get(`/serial/${serialNumber}`)

      if (response.data.success == true) {
        toast.success(response.data.message || 'Serial number valid')
        setProductData(response.data.data)
        const receivingItemId = response.data.data.receiving_item_id
        console.log('receiving_item_id :', receivingItemId)

        fetchTrackingProduct(receivingItemId)
      } else {
        toast.error(response.data.message || 'Serial number already scan')
      }
    } catch (error) {
      toast.error(response.message || 'Serial Number Validation Failed')
    }
  }

  const fetchTrackingProduct = async (receivingItemId) => {
    try {
      const response = await backendTracking.get('/sample-inspections/aql-summary', {
        params: {
          receiving_item_id: receivingItemId,
          qc_id: 'QC001', //cek kembali ini nanti
        },
      })
      setTrackingProduct(response.data.data)
      toast.success(response.data.message || 'Receiving ID Valid')
    } catch (error) {
      toast.error(response.data.message || 'Failed Validation')
    }
  }

  const [questionData] = useState([
    {
      id: 1,
      title: 'Pemeriksaan Visual',
      questions: [
        { id: 101, question: 'Apakah ada goresan pada produk?' },
        { id: 102, question: 'Apakah warna sesuai spesifikasi?' },
      ],
    },
    {
      id: 2,
      title: 'Pemeriksaan Fungsional',
      questions: [
        { id: 201, question: 'Apakah semua tombol berfungsi?' },
        { id: 202, question: 'Apakah produk menyala dengan benar?' },
      ],
    },
  ])

  const data = {
    po_number: 'PO-2025-001',
    batch: 'BATCH-01',
    status: 'pending',
    inspection_level: 'Level II',
    aql_critical: 0.65,
    aql_major: 1.5,
    aql_minor: 2.5,
    total_quantity: 1200,
    used_defects: 5,
    sample_size: 80,
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

  const handleChange = (e) => {
    const { name, value, type } = e.target
    if (name === 'partner_barcode') setPartnerBarcode(value)
    else if (name === 'inspected_by') setInspectedBy(value)
    else if (type === 'radio') {
      setAnswers((prev) => ({
        ...prev,
        [name.split('-')[1]]: value === 'true',
      }))
    }
  }

  // const paginatedSerialNumbers = useMemo(() => {
  //   if (!scanningItem?.serialNumbers) return []
  //   const startIndex = (currentPage - 1) * itemsPerPage
  //   const endIndex = startIndex + itemsPerPage
  //   return scanningItem.serialNumbers.slice(startIndex, endIndex)
  // }, [scanningItem, currentPage])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ partner_barcode, inspected_by, answers })
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
                <FormRow label="Serial Number">
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
                    disabled={isFormLocked}
                  />
                </FormRow>
                <FormRow label="Counter"></FormRow>
                <CRow className="mb-3">
                  <CounterCard
                    title="Required Sample"
                    value={trackingProduct?.inspection_summary?.required_sample ?? `-`}
                  />
                  <CounterCard
                    title="Remaining Samples"
                    value={trackingProduct?.inspection_summary?.remaining_samples ?? `-`}
                  />
                  <CounterCard
                    title="Max Fail"
                    value={trackingProduct?.aql_configuration?.aql_reject ?? `-`}
                  />
                  <CounterCard
                    title="Fail Count"
                    value={trackingProduct?.inspection_summary?.fail_count ?? `-`}
                  />
                </CRow>
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
                  <CCol md={6}>
                    <div className="fw-semibold">Tracking</div>
                    <div> {productData?.tracking_type ?? '-'}</div>
                  </CCol>
                  <CCol md={6}>
                    <div className="fw-semibold">Batch</div>
                    <div> {productData?.batch ?? '-'}</div>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <div className="fw-semibold">Type</div>
                    <div>{productData?.product?.type?.name ?? '-'}</div>
                  </CCol>
                </CRow>
                <FormRow label="AQL Setting :"></FormRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <div className="fw-semibold">Inspection Level</div>
                    <div>{trackingProduct?.aql_configuration?.inspection_level ?? `-`}</div>
                  </CCol>
                  <CCol md={6}>
                    <div className="fw-semibold">AQL Critical</div>
                    <div>{trackingProduct?.aql_configuration?.aql_critical ?? `-`}</div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCol>

      {/* Details */}
      <CCol xs={12} hidden>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Details</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={6}>
                <div className="fw-semibold">PO Number</div>
                <div>{data.po_number}</div>
              </CCol>
              <CCol md={6}>
                <div className="fw-semibold">Batch</div>
                <div>{data.batch}</div>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <div className="fw-semibold">Status</div>
                <div>{getStatusBadge(data.status)}</div>
              </CCol>
              <CCol md={6}>
                <div className="fw-semibold">Inspection Level</div>
                <div>{data.inspection_level}</div>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <div className="fw-semibold">AQL Minor</div>
                <div>{data.aql_minor}</div>
              </CCol>
              <CCol md={6}>
                <div className="fw-semibold">Total Quantity</div>
                <div>{data.total_quantity}</div>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <div className="fw-semibold">Used Defects</div>
                <div>{data.used_defects}</div>
              </CCol>
              <CCol md={6}>
                <div className="fw-semibold">Sample Size</div>
                <div>{data.sample_size}</div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
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
                <p className="text-muted">Pertanyaan belum tersedia...</p>
              ) : (
                questionData.map((section) => (
                  <div key={section.id}>
                    <CFormLabel className="col-form-label mt-3">
                      <strong>{section.title}</strong>
                    </CFormLabel>
                    {section.questions.map((q) => (
                      <div
                        key={q.id}
                        className="border rounded p-3 mb-3 d-flex align-items-center justify-content-between"
                      >
                        {/* Pertanyaan di kiri */}
                        <CFormLabel className="mb-0">{q.question}</CFormLabel>

                        {/* Switch di kanan */}
                        <CFormSwitch
                          name={`question-${q.id}`}
                          label={answers[q.id] ? 'Ya' : 'Tidak'}
                          checked={answers[q.id] === true}
                          onChange={(e) =>
                            setAnswers((prev) => ({
                              ...prev,
                              [q.id]: e.target.checked,
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                ))
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

export default ReceivingSerialQc
