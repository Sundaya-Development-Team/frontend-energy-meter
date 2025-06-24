/* eslint-disable prettier/prettier */
import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react'

const ReportQCUnit = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Report QC Semi Product</strong>
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
                <CFormLabel htmlFor="FormPartNameInput" className="col-sm-2 col-form-label">
                  Part Name
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="number" id="FormPartNameInput" readOnly />
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
                <CFormLabel htmlFor="FormUploadInput" className="col-sm-2 col-form-label">
                  Upload Form
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="file" id="FormUploadInput" />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormTotalAcceptInput" className="col-sm-2 col-form-label">
                  Total Accept
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="number" id="FormTotalAcceptInput" readOnly />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormTotalRejectInput" className="col-sm-2 col-form-label">
                  Total Reject
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="number" id="FormTotalRejectInput" readOnly />
                </CCol>
              </CRow>
              <CFormLabel className="col-form-label">
                <strong>Reject Picture</strong>
              </CFormLabel>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormUploadInput" className="col-sm-2 col-form-label">
                  Upload Image
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="file" id="FormUploadInput" />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormUploadInput" className="col-sm-2 col-form-label">
                  Upload Image
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="file" id="FormUploadInput" />
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
export default ReportQCUnit
