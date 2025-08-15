/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CRow, CImage } from '@coreui/react'

const ScanBeforeAssemble = () => {
  const [formData, setFormData] = useState({
    pcbSnumb: '',
    productionBatch: '10',
    sideCoverSnumb: '',
  })

  const [pcbDisabled, setPcbDisabled] = useState(false)
  const [sideCoverDisabled, setSideCoverDisabled] = useState(true)

  const pcbInputRef = useRef(null)
  const sideCoverInputRef = useRef(null)

  useEffect(() => {
    pcbInputRef.current.focus()
    if (!sideCoverDisabled && sideCoverInputRef.current) {
      sideCoverInputRef.current.focus()
    }
  }, [sideCoverDisabled])

  const handlePcbSnumb = () => {
    console.log('PCB Barcode scanned:', formData.pcbSnumb)
    setPcbDisabled(true)
    setSideCoverDisabled(false) // setelah ini, useEffect di atas akan fokus otomatis
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSideCover = () => {
    console.log('Side Cover scanned:', formData.sideCoverSnumb)
  }

  return (
    <CRow>
      {/* PCB Serial Number */}
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>PCB Serial Number</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol sm={12}>
                  <CImage
                    src={`/src/assets/images/assembly/pcb_serial_number.jpeg`}
                    alt="PCB Preview"
                    fluid
                    className="mt-2"
                    style={{ width: '100%' }}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <div className="text-center">
                  <strong>PCB SERIAL NUMBER</strong>
                </div>
                <CCol sm={12}>
                  <CFormInput
                    type="text"
                    id="pcbSnumb"
                    name="pcbSnumb"
                    value={formData.pcbSnumb}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handlePcbSnumb()
                      }
                    }}
                    ref={pcbInputRef}
                    required
                    disabled={pcbDisabled}
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Side Cover Serial Number */}
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Side Cover Serial Number</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol sm={12}>
                  <CImage
                    src={`/src/assets/images/assembly/side_cover_serial_number.jpeg`}
                    alt="Side Cover Preview"
                    fluid
                    className="mt-2"
                    style={{ width: '100%' }}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <div className="text-center">
                  <strong>SCAN SERIAL NUMBER</strong>
                </div>
                <CCol sm={12}>
                  <CFormInput
                    type="text"
                    id="sideCoverSnumb"
                    name="sideCoverSnumb"
                    value={formData.sideCoverSnumb}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSideCover()
                      }
                    }}
                    ref={sideCoverInputRef}
                    required
                    disabled={sideCoverDisabled}
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ScanBeforeAssemble
