/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import { backendReceving } from '../../api/axios'

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
  CSpinner,
} from '@coreui/react'

const ReceivingHeader = () => {
  const [formData, setFormData] = useState({
    po_number: '',
    order_date: new Date(),
    notes: '',
  })

  const [loading, setLoading] = useState(false)

  const handleInput = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      po_number: formData.po_number,
      order_date: formData.order_date.toISOString(), // ISO format
      notes: formData.notes,
    }

    try {
      const response = await backendReceving.post('/', payload)
      console.log('Success:', response.data)
      toast.success('Purchase Order submitted successfully!')
      setFormData({
        po_number: '',
        order_date: new Date(),
        notes: '',
      })
    } catch (error) {
      console.error('Error submitting PO:', error)
      toast.error('Failed to submit PO. See console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol md={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Create Purchase Order</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <FormRow label="PO Number">
                <CFormInput
                  name="po_number"
                  value={formData.po_number}
                  onChange={handleInput}
                  placeholder="Enter PO Number"
                  required
                />
              </FormRow>

              <FormRow label="Order Date">
                <DatePicker
                  selected={formData.order_date}
                  onChange={(date) => setFormData((prev) => ({ ...prev, order_date: date }))}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  placeholderText="Select a date"
                  required
                />
              </FormRow>

              <FormRow label="Notes">
                <CFormTextarea
                  rows={3}
                  name="notes"
                  value={formData.notes}
                  onChange={handleInput}
                  placeholder="Write any additional notes"
                />
              </FormRow>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                <CButton color="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <CSpinner size="sm" /> Saving…
                    </>
                  ) : (
                    'Save'
                  )}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

const FormRow = ({ label, children }) => (
  <CRow className="mb-3">
    <CFormLabel className="col-sm-3 col-form-label">{label}</CFormLabel>
    <CCol sm={9}>{children}</CCol>
  </CRow>
)

export default ReceivingHeader
