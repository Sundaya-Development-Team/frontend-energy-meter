/* eslint-disable prettier/prettier */
import React from 'react'
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
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>QC Semi Product</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CFormLabel className="col-form-label"></CFormLabel>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormSAPCodeInput" className="col-sm-2 col-form-label">
                  SAP Code
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="text" id="FormSAPCodeInput" readOnly />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormSampleQuantityInput" className="col-sm-2 col-form-label">
                  Sample Quantity
                </CFormLabel>
                <CCol sm={10}>
                  {/* <CFormInput type="number" id="FormSampleQuantityInput" readOnly /> */}
                  <CInputGroup>
                    <CFormInput type="number" id="FormSampleQuantityInput" aria-label="Username" />
                    <CInputGroupText>of</CInputGroupText>
                    <CFormInput id="FormTotalQuantityInput" readOnly />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormBarcodeInput" className="col-sm-2 col-form-label">
                  Barcode
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="text" id="FormBarcodeInput" />
                </CCol>
              </CRow>
              <CFormLabel className="col-form-label">
                <strong>Visual Inspection</strong>
              </CFormLabel>
              <CRow className="mb-3">
                <CFormLabel className="col-form-label">Tidak ada sisa flux</CFormLabel>
                <CCol sm={10}>
                  <CFormCheck
                    inline
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineCheckbox1"
                    value="option1"
                    label="Ya"
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineCheckbox2"
                    value="option2"
                    label="Tidak"
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-form-label">Tidak ada solder bridge</CFormLabel>
                <CCol sm={10}>
                  <CFormCheck
                    inline
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineCheckbox1"
                    value="option1"
                    label="Ya"
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineCheckbox2"
                    value="option2"
                    label="Tidak"
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-form-label">
                  Komponen tidak miring lebih dari 15° dari placement
                </CFormLabel>
                <CCol sm={10}>
                  <CFormCheck
                    inline
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineCheckbox1"
                    value="option1"
                    label="Ya"
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineCheckbox2"
                    value="option2"
                    label="Tidak"
                  />
                </CCol>
              </CRow>

              <CFormLabel className="col-form-label">
                <strong>Uji Fungsi</strong>
              </CFormLabel>
              <CRow className="mb-3">
                <CFormLabel className="col-form-label">Produk menyala pada alat tes ON</CFormLabel>
                <CCol sm={10}>
                  <CFormCheck
                    inline
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineCheckbox1"
                    value="option1"
                    label="Ya"
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineCheckbox2"
                    value="option2"
                    label="Tidak"
                  />
                </CCol>
              </CRow>
              <CFormLabel className="col-form-label">
                <strong>Uji Komunikasi</strong>
              </CFormLabel>
              <CRow className="mb-3">
                <CFormLabel className="col-form-label">Dapat mengirimkan data pada saat ada request</CFormLabel>
                <CCol sm={10}>
                  <CFormCheck
                    inline
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineCheckbox1"
                    value="option1"
                    label="Ya"
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineCheckbox2"
                    value="option2"
                    label="Tidak"
                  />
                </CCol>
              </CRow>

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
