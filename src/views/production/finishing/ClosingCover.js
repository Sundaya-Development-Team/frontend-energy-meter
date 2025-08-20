import React, { useState, useEffect, useRef } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CRow, CImage } from '@coreui/react'

const ClosingCover = () => {
  const [formData, setFormData] = useState({
    sideCoverSnum: '',
    productionBatch: '10',
    closingCoverSnumb: '',
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

  const handlesideCoverSnum = () => {
    console.log('Side Cover scanned:', formData.sideCoverSnum)
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
    console.log('Closing Cover scanned:', formData.closingCoverSnumb)
  }

  return (
    <CRow>
      {/* PCB Serial Number */}
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Side Cover Serial Number</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol sm={12} className="d-flex justify-content-center">
                  <CImage
                    src={`/src/assets/images/assembly/side_cover_serial_number.jpeg`}
                    alt="Side Cover Serial Number"
                    fluid
                    className="mt-2"
                    style={{ width: '60%' }}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <div className="text-center">
                  <strong>SIDE COVER SERIAL NUMBER</strong>
                </div>
                <CCol sm={12} className="d-flex justify-content-center">
                  <CFormInput
                    type="text"
                    id="sideCoverSnum"
                    name="sideCoverSnum"
                    value={formData.sideCoverSnum}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handlesideCoverSnum()
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
            <strong>Closing Cover Serial Number</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol sm={12} className="d-flex justify-content-center">
                  <CImage
                    src={`/src/assets/images/assembly/tutup_cover.jpeg`}
                    alt="Closing Cover Serial Number"
                    fluid
                    className="mt-2"
                    style={{ width: '60%' }}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <div className="text-center">
                  <strong>CLOSING COVER SERIAL NUMBER</strong>
                </div>
                <CCol sm={12} className="d-flex justify-content-center">
                  <CFormInput
                    type="text"
                    id="closingCoverSnumb"
                    name="closingCoverSnumb"
                    value={formData.closingCoverSnumb}
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

export default ClosingCover
