import React, { useState } from 'react'
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

const GeneratePlnSerial = () => {
  const [formData, setFormData] = useState({
    referencePO: '',
    plnRaw: 'PLN01030000195',
    stsId: '125',
    generateQty: '', // tambahkan supaya tidak undefined
  })

  const handleInput = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Payload Submit:', formData)
    alert('Form submitted, cek console log payload!')
  }

  return (
    <CRow>
      <CCol md={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Incoming Warehouse</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <FormRow label="Reference PO AO / PO">
                <CFormInput
                  name="referencePO"
                  value={formData.referencePO}
                  onChange={handleInput}
                  required
                />
              </FormRow>

              <FormRow label="PLN Raw Serial">
                <CFormInput name="plnRaw" value={formData.plnRaw} readOnly />
              </FormRow>

              <FormRow label="STS ID">
                <CFormInput name="stsId" value={formData.stsId} readOnly />
              </FormRow>

              <FormRow label="Total Quantity">
                <CFormInput
                  type="number"
                  name="generateQty"
                  value={formData.generateQty}
                  onChange={handleInput}
                  required
                />
              </FormRow>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="primary" type="submit">
                  Generate
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

const FormRow = ({ label, children, labelCols = '3' }) => (
  <CRow className="mb-3">
    <CFormLabel className={`col-sm-${labelCols} col-form-label`}>{label}</CFormLabel>
    <CCol sm={12 - Number(labelCols)}>{children}</CCol>
  </CRow>
)

export default GeneratePlnSerial
