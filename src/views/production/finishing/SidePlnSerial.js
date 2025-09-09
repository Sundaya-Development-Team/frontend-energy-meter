import React, { useState, useEffect, useRef } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CRow, CImage } from '@coreui/react'
import { toast } from 'react-toastify'
import { backendGenerate, backendTracking } from '../../../api/axios'

const SidePlnSerial = () => {
  const [formData, setFormData] = useState({
    sideProdSnumb: '',
    sidePlnSerial: '',
  })

  const [pcbDisabled, setPcbDisabled] = useState(false)
  const [sidePlnDisable, setSidePlnDisable] = useState(true)

  const sideCoverInputRef = useRef(null)
  const sidePlnRef = useRef(null)

  useEffect(() => {
    sideCoverInputRef.current.focus()
    if (!sidePlnDisable && sidePlnRef.current) {
      sidePlnRef.current.focus()
    }
  }, [sidePlnDisable])

  const handlesideProdSnumb = async () => {
    try {
      const response = await backendTracking.get(`/serial/${formData.sideProdSnumb}`)

      console.log('Response:', response.data)

      if (response.data.success === true) {
        setPcbDisabled(true)
        setSidePlnDisable(false) // setelah ini, useEffect di atas akan fokus otomatis
      } else {
        toast.error(response.data.message || 'Failed Get Item, Item Not Found')
      }
    } catch (error) {
      console.error('Error fetching serial:', error)
      toast.error(error.response?.data?.message || 'Failed Get Item Data!')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Fungsi untuk update PLN Code ke backendTracking
  const updatePlnCode = async (sideProdSnumb, sidePlnSerial) => {
    try {
      const payloadUpdate = {
        serial_number: sideProdSnumb, // SIDE COVER SN
        pln_code: sidePlnSerial, // Side PLN Serial SN
      }

      const updateRes = await backendTracking.post('/update-pln-code', payloadUpdate)
      toast.success(updateRes.data?.message || 'PLN Code berhasil diupdate!')

      // Reset form
      setFormData({ sideProdSnumb: '', sidePlnSerial: '' })

      // Setelah sukses:
      setSidePlnDisable(true) // Side PLN Serial disable
      setPcbDisabled(false) // Side Cover enable lagi

      // Fokus ke Side Cover input
      setTimeout(() => {
        sideCoverInputRef.current?.focus()
      }, 100)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal update PLN Code!')
    }
  }

  // Fungsi utama untuk handle Side PLN Serial
  const handleSidePLNSerial = async () => {
    const { sidePlnSerial, sideProdSnumb } = formData

    if (!sidePlnSerial || !sideProdSnumb) {
      toast.warning('Serial number Side PLN Serial & Side Cover harus diisi!')
      return
    }

    console.log('Side PLN Serial SN :', sidePlnSerial)
    console.log('Side Cover SN    :', sideProdSnumb)

    try {
      const payloadValidate = { serialCode: sidePlnSerial }
      const response = await backendGenerate.post('/validate', payloadValidate)
      const validation = response.data?.data?.isValid

      if (!validation) {
        console.log('Side PLN Serial tidak valid')
        setFormData({ sideProdSnumb: '', sidePlnSerial: '' })

        setTimeout(() => {
          sideCoverInputRef.current?.focus()
        }, 100)

        toast.error(response.data?.data?.message || 'Side PLN Serial tidak valid!')
        return
      }

      console.log('Side PLN Serial valid')

      await updatePlnCode(sideProdSnumb, sidePlnSerial)
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
            <strong>Side Product Serial Number</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol sm={12} className="d-flex justify-content-center">
                  <CImage
                    src={`/src/assets/images/assembly/side_cover_serial_number.jpeg`}
                    alt="Side Product Serial Number"
                    fluid
                    className="mt-2"
                    style={{ width: '60%' }}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <div className="text-center">
                  <strong>Side Product Serial Number</strong>
                </div>
                <CCol sm={12} className="d-flex justify-content-center">
                  <CFormInput
                    type="text"
                    id="sideProdSnumb"
                    name="sideProdSnumb"
                    value={formData.sideProdSnumb}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handlesideProdSnumb()
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

      {/* Side PLN Serial  Serial Number */}
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Side PLN Serial Serial Number</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol sm={12} className="d-flex justify-content-center">
                  <CImage
                    src={`/src/assets/images/assembly/tutup_cover.jpeg`}
                    alt="Side PLN Serial Serial Number"
                    fluid
                    className="mt-2"
                    style={{ width: '60%' }}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <div className="text-center">
                  <strong>Side PLN Serial SERIAL NUMBER</strong>
                </div>
                <CCol sm={12} className="d-flex justify-content-center">
                  <CFormInput
                    type="text"
                    id="sidePlnSerial"
                    name="sidePlnSerial"
                    value={formData.sidePlnSerial}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSidePLNSerial()
                      }
                    }}
                    ref={sidePlnRef}
                    required
                    disabled={sidePlnDisable}
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

export default SidePlnSerial
