import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { backendTracking } from '../../api/axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CRow,
  CCol,
  CBadge,
} from '@coreui/react'
import { toast } from 'react-toastify'

const DetailNonSerialQc = () => {
  const { trackingId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState(null)

  const fetchTrackingSumary = async (receivingItemId, qcProduct) => {
    console.log('masuk sumary')
    try {
      const response = await backendTracking.get('/sample-inspections/aql-summary', {
        params: {
          receiving_item_id: receivingItemId,
          qc_id: qcProduct, //cek kembali ini nanti
        },
      })
      const remainingSample = response.data.data.inspection_summary.remaining_samples
      console.log('remaining Sample : ', remainingSample)
      if (remainingSample <= 0) {
        toast.error(
          <span>
            <span style={{ color: 'red', fontWeight: 'bold' }}> SAMPLE SUDAH CUKUP !!</span>
          </span>,
        )
        //Besihkan page
        // setProductData(null)
        // setTrackingProduct(null)
        // setQuestionData([])
        // setAnswers({})
        // setFormData({ serialNumber: '', notes: '' })
      } else {
        console.log('LANJUT')
        // setTrackingProduct(response.data.data)
        // const baseMessage = response.data?.message ?? ''

        // toast.success(
        //   <span>
        //     {baseMessage || ''} -{' '}
        //     <span style={{ color: 'green', fontWeight: 'bold' }}> LANJUT QC</span>
        //   </span>,
        // )
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed Validation')
    }
  }

  const fetchDetail = useCallback(async () => {
    setLoading(true)
    try {
      const response = await backendTracking.get(`/${trackingId}`)
      setDetail(response.data.data)
      const receivingItemId = response.data.data.receiving_item_id
      const qcProduct = response.data.data.product.qc_product
      console.log('receivingItemId : ', receivingItemId)
      console.log('qc id : ', qcProduct)
      //ambil data QC sumary - nanti berikan validasi dari question, jika sudah tervalidasi, baru masuk tahap ini
      fetchTrackingSumary(receivingItemId, qcProduct)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch QC Non Serial Detail')
    } finally {
      setLoading(false)
    }
  }, [trackingId])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  if (!detail) {
    return <p>No data found.</p>
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>Receiving QC : {detail.product.name || 'Non Serial'} Detail</strong>
        <CButton color="secondary" size="sm" onClick={() => navigate(-1)}>
          Back
        </CButton>
      </CCardHeader>
      <CCardBody>
        <div className="mb-4 space-y-2">
          <CRow className="mb-3">
            <CCol md={6}>
              <div className="fw-semibold">ID</div>
              <div>{detail.id}</div>
            </CCol>
            <CCol md={6}>
              <div className="fw-semibold">QC Product</div>
              <div>{detail.product.qc_product || '-'}</div>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <div className="fw-semibold">Item Code</div>
              <div>{detail.code_item || '-'}</div>
            </CCol>
            <CCol md={6}>
              <div className="fw-semibold">Batch</div>
              <div>{detail.batch || '-'}</div>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <div className="fw-semibold">Quantity</div>
              <div>{detail.original_quantity}</div>
            </CCol>
            <CCol md={6}>
              <div className="fw-semibold">Serialized</div>
              <div>{detail.is_serialize ? 'Yes' : 'No'}</div>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <div className="fw-semibold">Tracking Type</div>
              <div>{detail.tracking_type || '-'}</div>
            </CCol>
            <CCol md={6}>
              <div className="fw-semibold">Status</div>
              <CBadge color={detail.status === 'delivered' ? 'success' : 'warning'}>
                {detail.status}
              </CBadge>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <div className="fw-semibold">Created At</div>
              <div>{formatDateTime(detail.created_at)}</div>
            </CCol>
          </CRow>
        </div>

        {/* QC Results */}
        {detail.qc_results?.length > 0 && (
          <>
            <h5 className="mb-3">
              <b>QC Results</b>
            </h5>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Stage</CTableHeaderCell>
                  <CTableHeaderCell>Checked At</CTableHeaderCell>
                  <CTableHeaderCell>PIC</CTableHeaderCell>
                  <CTableHeaderCell>Result</CTableHeaderCell>
                  <CTableHeaderCell>Location</CTableHeaderCell>
                  <CTableHeaderCell>Notes</CTableHeaderCell>
                  <CTableHeaderCell>Download Report</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {detail.qc_results.map((qc, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{qc.qc_name}</CTableDataCell>
                    <CTableDataCell>{new Date(qc.created_at).toLocaleString()}</CTableDataCell>
                    <CTableDataCell>{qc.pic || '-'}</CTableDataCell>
                    <CTableDataCell
                      className={
                        qc.result === 'PASS' ? 'text-success fw-bold' : 'text-danger fw-bold'
                      }
                    >
                      {qc.result}
                    </CTableDataCell>
                    <CTableDataCell>{qc.qc_place}</CTableDataCell>
                    <CTableDataCell>{qc.notes}</CTableDataCell>
                    <CTableDataCell>{'-'}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </>
        )}

        {/* Parent Of */}
        {/* {detail.parentOf?.length > 0 && (
          <>
            <h5 className="mt-4 mb-3">Parent Of (Child Components)</h5>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Serial Number</CTableHeaderCell>
                  <CTableHeaderCell>Item Code</CTableHeaderCell>
                  <CTableHeaderCell>Quantity</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {detail.parentOf.map((child, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{child.serial_number || '-'}</CTableDataCell>
                    <CTableDataCell>{child.code_item || '-'}</CTableDataCell>
                    <CTableDataCell>{child.original_quantity}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </>
        )} */}

        {/* Component Of */}
        {/* {detail.componentOf?.length > 0 && (
          <>
            <h5 className="mt-4 mb-3">Component Of (Parent Assembly)</h5>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Serial Number</CTableHeaderCell>
                  <CTableHeaderCell>Item Code</CTableHeaderCell>
                  <CTableHeaderCell>Quantity</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {detail.componentOf.map((parent, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{parent.serial_number || '-'}</CTableDataCell>
                    <CTableDataCell>{parent.code_item || '-'}</CTableDataCell>
                    <CTableDataCell>{parent.original_quantity}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </>
        )} */}
      </CCardBody>
    </CCard>
  )
}

export default DetailNonSerialQc
