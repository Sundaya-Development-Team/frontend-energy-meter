/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { backendQualityService } from '../../api/axios'

const listQuestions1 = [
  {
    id: 1,
    title: 'Visual Inspection',
    questions: [
      { id: 1, question: 'Tidak ada cacat fisik ?' },
      { id: 2, question: 'Terdapat label ?' },
      { id: 3, question: 'Tidak ada karat ?' },
    ],
  },
  {
    id: 2,
    title: 'Uji Fungsi',
    questions: [{ id: 4, question: 'Produk menyala pada alat tes ON' }],
  },
  {
    id: 3,
    title: 'Uji Komunikasi',
    questions: [{ id: 5, question: 'Dapat mengirimkan data saat request' }],
  },
]
const listQuestions2 = [
  {
    id: 1,
    title: 'Visual Inspection',
    active: true,
    description: 'this form for visual instpection',
    createdAt: '2025-06-26T04:00:37.257Z',
    updatedAt: '2025-06-26T04:00:37.257Z',
    criteria: {
      id: 1,
      threshold: 80,
      description: 'this criteria for pass or fail',
      headerId: 1,
      createdAt: '2025-06-26T04:11:31.070Z',
      updatedAt: '2025-06-26T04:11:31.070Z',
    },
    questions: [
      {
        id: 1,
        question: 'Tidak ada cacat fisik ?',
        active: true,
        correctAnswer: true,
        placeHolder: 'this is place holder',
        description: 'this is description question',
        headerId: 1,
        createdAt: '2025-06-26T04:18:50.836Z',
        updatedAt: '2025-06-26T04:18:50.836Z',
      },
      {
        id: 2,
        question: 'Terdapat label ?',
        active: true,
        correctAnswer: true,
        placeHolder: 'this is place holder',
        description: 'this is description question',
        headerId: 1,
        createdAt: '2025-06-26T04:19:06.470Z',
        updatedAt: '2025-06-26T04:19:06.470Z',
      },
      {
        id: 3,
        question: 'Tidak ada karat ?',
        active: true,
        correctAnswer: true,
        placeHolder: 'this is place holder',
        description: 'this is description question',
        headerId: 1,
        createdAt: '2025-06-26T04:19:18.968Z',
        updatedAt: '2025-06-26T04:19:18.968Z',
      },
    ],
  },
]
const QCUnits = () => {
  const [questionData, setQuestionData] = useState([])
  const [formData, setFormData] = useState({
    partner_barcode: '',
    qc_name: 'QC Semi Products',
    inspected_by: '',
    // sampleQty: 10,
    // totalQty: 100,
    answers: {}, // jawaban untuk pertanyaan dinamis
  })

  const handleChange = (e) => {
    const { name, value, type } = e.target

    let parsedValue = value
    if (type === 'radio' && (value === 'true' || value === 'false')) {
      parsedValue = value === 'true'
    }

    if (name.startsWith('question-')) {
      const questionId = name.replace('question-', '')
      setFormData((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: parsedValue,
        },
      }))
    } else {
      // Untuk input biasa seperti barcode
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const res = backendQualityService.post(
      '/v1/api/quality-service/qc-semi-product/submit',
      formData,
    )
    alert(`${res.data?.message}`)
    console.log('QC Result:', res)
    // await backendUploadFile.post()
    // alert('Form submitted. Check console for data.')
  }

  const getQuestions = async () => {
    console.log('Getting questions data')
    try {
      const resQuestion = await backendQualityService.get('/v1/api/quality-service/questions')
      const data = resQuestion.data
      setQuestionData(data.data)

      // setQuestionData(data)
    } catch (error) {
      console.log('Error fetching question data', error)
    }
  }

  useEffect(() => {
    console.log('Component rendered')
    getQuestions()
    // console.log("formData berubah:", formData);
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Quality Control Semi Product</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {/* Barcode */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="partner_barcode" className="col-sm-2 col-form-label">
                  Barcode
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="text"
                    id="partner_barcode"
                    name="partner_barcode"
                    value={formData.partner_barcode}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              {/* Inspector */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="inspected_by" className="col-sm-2 col-form-label">
                  Inspector
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="text"
                    id="inspected_by"
                    name="inspected_by"
                    value={formData.inspected_by}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              {/* Sample Qty */}
              {/* <CRow className="mb-3">
                <CFormLabel htmlFor="sampleQty" className="col-sm-2 col-form-label">
                  Sample Quantity
                </CFormLabel>
                <CCol sm={10}>
                  <CInputGroup>
                    <CFormInput type="number" id="sampleQty" value={formData.sampleQty} readOnly />
                    <CInputGroupText>of</CInputGroupText>
                    <CFormInput type="number" value={formData.totalQty} readOnly />
                  </CInputGroup>
                </CCol>
              </CRow> */}

              {/* Dynamic Questions */}
              {questionData.length === 0 ? (
                <p className="text-muted">Pertanyaan belum tersedia...</p>
              ) : (
                questionData.map((section) => (
                  <div key={section.id}>
                    <CFormLabel className="col-form-label mt-3">
                      <strong>{section.title}</strong>
                    </CFormLabel>
                    {section.questions.map((q) => (
                      <CRow className="mb-3" key={q.id}>
                        <CCol sm={12}>
                          <div className="border rounded p-3">
                            <CFormLabel className="col-form-label">{q.question}</CFormLabel>
                            <div className="d-flex justify-content-end gap-3">
                              <CFormCheck
                                inline
                                type="radio"
                                name={`question-${q.id}`}
                                value="true"
                                label="Ya"
                                checked={formData.answers[q.id] === true}
                                onChange={handleChange}
                              />
                              <CFormCheck
                                inline
                                type="radio"
                                name={`question-${q.id}`}
                                value="false"
                                label="Tidak"
                                checked={formData.answers[q.id] === false}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </CCol>
                      </CRow>
                    ))}
                  </div>
                ))
              )}

              {/* Submit */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="primary" type="submit">
                  Submit
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default QCUnits
