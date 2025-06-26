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
  CRow,
} from '@coreui/react'

const QCAssemble = () => {
  const [formData, setFormData] = useState({
    barcode: '',
    productionBatch: '10',
    lampuMenyala: '',
    layarMenyala: '',
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
    console.log('QC Assemble Data:', formData)
    alert(`Hasil QC:
    Barcode: ${formData.barcode}
    Batch: ${formData.productionBatch}
    Lampu Menyala: ${formData.lampuMenyala}
    Layar Menyala: ${formData.layarMenyala}
    `)
    // Tambahkan API call ke backend jika perlu
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Quality Control Assemble</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CFormLabel htmlFor="FormBarcodeInput" className="col-sm-2 col-form-label">
                  Barcode
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="text"
                    id="FormBarcodeInput"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CFormLabel htmlFor="FormBatchProductionInput" className="col-sm-2 col-form-label">
                  Production Batch
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="text"
                    id="FormBatchProductionInput"
                    name="productionBatch"
                    value={formData.productionBatch}
                    readOnly
                  />
                </CCol>
              </CRow>

              <CFormLabel className="col-form-label">
                <strong>Visual Inspection</strong>
              </CFormLabel>

              <CRow className="mb-3">
                <CFormLabel className="col-sm-2 col-form-label">Lampu Menyala</CFormLabel>
                <CCol sm={10}>
                  <CFormCheck
                    inline
                    type="radio"
                    name="lampuMenyala"
                    id="lampuYes"
                    value="Ya"
                    label="Ya"
                    checked={formData.lampuMenyala === 'Ya'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="lampuMenyala"
                    id="lampuNo"
                    value="Tidak"
                    label="Tidak"
                    checked={formData.lampuMenyala === 'Tidak'}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CFormLabel className="col-sm-2 col-form-label">Layar Menyala</CFormLabel>
                <CCol sm={10}>
                  <CFormCheck
                    inline
                    type="radio"
                    name="layarMenyala"
                    id="layarYes"
                    value="Ya"
                    label="Ya"
                    checked={formData.layarMenyala === 'Ya'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="layarMenyala"
                    id="layarNo"
                    value="Tidak"
                    label="Tidak"
                    checked={formData.layarMenyala === 'Tidak'}
                    onChange={handleChange}
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

