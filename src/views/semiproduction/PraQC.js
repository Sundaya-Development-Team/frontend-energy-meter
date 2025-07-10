/* eslint-disable prettier/prettier */

import React, { useEffect, useMemo, useState, useCallback } from 'react'
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
  CFormTextarea,
  CRow,
  CFormSelect,
} from '@coreui/react'
import Select from 'react-select'

import {
  backendAql,
  backendIncoming,
  backendPartner,
  backendProduct,
  backendTrackedItems,
  backendUploadFile,
} from '../../api/axios'

/* -------------------------------------------------------------------------- */
/* util helper                                                                */
/* -------------------------------------------------------------------------- */
const fetchMasters = () =>
  Promise.all([
    backendProduct.get('/api/v1/products/all'),
    backendPartner.get('/api/v1/partners/all'),
  ])

const fetchTotalTracked = (reference_po) =>
  backendTrackedItems.get('/api/v1/tracked-items/all', { params: { reference_po } })

const fetchAqlSample = (lotSize, inspection = 'II', aql = '4') =>
  lotSize
    ? backendAql
        .post('/api/v1/aql', { lotSize, inspectionLevel: inspection, aql })
        .then((r) => r.data.sampleSize)
    : Promise.resolve(0)

/* -------------------------------------------------------------------------- */
/* main component                                                             */
/* -------------------------------------------------------------------------- */
const PraQC = () => {
  /* ------------------------------- state ---------------------------------- */
  const [loading, setLoading] = useState(false)
  const [sapData, setSapData] = useState([])
  const [partnerData, setPartnerData] = useState([])
  const [trackedTotal, setTrackedTotal] = useState(0)
  const [scannedQty, setScannedQty] = useState(0)
  const [sampleQty, setSampleQty] = useState(0)

  const [formData, setFormData] = useState({
    reference_po: '',
    reference_gr: '',
    notes: '',
    sap_code: '',
    partner_code: '',
    ref_quantity: '',
    incoming_batch: '',
    incoming_quantity: '',
    inspect_quantity: '',
    barcode: '',
    uom: '',
    location_detail: 'Incoming Zone',
    status: 'in_receiving_area',
    file: null,
  })

  /* ------------------------ derived / memoised value ---------------------- */
  const remainingQty = useMemo(
    () => Math.max(0, Number(formData.ref_quantity || 0) - trackedTotal),
    [formData.ref_quantity, trackedTotal],
  )

  /* --------------------------- handlers ---------------------------------- */
  const handleInput = (e) => {
    const { name, value, type, files } = e.target
    if (name === 'inspect_quantity') {
      setFormData((p) => ({ ...p, inspect_quantity: value === 'true' }))
      return
    }
    if (type === 'file') {
      setFormData((p) => ({ ...p, file: files[0] }))
      return
    }
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handleSelectSap = (option) => {
    const selected = sapData.find((p) => p.sap_code === option.value)
    setFormData((p) => ({
      ...p,
      sap_code: selected.sap_code,
      uom: selected.uom?.code || '',
    }))
  }

  const handleSelectPartner = (option) => {
    // const selected = partnerData.find((p) => p.partner_code === option.value)
    setFormData((p) => ({
      ...p,
      partner_code: option ? option.value : '',
    }))
  }

  /* add 1 pada counter, simpan ke DB, lalu refresh total */
  const handleBarcode = async () => {
    if (!formData.barcode.trim()) return
    try {
      await backendTrackedItems.post('/api/v1/tracked-items/add', {
        partner_barcode: formData.barcode,
        reference_po: formData.reference_po,
        sap_code: formData.sap_code,
        incoming_batch: Number(formData.incoming_batch),
        location_detail: formData.location_detail,
        status: formData.status,
      })
      setScannedQty((q) => q + 1)
      setFormData((p) => ({ ...p, barcode: '' }))
      refreshTrackedTotal()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  const handleSubmit = async (e) => {
    // e.preventDefault()
    try {
      setLoading(true)

      /* upload file jika ada */
      let uploadedFileName = ''
      // if (formData.file) {
      //   const { data } = await backendUploadFile.post(
      //     '/v1/api/upload-service/semi-product',
      //     { file: formData.file },
      //     { headers: { 'Content-Type': 'multipart/form-data' } },
      //   )
      //   uploadedFileName = data.URL ?? 'example-image.jpg'
      // }

      /* payload utama */
      const resIncoming = await backendIncoming.post('/api/v1/receiving-products/add', {
        reference_po: formData.reference_po,
        reference_gr: formData.reference_gr,
        notes: formData.notes,
        details: [
          {
            sap_code: formData.sap_code,
            partner_code: formData.partner_code,
            ref_quantity: Number(formData.ref_quantity),
            incoming_batch: Number(formData.incoming_batch),
            incoming_quantity: Number(formData.incoming_quantity),
            uom: formData.uom,
            remaining_quantity: remainingQty,
            sample_quantity: sampleQty,
            inspect_quantity: formData.inspect_quantity,
            img: uploadedFileName,
          },
        ],
      })

      const resTracked = await backendTrackedItems.put('/api/v1/tracked-items/confirm-items', {
        reference_po: formData.reference_po,
        incoming_batch: Number(formData.incoming_batch),
        updateData: {
          is_confirm: true,
          location_detail: formData.location_detail,
        },
      })

      alert(`${resIncoming.data?.message}`)
      alert(`${resTracked.data?.message}`)
      /* optionally reset form di sini */
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  /* --------------------------- data fetchers ------------------------------ */
  const refreshTrackedTotal = useCallback(async () => {
    if (!formData.reference_po) return
    try {
      const { data } = await fetchTotalTracked(formData.reference_po)
      setTrackedTotal(data.total)
    } catch (err) {
      console.error('fetch total error', err)
    }
  }, [formData.reference_po])

  /* ------------------------------ effects -------------------------------- */
  /* masters sekali di mount */
  useEffect(() => {
    fetchMasters()
      .then(([sapRes, partnerRes]) => {
        setSapData(sapRes.data.data)
        setPartnerData(partnerRes.data.data)
      })
      .catch((err) => console.error('fetch masters', err))
  }, [])

  /* hitung sample size saat total qty berubah */
  useEffect(() => {
    fetchAqlSample(formData.ref_quantity).then(setSampleQty)
  }, [formData.ref_quantity])

  /* refresh total tracked saat ref PO berubah */
  useEffect(() => {
    refreshTrackedTotal()
  }, [refreshTrackedTotal])

  /* ----------------------------------------------------------------------- */
  /* ------------------------------ render --------------------------------- */
  return (
    <CRow>
      {/* FORM KIRI ---------------------------------------------------------- */}
      <CCol md={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Incoming Semi Product (Pra-QC)</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {/* ------------ Header (PO / GR) ------------- */}
              <CFormLabel className="col-form-label fw-bold">PO / AO</CFormLabel>

              <FormRow label="Reference PO">
                <CFormInput
                  name="reference_po"
                  value={formData.reference_po}
                  onChange={handleInput}
                  required
                />
              </FormRow>

              <FormRow label="Reference GR">
                <CFormInput
                  name="reference_gr"
                  value={formData.reference_gr}
                  onChange={handleInput}
                  required
                />
              </FormRow>

              <FormRow label="Total Quantity">
                <CFormInput
                  type="number"
                  name="ref_quantity"
                  value={formData.ref_quantity}
                  onChange={handleInput}
                  required
                />
              </FormRow>

              {/* ------------ Incoming Material ------------- */}
              <CFormLabel className="col-form-label fw-bold mt-3">Incoming Material</CFormLabel>

              <FormRow label="SAP Code">
                <Select
                  options={sapData.map((u) => ({ value: u.sap_code, label: u.sap_code }))}
                  value={
                    formData.sap_code
                      ? { value: formData.sap_code, label: formData.sap_code }
                      : null
                  }
                  onChange={handleSelectSap}
                  placeholder="Select SAP Code"
                  isClearable
                />
              </FormRow>

              <FormRow label="Unit">
                <CFormInput name="uom" value={formData.uom} readOnly />
              </FormRow>

              <FormRow label="Incoming Batch">
                <CFormInput
                  type="number"
                  name="incoming_batch"
                  value={formData.incoming_batch}
                  onChange={handleInput}
                  required
                />
              </FormRow>

              <FormRow label="Incoming Quantity">
                <CFormInput
                  type="number"
                  name="incoming_quantity"
                  value={formData.incoming_quantity}
                  onChange={handleInput}
                  required
                />
              </FormRow>

              <FormRow label="Remaining Quantity">
                <CFormInput value={remainingQty} readOnly />
              </FormRow>

              <FormRow label="Sample Quantity">
                <CFormInput value={sampleQty} readOnly />
              </FormRow>

              <FormRow label="Partner">
                <Select
                  options={partnerData.map((u) => ({
                    value: u.partner_code,
                    label: u.name,
                  }))}
                  value={
                    formData.partner_code
                      ? partnerData
                          .filter((p) => p.partner_code === formData.partner_code)
                          .map((p) => ({ value: p.partner_code, label: p.name }))[0]
                      : null
                  }
                  onChange={handleSelectPartner}
                  placeholder="Select Partner"
                  isClearable
                />
                {/* <CFormSelect
                  name="partner_code"
                  value={formData.partner_code}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Partner</option>
                  {partnerData.map((p) => (
                    <option key={p.id} value={p.partner_code}>
                      {p.name}
                    </option>
                  ))}
                </CFormSelect> */}
              </FormRow>

              <FormRow label="Note">
                <CFormTextarea
                  rows={3}
                  name="notes"
                  value={formData.notes}
                  onChange={handleInput}
                  required
                />
              </FormRow>

              <FormRow label="Image">
                <CFormInput type="file" name="file" onChange={handleInput} />
              </FormRow>

              {/* ------------ Early Inspection ------------- */}
              <CFormLabel className="col-form-label fw-bold mt-3">Early Inspection</CFormLabel>
              <CRow className="mb-3">
                <CCol>
                  <div className="border rounded p-3">
                    <CFormLabel>Jumlah Kuantitas sudah sesuai</CFormLabel>
                    <div className="d-flex justify-content-end gap-3">
                      {['true', 'false'].map((v) => (
                        <CFormCheck
                          key={v}
                          inline
                          type="radio"
                          name="inspect_quantity"
                          value={v}
                          label={v === 'true' ? 'Ya' : 'Tidak'}
                          checked={formData.inspect_quantity === (v === 'true')}
                          onChange={handleInput}
                          required
                        />
                      ))}
                    </div>
                  </div>
                </CCol>
              </CRow>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="primary" type="submit" disabled={loading}>
                  {loading ? 'Saving…' : 'Save'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* PANEL KANAN (counter & barcode) ------------------------------------ */}
      <CCol md={6}>
        <CounterCard title="Counter Quantity" value={scannedQty} />
        <CounterCard title="Counter Saved Quantity" value={trackedTotal} />

        <CCard className="mb-4">
          <CCardHeader>
            <strong>Scan Barcode</strong>
          </CCardHeader>
          <CCardBody>
            <FormRow label="Barcode" labelCols="2">
              <CFormInput
                name="barcode"
                value={formData.barcode}
                onChange={handleInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleBarcode()
                  }
                }}
              />
            </FormRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

/* -------------------------------------------------------------------------- */
/* kecil: komponen util agar form row lebih ringkas                           */
/* -------------------------------------------------------------------------- */
const FormRow = ({ label, children, labelCols = '3' }) => (
  <CRow className="mb-3">
    <CFormLabel className={`col-sm-${labelCols} col-form-label`}>{label}</CFormLabel>
    <CCol sm={12 - Number(labelCols)}>{children}</CCol>
  </CRow>
)

const CounterCard = ({ title, value }) => (
  <CCard className="mb-4">
    <CCardHeader>
      <strong>{title}</strong>
    </CCardHeader>
    <CCardBody>
      <div className="text-center">
        <h1 className="display-4 fw-bold">{value}</h1>
        <small className="text-muted">Units</small>
      </div>
    </CCardBody>
  </CCard>
)

export default PraQC
