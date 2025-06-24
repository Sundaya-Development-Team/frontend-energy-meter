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
  CRow,
} from '@coreui/react'

const QCAssemble = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Quality Control Assemble</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CFormLabel className="col-form-label"></CFormLabel>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormBarcodeInput" className="col-sm-2 col-form-label">
                  Barcode
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="text" id="FormBarcodeInput" />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormBatchProductionInput" className="col-sm-2 col-form-label">
                  Production Batch
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="text" id="FormBatchProductionInput" readOnly />
                </CCol>
              </CRow>
              <CFormLabel className="col-form-label">
                <strong>Visual Inspection</strong>
              </CFormLabel>
              <CRow className="mb-3">
                <CFormLabel className="col-form-label">Lampu Menyala</CFormLabel>
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
                <CFormLabel className="col-form-label">Layar Menyala</CFormLabel>
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
export default QCAssemble
