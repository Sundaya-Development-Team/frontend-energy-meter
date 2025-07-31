/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import Select from 'react-select'
import { backendProduct, backendPartner, backendAql } from '../../api/axios'

/* -------------------------------------------------------------------------- */
/* Helper functions                                                            */
/* -------------------------------------------------------------------------- */

// Ambil master product & partner data
const fetchMasters = () =>
  Promise.all([backendProduct.get('/master-products'), backendPartner.get('/master')])

// Hitung sample size AQL berdasarkan quantity
const fetchAqlSample = (sap_code, qc_stage, ref_quantity) =>
  ref_quantity
    ? backendAql
        .get('/aql-settings/calculate', {
          params: { sap_code, qc_stage, total_quantity: ref_quantity },
        })
        .then((r) => r.data.data.data.sample_size)
    : Promise.resolve(0)

/* -------------------------------------------------------------------------- */
/* Main component                                                              */
/* -------------------------------------------------------------------------- */
const ReceivingHeader = () => {
  // Master data
  const [sapData, setSapData] = useState([])
  const [partnerData, setPartnerData] = useState([])

  // Loading state
  const [loading, setLoading] = useState(false)

  // Form data: partner_code pindah ke header
  const [formData, setFormData] = useState({
    reference_po: '',
    reference_gr: '',
    partner_code: '',
    notes: '',
    details: [], // array produk
  })

  /* --------------------------- Effects ---------------------------------- */

  // Ambil data master saat mount pertama kali
  useEffect(() => {
    fetchMasters()
      .then(([sapRes, partnerRes]) => {
        setSapData(sapRes.data.data)
        setPartnerData(partnerRes.data.data)
      })
      .catch((err) => console.error('fetch masters error:', err))
  }, [])

  /* ------------------------ Handlers ----------------------------------- */

  // Tambahkan row product baru
  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        {
          sap_code: '',
          ref_quantity: '',
          name: '',
          uom: '',
          sample_size: 0, // nilai sample size per product
        },
      ],
    }))
  }

  // Handler field header (PO, GR, notes, partner)
  const handleInput = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handler partner dropdown
  const handleSelectPartner = (option) => {
    setFormData((prev) => ({
      ...prev,
      partner_code: option ? option.value : '',
    }))
  }

  // Handler perubahan field product
  const handleDetailChange = async (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.details]

      if (field === 'sap_code') {
        // update name & uom otomatis
        const found = sapData.find((p) => p.sap_code === value)
        updated[index].sap_code = value
        updated[index].name = found ? found.name : ''
        updated[index].uom = found?.uom?.code || ''
      } else if (field === 'ref_quantity') {
        updated[index][field] = value

        // Fetch sample size ketika quantity berubah
        fetchAqlSample(updated[index].sap_code, 'Receiving Semi Product', Number(value))
          .then((sample) => {
            updated[index].sample_size = sample
            setFormData((p) => ({ ...p, details: updated }))
          })
          .catch((err) => console.error('fetch sample error:', err))

        return { ...prev } // keluar, biar sample update async
      } else {
        updated[index][field] = value
      }
      return { ...prev, details: updated }
    })
  }

  // Submit: tampilkan payload di console
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!formData.reference_po.trim()) return alert('Reference PO is required.')
      if (!formData.partner_code.trim()) return alert('Partner is required.')
      if (formData.details.length === 0) return alert('Please add at least one product.')
      setLoading(true)

      // Payload
      const payload = {
        reference_po: formData.reference_po,
        reference_gr: formData.reference_gr,
        partner_code: formData.partner_code,
        notes: formData.notes,
        details: formData.details.map((d) => ({
          sap_code: d.sap_code,
          ref_quantity: Number(d.ref_quantity),
          sample_size: d.sample_size,
        })),
      }

      console.log('Payload:', payload)
      // await backendIncoming.post('/master-rp', payload)
      // alert('Success')
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ------------------------------ Render --------------------------------- */
  return (
    <CRow>
      <CCol md={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Receiving (Pra-SCAN Item)</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {/* Header */}
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
                />
              </FormRow>

              <FormRow label="Partner">
                <Select
                  options={partnerData.map((p) => ({
                    value: p.partner_code,
                    label: p.name,
                  }))}
                  value={
                    formData.partner_code
                      ? {
                          value: formData.partner_code,
                          label:
                            partnerData.find((p) => p.partner_code === formData.partner_code)
                              ?.name || '',
                        }
                      : null
                  }
                  onChange={handleSelectPartner}
                  placeholder="Select Partner"
                  isClearable
                  required
                />
              </FormRow>

              <FormRow label="Note">
                <CFormTextarea
                  rows={3}
                  name="notes"
                  value={formData.notes}
                  onChange={handleInput}
                />
              </FormRow>

              {/* List products */}
              <CFormLabel className="fw-bold mt-3">List of Product</CFormLabel>
              <br />
              <CButton color="primary" type="button" onClick={addProduct}>
                + Add Product
              </CButton>

              <table className="table table-bordered mt-2">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>SAP Code</th>
                    <th>Product Name</th>
                    <th>UOM</th>
                    <th>Order Qty</th>
                    <th>Sample Size</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.details.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <Select
                          options={sapData.map((p) => ({
                            value: p.sap_code,
                            label: p.sap_code,
                          }))}
                          value={
                            item.sap_code ? { value: item.sap_code, label: item.sap_code } : null
                          }
                          onChange={(opt) =>
                            handleDetailChange(index, 'sap_code', opt ? opt.value : '')
                          }
                          isClearable
                        />
                      </td>
                      <td>
                        <CFormInput value={item.name} readOnly />
                      </td>
                      <td>
                        <CFormInput value={item.uom} readOnly />
                      </td>
                      <td>
                        <CFormInput
                          type="number"
                          value={item.ref_quantity}
                          onChange={(e) =>
                            handleDetailChange(index, 'ref_quantity', e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <CFormInput value={item.sample_size} readOnly />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                <CButton color="primary" type="submit" disabled={loading}>
                  {loading ? 'Saving…' : 'Save'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

/* Komponen kecil util: FormRow */
const FormRow = ({ label, children }) => (
  <CRow className="mb-3">
    <CFormLabel className="col-sm-3 col-form-label">{label}</CFormLabel>
    <CCol sm={9}>{children}</CCol>
  </CRow>
)

export default ReceivingHeader
