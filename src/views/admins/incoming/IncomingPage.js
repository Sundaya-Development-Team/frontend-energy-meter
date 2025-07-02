/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
  CRow,
} from '@coreui/react'
import { backendIncoming } from '../../../api/axios'

const formatDate = (iso) =>
  new Date(iso).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

const cardStyle = {
  height: '420px',
  display: 'flex',
  flexDirection: 'column',
}

const cardBodyStyle = {
  flex: '1 1 auto',
  overflowY: 'auto',
}

const IncomingPage = () => {
  const [loading, setLoading] = useState(false)
  const [headerLoading, setHeaderLoading] = useState(false)
  const [detailLoading, setdetailLoading] = useState(false)
  const [idHeader, setIdHeader] = useState(null)
  const [idDetail, setIdDetail] = useState(null)
  const [modalHeaderVisible, setModalHeaderVisible] = useState(false)
  const [modalDetailVisible, setModalDetailVisible] = useState(false)
  const [incomingData, setIncomingData] = useState({
    data: [],
    total: 1,
    page: 1,
    limit: 1,
    totalPages: 1,
  })
  const [formHeaderData, setFormHeaderData] = useState({
    ref_code: '',
    notes: '',
  })
  const [formDetailData, setFormDetailData] = useState({
    sap_code: '',
    partner_code: '',
    ref_quantity: '',
    incoming_batch: '',
    incoming_quantity: '',
    remaining_quantity: '',
    sample_quantity: '',
    inspect_quantity: '',
    img: '',
  })

  const fetchData = async (page = 1) => {
    try {
      setLoading(true)
      const { data } = await backendIncoming.get(`/api/v1/products-receiving/all`, {
        params: { limit: 12, page },
      })
      setIncomingData(data)
    } catch (error) {
      console.log('error : ~ IncomingPage : fetching data', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteHeader = async (id) => {
    if (!window.confirm('Hapus Header ini?')) return
    try {
      await backendIncoming.delete(`/api/v1/products-receiving/delete-header/${id}`)
      fetchData(incomingData.page)
    } catch (error) {
      console.log('error : ~ IncomingPage : deleteHeader', error)
    }
  }

  const deleteDetails = async (id) => {
    if (!window.confirm('Hapus Detail ini?')) return
    try {
      await backendIncoming.delete(`/api/v1/products-receiving/delete-detail/${id}`)
      fetchData(incomingData.page)
    } catch (error) {
      console.log('error : ~ IncomingPage : deleteDetails', error)
    }
  }

  const handleHeaderChange = (e) => {
    const { name, value } = e.target
    setFormHeaderData((p) => ({ ...p, [name]: value }))
  }

  const handleDetailChange = (e) => {
    const { name, value, type, files } = e.target
    if (name === 'inspect_quantity') {
      return setFormDetailData((p) => ({
        ...p,
        inspect_quantity: value === 'true',
      }))
    }
  }

  const handleOpenModel = (mode, rowData) => {
    if (mode === 'header') {
      setModalHeaderVisible(true)
      setIdHeader(rowData.id)
      setFormHeaderData({
        ref_code: rowData.ref_code ?? '',
        notes: rowData.notes ?? '',
      })
    }
    if (mode === 'detail') {
      setModalDetailVisible(true)
    //   setIdHeader(rowData.id)
    //   setFormHeaderData({
    //     ref_code: rowData.ref_code ?? '',
    //     notes: rowData.notes ?? '',
    //   })
    }
  }

  const handleEditHeader = async () => {
    try {
      setHeaderLoading(true)
      const payload = {
        ref_code: formHeaderData.ref_code,
        notes: formHeaderData.notes,
      }
      console.log(payload)

      await backendIncoming.put(`/api/v1/products-receiving/update-header/${idHeader}`, payload)
      setModalHeaderVisible(false)
      await fetchData()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    } finally {
      setHeaderLoading(false)
    }
  }

  /* ---------- fetch master ---------- */
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      {/* --------- Card----------- */}
      <CRow>
        {loading && <div className="text-center py-5 fw-semibold">Loading …</div>}
        {!loading && incomingData.data.length === 0 && (
          <div className="text-center py-5 fw-semibold">Tidak ada data</div>
        )}
        {incomingData.data.map((header) => (
          <CCol md={4} key={header.id}>
            <CCard style={cardStyle} className="mb-3 shadow-sm">
              <CCardHeader className="d-flex justify-content-between align-items-center fw-bold">
                {header.receiving_code}
                <div className="btn-group ms-auto">
                  <CButton
                    className="fw-bold text-white me-1"
                    size="sm"
                    color="warning"
                    onClick={() => handleOpenModel('header', header)}
                  >
                    Edit
                  </CButton>
                  <CButton
                    className="fw-bold text-white me-1"
                    size="sm"
                    color="danger"
                    onClick={() => deleteHeader(header.id)}
                  >
                    Delete
                  </CButton>
                </div>
              </CCardHeader>
              <CCardBody style={cardBodyStyle}>
                <p>
                  <strong>Reference Code:</strong> {header.ref_code}
                </p>
                <p>
                  <strong>Notes:</strong> {header.notes}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(header.created_at)}
                </p>
                <hr />
                {(header.details ?? []).map((d) => (
                  <CCard key={d.id} className="mb-3">
                    <CCardBody>
                      <p>
                        <strong>SAP Code:</strong> {d.sap_code}
                      </p>
                      <p>
                        <strong>Partner:</strong> {d.partner_code}
                      </p>
                      <p>
                        <strong>Sample:</strong> {d.sample_quantity}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {d.incoming_quantity} / {d.ref_quantity}
                      </p>
                      <p>
                        <strong>Inspect:</strong> {d.inspect_quantity ? '✅' : '❌'}
                      </p>
                      <div className="text-center">
                        <img src={d.img} alt={d.sap_code} width="100" className="mb-2" />
                      </div>
                      <div className="d-flex justify-content-center gap-2">
                        <CButton
                          className="fw-bold text-white me-1"
                          size="sm"
                          color="warning"
                          onClick={() => handleOpenModel('detail', d)}
                        >
                          Edit
                        </CButton>
                        <CButton
                          className="fw-bold text-white"
                          size="sm"
                          color="danger"
                          onClick={() => deleteDetails(d.id)}
                        >
                          Delete
                        </CButton>
                      </div>
                    </CCardBody>
                  </CCard>
                ))}
              </CCardBody>
            </CCard>
          </CCol>
        ))}
        {/* ---- pagination ---- */}
        {incomingData.totalPages > 1 && (
          <CPagination className="justify-content-center">
            <CPaginationItem
              disabled={incomingData.page === 1}
              onClick={() => fetchData(incomingData.page - 1)}
            >
              &laquo;
            </CPaginationItem>

            {Array.from({ length: incomingData.totalPages }).map((_, i) => (
              <CPaginationItem
                key={i + 1}
                active={incomingData.page === i + 1}
                onClick={() => fetchData(i + 1)}
              >
                {i + 1}
              </CPaginationItem>
            ))}

            <CPaginationItem
              disabled={incomingData.page === incomingData.totalPages}
              onClick={() => fetchData(incomingData.page + 1)}
            >
              &raquo;
            </CPaginationItem>
          </CPagination>
        )}
      </CRow>
      {/* ---------- MODAL Header ---------- */}
      <CModal visible={modalHeaderVisible} onClose={() => setModalHeaderVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Edit Header</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {/* Reference Code */}
            <CRow className="mb-3">
              <CFormLabel className="col-sm-3 col-form-label">Reference Code</CFormLabel>
              <CCol sm={9}>
                <CFormInput
                  name="ref_code"
                  value={formHeaderData.ref_code}
                  onChange={handleHeaderChange}
                />
              </CCol>
            </CRow>

            {/* Notes */}
            <CRow className="mb-3">
              <CFormLabel className="col-sm-3 col-form-label">Notes</CFormLabel>
              <CCol sm={9}>
                <CFormInput
                  name="notes"
                  value={formHeaderData.notes}
                  onChange={handleHeaderChange}
                  required
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalHeaderVisible(false)}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              handleEditHeader()
            }}
            disabled={headerLoading}
          >
            {loading ? 'Loading...' : 'Save'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ---------- MODAL Details ---------- */}
      <CModal visible={modalDetailVisible} onClose={() => setModalDetailVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Edit Detail</CModalTitle>
        </CModalHeader>
        <CModalBody>ini body</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalDetailVisible(false)}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              handleEditHeader()
            }}
            disabled={headerLoading}
          >
            {loading ? 'Loading...' : 'Save'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
export default IncomingPage
