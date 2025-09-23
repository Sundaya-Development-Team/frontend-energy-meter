import React, { useState, useEffect, useRef } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CRow } from '@coreui/react'
import { backendTracking } from '../../../api/axios'
import { toast } from 'react-toastify'
import ImageContainer from '../../../components/common/ImageContainer'

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
    if (!pcbDisabled) {
      pcbInputRef.current?.focus()
    } else if (!sideCoverDisabled) {
      sideCoverInputRef.current?.focus()
    }
  }, [pcbDisabled, sideCoverDisabled])

  const resetForm = () => {
    setFormData({ pcbSnumb: '', sideCoverSnumb: '' })
    setPcbDisabled(false)
    setSideCoverDisabled(true)
    setTimeout(() => pcbInputRef.current?.focus(), 100)
  }

  const handlePcbSnumb = async () => {
    try {
      const response = await backendTracking.get(`/serial/${formData.pcbSnumb}`)
      if (response.data.success) {
        setPcbDisabled(true)
        setSideCoverDisabled(false)
      } else {
        toast.error(response.data.message || 'PCB tidak ditemukan!')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal ambil data PCB!')
    }
  }

  const handleSideCover = async () => {
    if (!formData.pcbSnumb || !formData.sideCoverSnumb) {
      toast.warning('Serial number belum lengkap!')
      return
    }

    try {
      const payload = {
        parent_serial_number: formData.sideCoverSnumb,
        component_serial_number: formData.pcbSnumb,
        quantity: 1,
      }

      const res = await backendTracking.post('/assembly-components/by-serial', payload)
      toast.success(res.data?.message || 'Data berhasil disimpan!')
      resetForm()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal submit data!')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
                  <ImageContainer
                    src="/src/assets/images/assembly/pcb_serial_number.jpeg"
                    alt="PCB Preview"
                    height="300px"
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3 text-center">
                <strong>PCB SERIAL NUMBER</strong>
                <CCol sm={12} className="d-flex justify-content-center mt-2">
                  <CFormInput
                    type="text"
                    id="pcbSnumb"
                    name="pcbSnumb"
                    value={formData.pcbSnumb}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handlePcbSnumb())}
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
                  <ImageContainer
                    src="/src/assets/images/assembly/side_cover_serial_number.jpeg"
                    alt="Side Cover Preview"
                    height="300px"
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3 text-center">
                <strong>SCAN SERIAL NUMBER</strong>
                <CCol sm={12} className="d-flex justify-content-center mt-2">
                  <CFormInput
                    type="text"
                    id="sideCoverSnumb"
                    name="sideCoverSnumb"
                    value={formData.sideCoverSnumb}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSideCover())}
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
