/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
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
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'

const QCUnits = () => {
  const [formData, setFormData] = useState({
    sapCode: 'SAP123456',
    sampleQty: 10,
    totalQty: 100,
    barcode: '',
    fluxClear: '',
    noSolderBridge: '',
    alignmentOk: '',
    powerOn: '',
    commTest: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('QC Result:', formData)
    alert('Form submitted. Check console for data.')
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Quality Control Semi Product</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {/* SAP Code */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="sapCode" className="col-sm-2 col-form-label">
                  SAP Code
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="text" id="sapCode" value={formData.sapCode} readOnly />
                </CCol>
              </CRow>

              {/* Sample Qty */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="sampleQty" className="col-sm-2 col-form-label">
                  Sample Quantity
                </CFormLabel>
                <CCol sm={10}>
                  <CInputGroup>
                    <CFormInput type="number" id="sampleQty" value={formData.sampleQty} readOnly />
                    <CInputGroupText>of</CInputGroupText>
                    <CFormInput type="number" value={formData.totalQty} readOnly />
                  </CInputGroup>
                </CCol>
              </CRow>

              {/* Barcode */}
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
                    placeholder="Scan barcode"
                  />
                </CCol>
              </CRow>

              {/* Visual Inspection */}
              <CFormLabel className="col-form-label">
                <strong>Visual Inspection</strong>
              </CFormLabel>

              {/* Flux Clear */}
              <CRow className="mb-3">
                <CFormLabel className="col-sm-2 col-form-label">Tidak ada sisa flux</CFormLabel>
                <CCol sm={10}>
                  <CFormCheck
                    inline
                    type="radio"
                    name="fluxClear"
                    value="yes"
                    label="Ya"
                    checked={formData.fluxClear === 'yes'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="fluxClear"
                    value="no"
                    label="Tidak"
                    checked={formData.fluxClear === 'no'}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              {/* No Solder Bridge */}
              <CRow className="mb-3">
                <CFormLabel className="col-sm-2 col-form-label">Tidak ada solder bridge</CFormLabel>
                <CCol sm={10}>
                  <CFormCheck
                    inline
                    type="radio"
                    name="noSolderBridge"
                    value="yes"
                    label="Ya"
                    checked={formData.noSolderBridge === 'yes'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="noSolderBridge"
                    value="no"
                    label="Tidak"
                    checked={formData.noSolderBridge === 'no'}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              {/* Alignment */}
              <CRow className="mb-3">
                <CFormLabel className="col-sm-2 col-form-label">
                  Komponen tidak miring &gt; 15°
                </CFormLabel>
                <CCol sm={10}>
                  <CFormCheck
                    inline
                    type="radio"
                    name="alignmentOk"
                    value="yes"
                    label="Ya"
                    checked={formData.alignmentOk === 'yes'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="alignmentOk"
                    value="no"
                    label="Tidak"
                    checked={formData.alignmentOk === 'no'}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              {/* Functional Test */}
              <CFormLabel className="col-form-label">
                <strong>Uji Fungsi</strong>
              </CFormLabel>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-2 col-form-label">
                  Produk menyala pada alat tes ON
                </CFormLabel>
                <CCol sm={10}>
                  <CFormCheck
                    inline
                    type="radio"
                    name="powerOn"
                    value="yes"
                    label="Ya"
                    checked={formData.powerOn === 'yes'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="powerOn"
                    value="no"
                    label="Tidak"
                    checked={formData.powerOn === 'no'}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              {/* Communication Test */}
              <CFormLabel className="col-form-label">
                <strong>Uji Komunikasi</strong>
              </CFormLabel>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-2 col-form-label">
                  Dapat mengirimkan data saat request
                </CFormLabel>
                <CCol sm={10}>
                  <CFormCheck
                    inline
                    type="radio"
                    name="commTest"
                    value="yes"
                    label="Ya"
                    checked={formData.commTest === 'yes'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="commTest"
                    value="no"
                    label="Tidak"
                    checked={formData.commTest === 'no'}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              {/* Submit */}
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

export default QCUnits
