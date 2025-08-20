import React, { useState, useEffect, useRef } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CRow, CImage } from '@coreui/react'
import { backendTracking } from '../../../api/axios'
import { toast } from 'react-toastify'

const ScanBeforeAssembly = () => {
  const [formData, setFormData] = useState({
    pcbSnumb: '',
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

  const handleSideCover = async () => {
    if (!formData.pcbSnumb || !formData.sideCoverSnumb) {
      toast.warning('Serial number belum lengkap!')
      return
    }

    try {
      const payload = {
        parent_serial_number: formData.sideCoverSnumb, // SN berikutnya
        component_serial_number: formData.pcbSnumb, // SN sebelumnya
        quantity: 1,
      }

      const res = await backendTracking.post('/assembly-components/by-serial', payload)

      toast.success(res.data?.message || 'Data berhasil dikirim!')

      // reset state agar siap scan lagi
      setFormData({
        pcbSnumb: '',
        sideCoverSnumb: '',
      })
      setPcbDisabled(false)
      setSideCoverDisabled(true)

      // balikin fokus ke PCB input
      setTimeout(() => {
        pcbInputRef.current?.focus()
      }, 100)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal submit data!')
    }
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
                <CCol sm={12} className="d-flex justify-content-center">
                  <CImage
                    src={`/src/assets/images/assembly/pcb_serial_number.jpeg`}
                    alt="PCB Preview"
                    fluid
                    className="mt-2"
                    style={{ width: '60%' }}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <div className="text-center">
                  <strong>PCB SERIAL NUMBER</strong>
                </div>
                <CCol sm={12} className="d-flex justify-content-center">
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
                <CCol sm={12} className="d-flex justify-content-center">
                  <CImage
                    src={`/src/assets/images/assembly/side_cover_serial_number.jpeg`}
                    alt="Side Cover Preview"
                    fluid
                    className="mt-2"
                    style={{ width: '60%' }}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <div className="text-center">
                  <strong>SCAN SERIAL NUMBER</strong>
                </div>
                <CCol sm={12} className="d-flex justify-content-center">
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

export default ScanBeforeAssembly
