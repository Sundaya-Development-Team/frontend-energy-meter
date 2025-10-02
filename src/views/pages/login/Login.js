import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { backendAuth } from '../../../api/axios'
import { useAuth } from '../../../context/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({ emailOrUsername: '', password: '' })
  const navigate = useNavigate()
  const { login } = useAuth()

  // Hapus localStorage setiap kali halaman login dibuka
  useEffect(() => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('expiresIn')
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await backendAuth.post('/login', {
        emailOrUsername: formData.emailOrUsername, // bisa email atau username
        password: formData.password,
      })

      if (res.data.success) {
        const { user, token, expiresIn } = res.data.data
        login({ user, token })
        localStorage.setItem('expiresIn', expiresIn)
        navigate('/dashboard')
      } else {
        alert(res.data.message || 'Login gagal')
      }
    } catch (err) {
      console.error(err)
      alert('Login gagal, periksa kembali email/username dan password')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        type="text"
                        name="emailOrUsername"
                        placeholder="Email Or Username"
                        autoComplete="username"
                        value={formData.emailOrUsername}
                        onChange={handleChange}
                        required
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
