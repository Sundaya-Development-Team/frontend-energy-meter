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
  CFormSelect,
  CRow,
} from '@coreui/react'

const IncomingUnit = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Scan Incoming Semi Product</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
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
                <CFormLabel htmlFor="FormBarcodeInput" className="col-sm-2 col-form-label">
                  Barcode
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="text" id="FormBarcodeInput" placeholder="Scan Barcode" />
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

export default IncomingUnit
