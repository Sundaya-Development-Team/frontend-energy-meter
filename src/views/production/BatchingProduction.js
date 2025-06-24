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

const BatchingProduction = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Batch Product</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormBatchProductionInput" className="col-sm-2 col-form-label">
                  Production Batch
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="number" id="FormBatchProductionInput" />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormTotalUnitInput" className="col-sm-2 col-form-label">
                  Total Unit
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="text" id="FormTotalUnitInput" />
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

export default BatchingProduction
