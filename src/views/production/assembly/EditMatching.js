import React, { useState, useEffect, useRef } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CRow } from '@coreui/react'
import { backendTracking , backendQc} from '../../../api/axios'
import { toast } from 'react-toastify'
import ImageContainer from '../../components/ImageContainer'
import ValidationPopup from '../../components/ValidationPopup'

const ScanBeforeAssembly = () => {
  const [formData, setFormData] = useState({
    pcbSnumb: '',
    sideCoverSnumb: '',
  })

  const [pcbDisabled, setPcbDisabled] = useState(false)
  const [sideCoverDisabled, setSideCoverDisabled] = useState(true)
  const [feedback, setFeedback] = useState(null) // error popup

  const pcbInputRef = useRef(null)
  const sideCoverInputRef = useRef(null)

  useEffect(() => {
    if (!pcbDisabled) {
      pcbInputRef.current?.focus()
    } else if (!sideCoverDisabled) {
      sideCoverInputRef.current?.focus()
    }
  }, [pcbDisabled, sideCoverDisabled])

  useEffect(() => {
    if (!feedback) {
      return
    }

    const timer = setTimeout(() => {
      setFeedback(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [feedback])

  const resetForm = () => {
    setFormData({ pcbSnumb: '', sideCoverSnumb: '' })
    setPcbDisabled(false)
    setSideCoverDisabled(true)
    setFeedback(null)
    setTimeout(() => pcbInputRef.current?.focus(), 100)
  }

  const handlePcbSnumb = async () => {
    // setiap kali scan baru, bersihkan popup lama
    setFeedback(null)
    const currentSerial = formData.pcbSnumb?.trim()

    if (!currentSerial) {
      setFeedback({
        title: 'PCB serial cannot be empty',
        message: 'Enter or scan the PCB serial number first.',
        serialNumber: currentSerial,
      })
      return
    }

    try {
      const validateResponse = await backendQc.get('/validation', {
        params: {
          serial_number: currentSerial,
          qc_id: 'QC-PSB001',
        },
      })

      const { valid, mode, message } = validateResponse.data

      // 🟥 Mode blocked-fail → tampilkan message, TIDAK boleh lanjut
      if (!valid && mode === 'blocked-fail') {
        setFeedback({
          title: 'PCB Blocked (Failed QC)',
          message: message || 'PCB ini sudah gagal QC dan diblok untuk proses assembly.',
          serialNumber: currentSerial,
        })
        return
      }

      // 🟥 Mode special-qc → tampilkan message, TIDAK boleh lanjut
      if (valid && mode === 'special-qc') {
        setFeedback({
          title: 'PCB Perlu Burning Software',
          message: 'PCB ini perlu burning software terlebih dahulu.',
          serialNumber: currentSerial,
        })
        return
      }

      // ✅ Mode already-passed → BOLEH lanjut tanpa popup
      if (!valid && mode === 'already-passed') {
        // pastikan popup tidak tampil
        setFeedback(null)
        setPcbDisabled(true)
        setSideCoverDisabled(false)
        toast.success(validateResponse.data.message || 'PCB Serial Number is valid!')
        
      }

      // Jika valid dan tidak ada mode khusus → boleh lanjut
      // setFeedback(null)
      // setPcbDisabled(true)
      // setSideCoverDisabled(false)
      // toast.success(message || 'PCB Serial Number is valid!')
    } catch (error) {
      console.log('masuk catch', error)
   
      const respData = error.response?.data
      const { valid, mode, message } =respData
      // Jika backend kirim already-passed lewat response error (non-2xx),
      // tetap perlakukan sebagai BOLEH lanjut.
      if (!valid && mode === 'already-passed') {
        setFeedback(null)
        setPcbDisabled(true)
        setSideCoverDisabled(false)
        return
      }

      // Jika backend kirim blocked-fail via error
      if (!valid && mode === 'blocked-fail') {
        setFeedback({
          title: 'PCB Blocked (Failed QC)',
          message: message || 'PCB ini sudah gagal QC dan diblok untuk proses assembly.',
          serialNumber: currentSerial,
        })
        return
      }

      // Jika backend kirim special-qc via error
      if (valid && mode === 'special-qc') {
        setFeedback({
          title: 'PCB Perlu Burning Software',
          message: 'PCB ini perlu burning software terlebih dahulu.',
          serialNumber: currentSerial,
        })
        return
      }

      // Fallback generic error
      setFeedback({
        title: 'PCB Validation Error',
        message: message || error.message || 'PCB validation failed!',
        serialNumber: currentSerial,
      })
    }
    
  }

  const handleSideCover = async () => {
    if (!formData.pcbSnumb || !formData.sideCoverSnumb) {
      setFeedback({
        title: 'Serial Number cannot be empty',
        message: 'Make sure PCB and Assembly serial have been scanned.',
        serialNumber: formData.sideCoverSnumb,
      })
      return
    }

    const currentSerial = formData.sideCoverSnumb?.trim()
    if (!currentSerial) {
      setFeedback({
        title: 'Assembly Serial cannot be empty',
        message: 'Enter or scan the Assembly serial number.',
      })
      return
    }

    try {
      const assemblyResponse = await backendQc.get('/validation', {
        params: {
          serial_number: currentSerial,
          qc_id: 'QC-AT003',
        },
      })

      const { valid, message } = assemblyResponse.data

      if (!valid) {
        setFeedback({
          title: 'Assembly Validation Failed',
          message: message || 'Assembly Serial Number is invalid!',
          serialNumber: currentSerial,
        })
        return
      }

      console.log('Lanjut')
      // const payload = {
      //   parent_serial_number: currentSerial,
      //   component_serial_number: formData.pcbSnumb,
      //   quantity: 1,
      // }

      // const res = await backendTracking.post('/assembly-components/by-serial', payload)
      // const isSuccess = res.data?.success

      // if (isSuccess === false) {
      
      //   const errorMessage = res.data?.message || 'Matching failed! Please try again.'
      //   setFeedback({
      //     title: 'Matching Failed',
      //     message: errorMessage,
      //     serialNumber: currentSerial,
      //   })
      //   toast.error(errorMessage)
      //   resetForm()
      //   return
      // }

      // setFeedback(null)
      // toast.success(res.data?.message || 'Matching Successful! Data saved successfully!')
      // resetForm()
    } catch (error) {
      console.log('error nih')
      setFeedback({
        title: 'Assembly Error',
        message: error.response?.data?.message || 'Failed to validate or submit data!',
        serialNumber: currentSerial,
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <>
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
                      src="/images/assembly/pcb_serial_number.jpeg"
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
              <strong>Assembly Serial Number</strong>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CRow className="mb-3">
                  <CCol sm={12}>
                    <ImageContainer
                      src="/images/assembly/assembly_serial_no_pcb.jpeg"
                      alt="Side Cover Preview"
                      height="300px"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3 text-center">
                  <strong>SCAN Assembly SERIAL NUMBER</strong>
                  <CCol sm={12} className="d-flex justify-content-center mt-2">
                    <CFormInput
                      type="text"
                      id="sideCoverSnumb"
                      name="sideCoverSnumb"
                      value={formData.sideCoverSnumb}
                      onChange={handleChange}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && (e.preventDefault(), handleSideCover())
                      }
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

      <ValidationPopup
        visible={!!feedback}
        type="error"
        title={feedback?.title}
        serialNumber={feedback?.serialNumber}
        message={feedback?.message}
        onClose={resetForm}
      />
    </>
  )
}

export default ScanBeforeAssembly
