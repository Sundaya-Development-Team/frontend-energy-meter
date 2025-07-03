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
import { backendIncoming, backendPartner, backendProduct } from '../../api/axios'

const PraQC = () => {
  const [loading, setLoading] = useState(false)
  const [sapData, setSapData] = useState([])
  const [partnerData, setPartnerData] = useState([])
  const [formData, setFormData] = useState({
    ref_code: '',
    notes: '',
    sap_code: '',
    partner_code: '',
    ref_quantity: '',
    incoming_batch: '',
    incoming_quantity: '',
    remaining_quantity: '100',
    sample_quantity: '100',
    inspect_quantity: '',
    image: null,
  })

  /* ---------- Handle ---------- */
  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (name === 'inspect_quantity') {
      return setFormData((p) => ({
        ...p,
        inspect_quantity: value === 'true',
      }))
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }))
  }

  const handleSubmit = async (e) => {
    // e.preventDefault()
    try {
      setLoading(true)
      // console.log('Form data:', formData)
      // alert(`
      //   ref_code: ${formData.ref_code}
      //   notes: ${formData.notes}
      //   SAP Code: ${formData.sap_code}
      //   partner_code: ${formData.partner_code}
      //   ref_quantity: ${formData.ref_quantity}
      //   incoming_batch: ${formData.incoming_batch}
      //   incoming_quantity: ${formData.incoming_quantity}
      //   remaining_quantity: ${formData.remaining_quantity}
      //   sample_quantity: ${formData.sample_quantity}
      //   inspect_quantity: ${formData.inspect_quantity}
      //   Image: ${formData.image?.name}
      // `)
      const payload = {
        ref_code: formData.ref_code,
        notes: formData.notes,
        details: [
          {
            sap_code: formData.sap_code,
            partner_code: formData.partner_code,
            ref_quantity: Number(formData.ref_quantity),
            incoming_batch: Number(formData.incoming_batch),
            incoming_quantity: Number(formData.incoming_quantity),
            remaining_quantity: Number(formData.remaining_quantity),
            sample_quantity: Number(formData.sample_quantity),
            inspect_quantity: formData.inspect_quantity,
            img: formData.image?.name,
          },
        ],
      }
      // console.log(payload)
      const res = await backendIncoming.post('/api/v1/products-receiving/add', payload)
      alert(`${res.data?.message}`)
    } catch (error) {
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
                <CFormLabel htmlFor="ref_code" className="col-sm-2 col-form-label">
                  Reference Code
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="text"
                    id="ref_code"
                    name="ref_code"
                    placeholder="AOxxx"
                    value={formData.ref_code}
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
                    value={formData.remaining_quantity}
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
                    value={formData.sample_quantity}
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
                <CFormLabel htmlFor="image" className="col-sm-2 col-form-label">
                  Image
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="file" id="image" name="image" onChange={handleChange} />
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
      {/* barcode form */}
      <CCol xs={12} md={6}>
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
                    // value={formData.barcode}
                    // onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              {/* <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="primary" type="submit">
                  Submit
                </CButton>
              </div> */}
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PraQC
