import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { backendTracking, backendUploadFile } from '../../api/axios'
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
const VITE_SERVER_DATA = import.meta.env.VITE_SERVER_DATA

const TrackingDetail = () => {
  const { trackingId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState(null)

  const fetchDetail = useCallback(async () => {
    setLoading(true)
    try {
      const res = await backendTracking.get(`/${trackingId}`)
      setDetail(res.data.data)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch tracking detail')
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
    if (!dateString) return '-'
    const date = new Date(dateString)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
  }

  // const handleReport = async (qc) => {
  //   try {
  //     const res = await backendUploadFile.get(`/qc-test-report/stream`, {
  //       params: { path: qc.file_path },
  //       responseType: 'blob',
  //     })

  //     // buat URL blob
  //     const fileURL = window.URL.createObjectURL(new Blob([res.data]))
  //     // buka di tab baru
  //     window.open(fileURL, '_blank')
  //   } catch (err) {
  //     console.error(err)
  //     toast.error('Failed to download file')
  //   }
  // }

  const handleReport = (qc) => {
    if (!qc?.file_path) {
      toast.error('Path file tidak tersedia')
      return
    }

    const fileUrl = `${VITE_SERVER_DATA}/api/v1/upload-service/qc-test-report/stream?path=${encodeURIComponent(
      qc.file_path,
    )}`

    try {
      const newTab = window.open(fileUrl, '_blank')

      if (newTab) {
        toast.success('File berhasil dibuka di tab baru')
      } else {
        toast.error('Tidak dapat membuka tab baru — periksa popup blocker browser kamu')
      }
    } catch (err) {
      console.error('Error membuka file:', err)
      toast.error('Terjadi kesalahan saat membuka file')
    }
  }

  return (
    <>
      {/* Card Detail */}
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Tracking Detail</strong>
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
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <div className="fw-semibold">Production Serial Number</div>
                <div>{detail.serial_number || '-'}</div>
              </CCol>
              <CCol md={6}>
                <div className="fw-semibold">PLN Serial Number</div>
                <div>{detail.pln_code || '-'}</div>
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
        </CCardBody>
      </CCard>

      {/* Card QC Results */}
      {detail.qc_results?.length > 0 && (
        <CCard className="mt-4">
          <CCardHeader>
            <strong>QC Results</strong>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Stage</CTableHeaderCell>
                  <CTableHeaderCell>Checked At</CTableHeaderCell>
                  <CTableHeaderCell>PIC</CTableHeaderCell>
                  <CTableHeaderCell>Result</CTableHeaderCell>
                  <CTableHeaderCell>Location</CTableHeaderCell>
                  <CTableHeaderCell>Notes</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">View Report</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {detail.qc_results.map((qc, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{qc.qc_name}</CTableDataCell>
                    <CTableDataCell>{formatDateTime(qc.created_at)}</CTableDataCell>
                    <CTableDataCell>{qc.inspector_by || '-'}</CTableDataCell>
                    <CTableDataCell
                      className={
                        qc.result === 'PASS'
                          ? 'text-success fw-bold'
                          : qc.result === 'PENDING'
                            ? 'text-warning fw-bold'
                            : 'text-danger fw-bold'
                      }
                    >
                      {qc.result}
                    </CTableDataCell>
                    <CTableDataCell>{qc.qc_place || '-'}</CTableDataCell>
                    <CTableDataCell>{qc.notes || '-'}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      {qc.file_path ? (
                        <CButton
                          color="primary"
                          size="sm"
                          onClick={() => {
                            if (!qc?.file_path) {
                              toast.error('File path not available')
                              return
                            }
                            handleReport(qc)
                          }}
                        >
                          Report
                        </CButton>
                      ) : (
                        '-'
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      )}
    </>
  )
}

export default TrackingDetail
