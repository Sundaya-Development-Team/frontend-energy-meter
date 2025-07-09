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
  CRow,
} from '@coreui/react'
import {
  backendAql,
  backendIncoming,
  backendPartner,
  backendProduct,
  backendTrackedItems,
  backendUploadFile,
} from '../../api/axios'

const PraQC = () => {
  const [loading, setLoading] = useState(false)
  const [sapData, setSapData] = useState([])
  const [partnerData, setPartnerData] = useState([])
  const [trackedTotalData, setTrackedTotalDataData] = useState(0)
  const [scannedQty, setScannedQty] = useState(0)
  const [sampleQty, setSampleQty] = useState(0)
  const [formData, setFormData] = useState({
    reference_po: '',
    reference_gr: '',
    notes: '',
    sap_code: '',
    partner_code: '',
    ref_quantity: '0',
    incoming_batch: '',
    incoming_quantity: '',
    sample_quantity: '',
    inspect_quantity: '',
    image: null,
    barcode: '',
    location_detail: 'Incoming Zone',
    status: 'in_receiving_area',
    file: null,
    uom: '',
  })

  // --------------Helper--------

  const remainingQty = Math.max(0, Number(formData.ref_quantity || 0) - trackedTotalData)
  const savedQty = trackedTotalData

  const fetchTrackedTotal = async () => {
    if (!formData.reference_po) return // belum ada PO → abaikan
    try {
      const { data } = await backendTrackedItems.get('/api/v1/tracked-items/all', {
        params: { reference_po: formData.reference_po },
      })
      setTrackedTotalDataData(data.total) // update state total
    } catch (err) {
      console.error('fetch total error', err)
    }
  }


  const inspection = 'II'
  const aql = '4'
  const fetchAql = async (lotSize) => {
     if (!lotSize) return 0     
    try {
      const payload = {
        lotSize: lotSize,
        inspectionLevel: inspection,
        aql: aql,
      }
      const { data } = await backendAql.post('/api/v1/aql', payload)
      return data.sampleSize
    } catch (err) {
      console.error('fetch AQL error', err)
      return 0
    }
  }

  // ---------- Handle ----------
  const handleChange = (e) => {
    const { name, value, type, files } = e.target

    /*  Radio Ya/Tidak */
    if (name === 'inspect_quantity') {
      setFormData((p) => ({ ...p, inspect_quantity: value === 'true' }))
      return
    }

    /* File input */
    if (type === 'file') {
      setFormData((p) => ({ ...p, [name]: files[0] }))
      return
    }

    /* SAP Code dipilih → isi UOM otomatis */
    if (name === 'sap_code') {
      const selected = sapData.find((p) => p.sap_code === value)
      setFormData((p) => ({
        ...p,
        sap_code: value,
        uom: selected ? selected.uom?.code || '' : '', // ← isi otomatis
      }))
      return
    }

    /* Input biasa */
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handleBarcode = async () => {
    try {
      if (!formData.barcode.trim()) return
      const payload = {
        partner_barcode: formData.barcode,
        reference_po: formData.reference_po,
        sap_code: formData.sap_code,
        incoming_batch: Number(formData.incoming_batch),
        location_detail: formData.location_detail,
        status: formData.status,
      }
      const res = await backendTrackedItems.post('/api/v1/tracked-items/add', payload)
      setScannedQty((q) => q + 1)
      setFormData((p) => ({ ...p, barcode: '' })) // reset
      await fetchTrackedTotal()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      // const payloadFile = {
      //   file: formData.file,
      // }
      // const resFile = await backendUploadFile.post(
      //   '/v1/api/upload-service/semi-product',
      //   payloadFile,
      //   {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   },
      // )
      // const filename = resFile.data?.fileName
      const payloadIncoming = {
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
            sample_quantity: Number(formData.sample_quantity),
            inspect_quantity: formData.inspect_quantity,
            img: 'https://example.com/image2.jpg',
            // img: filename,
          },
        ],
      }
      const payloadTrackedItems = {
        reference_po: formData.reference_po,
        incoming_batch: Number(formData.incoming_batch),
        updateData: {
          is_confirm: true,
          location_detail: formData.location_detail,
        },
      }
      // console.log(payloadIncoming)
      // console.log(payloadTrackedItems)

      const resIncoming = await backendIncoming.post(
        '/api/v1/receiving-products/add',
        payloadIncoming,
      )
      const resTrackedItems = await backendTrackedItems.put(
        '/api/v1/tracked-items/confirm-items',
        payloadTrackedItems,
      )
      alert(`${resIncoming.data?.message}`)
      alert(`${resTrackedItems.data?.message}`)
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ---------- fetch master ---------- */
  useEffect(() => {
    ;(async () => {
      const [sapRes, partnerRes] = await Promise.all([
        backendProduct.get('/api/v1/products/all'),
        backendPartner.get('/api/v1/partners/all'),
      ])
      setSapData(sapRes.data.data)
      setPartnerData(partnerRes.data.data)
    })()
  }, [])

  useEffect(() => {
    fetchTrackedTotal()
  }, [formData.reference_po])

  useEffect(() => {
    ;(async () => {
      const qty = await fetchAql(formData.ref_quantity)
      setSampleQty(qty)
    })()
  }, [formData.ref_quantity])

  return (
    <CRow>
      {/* Incoming Form */}
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Incoming Semi Product (Pra-QC)</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {/* PO / AO */}
              <CFormLabel className="col-form-label">
                <strong>PO / AO</strong>
              </CFormLabel>

              {/* PO / AO No */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="reference_po" className="col-sm-2 col-form-label">
                  Reference PO
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="text"
                    id="reference_po"
                    name="reference_po"
                    placeholder="AOxxx"
                    value={formData.reference_po}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              {/* reference_gr */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="reference_gr" className="col-sm-2 col-form-label">
                  Reference GR
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="text"
                    id="reference_gr"
                    name="reference_gr"
                    value={formData.reference_gr}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              {/* Total Quantity */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="ref_quantity" className="col-sm-2 col-form-label">
                  Total Quantity
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="number"
                    id="ref_quantity"
                    name="ref_quantity"
                    value={formData.ref_quantity}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              {/* Incoming Material */}
              <CFormLabel className="col-form-label">
                <strong>Incoming Material</strong>
              </CFormLabel>

              {/* SAP Code */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="sap_code" className="col-sm-2 col-form-label">
                  SAP Code
                </CFormLabel>
                <CCol sm={10}>
                  <CFormSelect
                    id="sap_code"
                    name="sap_code"
                    value={formData.sap_code}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select SAP Code</option>
                    {sapData.map((u) => (
                      <option key={u.id} value={u.sap_code}>
                        {u.sap_code}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* UOM */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="uom" className="col-sm-2 col-form-label">
                  Unit
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="text" id="uom" name="uom" value={formData.uom} readOnly />
                </CCol>
              </CRow>

              {/* Incoming Batch */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="incoming_batch" className="col-sm-2 col-form-label">
                  Incoming Batch
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="number"
                    id="incoming_batch"
                    name="incoming_batch"
                    value={formData.incoming_batch}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              {/* Incoming Quantity */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="incoming_quantity" className="col-sm-2 col-form-label">
                  Incoming Quantity
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="number"
                    id="incoming_quantity"
                    name="incoming_quantity"
                    value={formData.incoming_quantity}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              {/* Remaining Quantity */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="remaining_quantity" className="col-sm-2 col-form-label">
                  Remaining Quantity
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="number"
                    id="remaining_quantity"
                    name="remaining_quantity"
                    value={remainingQty}
                    readOnly
                  />
                </CCol>
              </CRow>

              {/* Sample Quantity */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="sample_quantity" className="col-sm-2 col-form-label">
                  Sample Quantity
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="number"
                    id="sample_quantity"
                    name="sample_quantity"
                    value={sampleQty}
                    readOnly
                  />
                </CCol>
              </CRow>

              {/* Partner */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="partner_code" className="col-sm-2 col-form-label">
                  Partner
                </CFormLabel>
                <CCol sm={10}>
                  <CFormSelect
                    id="partner_code"
                    name="partner_code"
                    value={formData.partner_code}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Partner</option>
                    {partnerData.map((u) => (
                      <option key={u.id} value={u.partner_code}>
                        {u.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Note */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="notes" className="col-sm-2 col-form-label">
                  Note
                </CFormLabel>
                <CCol sm={10}>
                  <CFormTextarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              {/* Image */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="file" className="col-sm-2 col-form-label">
                  Image
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="file" id="file" name="file" onChange={handleChange} />
                </CCol>
              </CRow>

              {/* Early Inspection */}
              <CFormLabel className="col-form-label mt-3">
                <strong>Early Inspection</strong>
              </CFormLabel>
              {/* Quantity Check */}
              <CRow className="mb-3">
                <CCol sm={12}>
                  <div className="border rounded p-3">
                    <CFormLabel className="col-form-label">
                      Jumlah Kuantitas sudah sesuai
                    </CFormLabel>
                    <div className="d-flex justify-content-end gap-3">
                      <CFormCheck
                        inline
                        type="radio"
                        name="inspect_quantity"
                        id="inspectionYes"
                        value="true"
                        label="Ya"
                        checked={formData.inspect_quantity === true}
                        onChange={handleChange}
                        required
                      />
                      <CFormCheck
                        inline
                        type="radio"
                        name="inspect_quantity"
                        id="inspectionNo"
                        value="false"
                        label="Tidak"
                        checked={formData.inspect_quantity === false}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </CCol>
              </CRow>

              {/* Submit */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="primary" type="submit" disabled={loading}>
                  {loading ? 'Loading...' : 'Save'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12} md={6}>
        {/* Counter Remaining Quantity */}
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Counter Quantity</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol>
                <div className="text-center">
                  <h1 className="display-4 fw-bold">{scannedQty}</h1>
                  <small className="text-muted">Units</small>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        {/* Counter Saved Quantity */}
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Counter Saved Quantity</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol>
                <div className="text-center">
                  <h1 className="display-4 fw-bold">{savedQty}</h1>
                  <small className="text-muted">Units</small>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardHeader>
            <strong>Scan Barcode</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              {/* <CForm onSubmit={handleSubmit}> */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="barcode" className="col-sm-2 col-form-label">
                  Barcode
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="text"
                    id="barcode"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault() // cegah reload / submit form
                        handleBarcode()
                      }
                    }}
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PraQC
