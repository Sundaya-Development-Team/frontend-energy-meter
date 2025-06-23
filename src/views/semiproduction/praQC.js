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
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'

const PraQC = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Incoming Semi Product (Pra-QC)</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CFormLabel className="col-form-label">
                <strong>PO / AO ....</strong>
              </CFormLabel>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormAOInput" className="col-sm-2 col-form-label">
                  PO / AO No
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="text" id="FormAOInput" placeholder="AOxxx" />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CFormLabel htmlFor="FormTotalQuantityInput" className="col-sm-2 col-form-label">
                  Total Quantity
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="number" id="FormTotalQuantityInput" />
                </CCol>
              </CRow>
              <CFormLabel className="col-form-label">
                <strong>Incoming Material</strong>
              </CFormLabel>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormSAPCodeInput" className="col-sm-2 col-form-label">
                  SAP Code
                </CFormLabel>
                <CCol sm={10}>
                  <CFormSelect aria-label="Default select example">
                    <option>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormBatchIncomingInput" className="col-sm-2 col-form-label">
                  Incoming Batch
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="number" id="FormBatchIncomingInput" />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormIncomingQuantityInput" className="col-sm-2 col-form-label">
                  Incoming Quantity
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="number" id="FormBatchIncomingInput" />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="FormRemainingQuantityInput"
                  className="col-sm-2 col-form-label"
                >
                  Remaining Quantity
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="number" id="FormRemainingQuantityInput" readOnly />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormSampleQuantityInput" className="col-sm-2 col-form-label">
                  Sample Quantity
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="number" id="FormSampleQuantityInput" readOnly />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormSAPCodeInput" className="col-sm-2 col-form-label">
                  Supplier
                </CFormLabel>
                <CCol sm={10}>
                  <CFormSelect aria-label="Default select example">
                    <option>Select Supplier</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormNoteInput" className="col-sm-2 col-form-label">
                  Note
                </CFormLabel>
                <CCol sm={10}>
                  <CFormTextarea id="FormNoteInput" rows={3}></CFormTextarea>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormImageInput" className="col-sm-2 col-form-label">
                  Image
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="file" id="FormImageInput" />
                </CCol>
              </CRow>
              <CFormLabel className="col-form-label">
                <strong>Early Inspection</strong>
              </CFormLabel>
              <CRow className="mb-3">
                <CFormLabel className="col-form-label">Jumlah Kuantitas sudah sesuai</CFormLabel>
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
export default PraQC
