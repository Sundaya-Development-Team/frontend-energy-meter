/* eslint-disable prettier/prettier */
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
  CSpinner,
} from '@coreui/react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { backendGenerate } from '../../../api/axios'

const ConfirmSerialPrint = () => {
  const [serialInput, setSerialInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!serialInput.trim()) {
      toast.error('Masukkan serial number terlebih dahulu!')
      return
    }

    // pecah input jadi array serial codes
    const serialCodes = serialInput
      .split(/[\n,]+/) // pisah pakai enter atau koma
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    const payload = {
      serialCodes,
      status: 'LASSERED',
    }

    console.log('payload:', payload)

    try {
      setLoading(true)
      const res = await backendGenerate.post('/confirm-print', payload)
      toast.success(res.data?.message || 'Konfirmasi berhasil!')
      setSerialInput('')
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol md={8} className="mx-auto">
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Konfirmasi Serial Number Dicetak</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Serial Numbers</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    as="textarea"
                    rows={5}
                    placeholder="Masukkan serial number, pisahkan dengan koma atau baris baru"
                    value={serialInput}
                    onChange={(e) => setSerialInput(e.target.value)}
                  />
                </CCol>
              </CRow>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="success" type="submit" disabled={loading} className="text-white">
                  {loading ? (
                    <>
                      <CSpinner size="sm" /> Mengirim...
                    </>
                  ) : (
                    'Konfirmasi'
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

export default ConfirmSerialPrint
