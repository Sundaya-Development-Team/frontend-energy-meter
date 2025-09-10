import React, { useState, useRef, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CRow, CImage } from '@coreui/react'
import { toast } from 'react-toastify'

const PlnSerialComparator = () => {
  const [formData, setFormData] = useState({
    sidePlnSerial: '',
    frontPlnSerial: '',
  })

  const [sideDisabled, setSideDisabled] = useState(false)
  const [frontDisabled, setFrontDisabled] = useState(true)

  const sideInputRef = useRef(null)
  const frontInputRef = useRef(null)

  // Fokus pertama ke Side PLN
  useEffect(() => {
    sideInputRef.current?.focus()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSidePlnEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (formData.sidePlnSerial.trim() !== '') {
        setSideDisabled(true) //disable side cover
        setFrontDisabled(false) //enable front cover
        setTimeout(() => {
          frontInputRef.current?.focus()
        }, 100)
      }
    }
  }

  const handleFrontPlnEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (formData.frontPlnSerial.trim() !== '') {
        // Bandingkan kedua serial
        if (formData.frontPlnSerial === formData.sidePlnSerial) {
          toast.success('Serial numbers match')
        } else {
          toast.error('Serial numbers do not match')
        }

        // Reset form untuk scan ulang
        setFormData({
          sidePlnSerial: '',
          frontPlnSerial: '',
        })
        setSideDisabled(false)
        setFrontDisabled(true)

        setTimeout(() => {
          sideInputRef.current?.focus()
        }, 100)
      }
    }
  }

  return (
    <CRow>
      {/* Side PLN Serial */}
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Side Cover PLN Serial</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol sm={12} className="d-flex justify-content-center">
                  <CImage
                    src={`/src/assets/images/assembly/pcb_serial_number.jpeg`}
                    alt="Side Cover Preview"
                    fluid
                    className="mt-2"
                    style={{ width: '60%' }}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <div className="text-center">
                  <strong>SIDE COVER PLN SERIAL</strong>
                </div>
                <CCol sm={12} className="d-flex justify-content-center">
                  <CFormInput
                    type="text"
                    name="sidePlnSerial"
                    value={formData.sidePlnSerial}
                    onChange={handleChange}
                    onKeyDown={handleSidePlnEnter}
                    placeholder="Scan Side Cover PLN Serial"
                    ref={sideInputRef}
                    disabled={sideDisabled}
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Front Cover PLN Serial */}
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Front Cover PLN Serial</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol sm={12} className="d-flex justify-content-center">
                  <CImage
                    src={`/src/assets/images/assembly/side_cover_serial_number.jpeg`}
                    alt="Front Cover Preview"
                    fluid
                    className="mt-2"
                    style={{ width: '60%' }}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <div className="text-center">
                  <strong>SCAN FRONT COVER PLN SERIAL</strong>
                </div>
                <CCol sm={12} className="d-flex justify-content-center">
                  <CFormInput
                    type="text"
                    name="frontPlnSerial"
                    value={formData.frontPlnSerial}
                    onChange={handleChange}
                    onKeyDown={handleFrontPlnEnter}
                    placeholder="Scan Front Cover PLN Serial"
                    ref={frontInputRef}
                    disabled={frontDisabled}
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

export default PlnSerialComparator
