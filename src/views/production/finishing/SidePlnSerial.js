import React, { useState, useEffect, useRef } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CRow, CImage } from '@coreui/react'
import { toast } from 'react-toastify'
import { backendGenerate, backendTracking } from '../../../api/axios'

const ClosingCover = () => {
  const [formData, setFormData] = useState({
    sideCoverSnumb: '',
    closingCoverSnumb: '',
  })

  const [pcbDisabled, setPcbDisabled] = useState(false)
  const [closingCoverDisable, setclosingCoverDisable] = useState(true)

  const sideCoverInputRef = useRef(null)
  const closingCoverRef = useRef(null)

  useEffect(() => {
    sideCoverInputRef.current.focus()
    if (!closingCoverDisable && closingCoverRef.current) {
      closingCoverRef.current.focus()
    }
  }, [closingCoverDisable])

  const handlesideCoverSnumb = () => {
    setPcbDisabled(true)
    setclosingCoverDisable(false) // setelah ini, useEffect di atas akan fokus otomatis
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Fungsi untuk update PLN Code ke backendTracking
  const updatePlnCode = async (sideCoverSnumb, closingCoverSnumb) => {
    try {
      const payloadUpdate = {
        serial_number: sideCoverSnumb, // SIDE COVER SN
        pln_code: closingCoverSnumb, // CLOSING COVER SN
      }

      const updateRes = await backendTracking.post('/update-pln-code', payloadUpdate)
      toast.success(updateRes.data?.message || 'PLN Code berhasil diupdate!')

      // Reset form
      setFormData({ sideCoverSnumb: '', closingCoverSnumb: '' })

      // Setelah sukses:
      setclosingCoverDisable(true) // Closing Cover disable
      setPcbDisabled(false) // Side Cover enable lagi

      // Fokus ke Side Cover input
      setTimeout(() => {
        sideCoverInputRef.current?.focus()
      }, 100)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal update PLN Code!')
    }
  }

  // Fungsi utama untuk handle Closing Cover
  const handleClosingCover = async () => {
    const { closingCoverSnumb, sideCoverSnumb } = formData

    if (!closingCoverSnumb || !sideCoverSnumb) {
      toast.warning('Serial number Closing Cover & Side Cover harus diisi!')
      return
    }

    console.log('Closing Cover SN :', closingCoverSnumb)
    console.log('Side Cover SN    :', sideCoverSnumb)

    try {
      const payloadValidate = { serialCode: closingCoverSnumb }
      const response = await backendGenerate.post('/validate', payloadValidate)
      const validation = response.data?.data?.isValid

      if (!validation) {
        console.log('Closing Cover tidak valid')
        setFormData({ sideCoverSnumb: '', closingCoverSnumb: '' })

        setTimeout(() => {
          sideCoverInputRef.current?.focus()
        }, 100)

        toast.error(response.data?.data?.message || 'Closing Cover tidak valid!')
        return
      }

      console.log('Closing Cover valid')

      await updatePlnCode(sideCoverSnumb, closingCoverSnumb)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat validasi!')
    }
  }

  return (
    <CRow>
      {/* Side Cover Number */}
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
                    id="sideCoverSnumb"
                    name="sideCoverSnumb"
                    value={formData.sideCoverSnumb}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handlesideCoverSnumb()
                      }
                    }}
                    ref={sideCoverInputRef}
                    required
                    disabled={pcbDisabled}
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Closing Cover  Serial Number */}
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
                        handleClosingCover()
                      }
                    }}
                    ref={closingCoverRef}
                    required
                    disabled={closingCoverDisable}
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
