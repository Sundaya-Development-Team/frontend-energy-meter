/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CModal,
  CModalBody,
} from '@coreui/react'
import Select from 'react-select'
import { backendProduct, backendReceiving } from '../../api/axios'

const fetchMasters = () =>
  backendProduct.get('/', {
    params: {
      page: 1,
      limit: 100,
      search: '',
      sortBy: 'name',
      sortOrder: 'asc',
      include_details: true,
      include_categories: true,
      include_components: true,
    },
  })

const fetchPOs = () =>
  backendReceiving.get('/purchase-orders', {
    params: {
      page: 1,
      limit: 100,
    },
  })

const ReceivingHeader = () => {
  const [productsData, setProductsData] = useState([])
  const [poOptions, setPoOptions] = useState([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    reference_po: '',
    reference_gr: '',
    notes: '',
    receiving_date: '',
    receiving_batch: '',
    details: [],
  })

  // modal handler
  const [showModal, setShowModal] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)

  // responsive flag
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 500)
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 500)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const todayJakarta = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Jakarta',
    })
    setFormData((prev) => ({ ...prev, receiving_date: todayJakarta }))

    fetchMasters()
      .then((res) => setProductsData(res.data.data))
      .catch((err) => console.error('Fetch masters error:', err))

    fetchPOs()
      .then((res) => {
        const options = res.data.data.map((po) => ({
          value: po.id,
          label: po.po_number,
        }))
        setPoOptions(options)
      })
      .catch((err) => console.error('Fetch POs error:', err))
  }, [])

  const handleInput = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        {
          sap_code: '',
          name: '',
          product_id: '',
          product_type: '',
          ref_quantity: '',
          serialize: false,
        },
      ],
    }))
  }

  const handleDetailChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.details]
      const item = updated[index]

      if (field === 'sap_code') {
        const selected = productsData.find((p) => p.sap_code === value)
        item.sap_code = value
        item.name = selected?.name || ''
        item.product_id = selected?.id || ''
        item.product_type = selected?.type?.name || ''
        item.serialize = selected?.is_serialize ?? false
      } else if (field === 'ref_quantity') {
        item[field] = Number(value)
      } else {
        item[field] = value
      }

      return { ...prev, details: updated }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (!formData.reference_po) {
        alert('Reference PO is required.')
        return
      }

      if (formData.details.length === 0) {
        alert('Please add at least one product.')
        return
      }

      const hasMissingProduct = formData.details.some(
        (d) => !d.product_id || !d.ref_quantity || d.ref_quantity <= 0,
      )

      if (hasMissingProduct) {
        alert('Ensure each product is selected and quantity is more than 0.')
        return
      }

      setLoading(true)

      const payload = {
        purchase_orders_id: formData.reference_po,
        gr_number: formData.reference_gr,
        notes: formData.notes,
        received_date: formData.receiving_date,
        received_by: 5,
        batch: `BATCH-${String(formData.receiving_batch).padStart(3, '0')}`,
        location: 'Receiving Area',
        receiving_items: formData.details.map((d) => ({
          product_id: d.product_id,
          is_serialized: d.serialize,
          quantity: Number(d.ref_quantity),
          item_type: d.product_type,
          notes: d.notes || '',
        })),
      }

      const response = await backendReceiving.post('/receiving-headers', payload)

      const message =
        response?.data?.message || 'Failed to submit Receiving. See console for details.'

      toast.success(message)

      const todayJakarta = new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Jakarta',
      })
      setFormData({
        reference_po: '',
        reference_gr: '',
        notes: '',
        receiving_date: todayJakarta,
        receiving_batch: '',
        details: [],
      })
    } catch (err) {
      console.error('Submit error:', err)
      const errorMessage =
        err.response?.data?.message || 'Failed to submit PO. See console for details.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol md={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Receiving (Pra-SCAN Item)</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <FormRow label="Reference PO">
                <Select
                  options={poOptions}
                  value={poOptions.find((opt) => opt.value === formData.reference_po) || null}
                  onChange={(opt) =>
                    setFormData((prev) => ({ ...prev, reference_po: opt ? opt.value : '' }))
                  }
                  isClearable
                  placeholder="Select PO"
                />
              </FormRow>

              <FormRow label="Reference GR">
                <CFormInput
                  name="reference_gr"
                  value={formData.reference_gr}
                  onChange={handleInput}
                />
              </FormRow>

              <FormRow label="Receiving Date">
                <CFormInput
                  type="date"
                  name="receiving_date"
                  value={formData.receiving_date}
                  onChange={handleInput}
                  required
                />
              </FormRow>

              <FormRow label="Receiving Batch">
                <CFormInput
                  type="text"
                  name="receiving_batch"
                  value={formData.receiving_batch}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    setFormData((prev) => ({ ...prev, receiving_batch: value }))
                  }}
                  required
                />
              </FormRow>

              <FormRow label="Note">
                <CFormTextarea
                  rows={3}
                  name="notes"
                  value={formData.notes}
                  onChange={handleInput}
                />
              </FormRow>

              <CFormLabel className="fw-bold mt-3">List of Product</CFormLabel>
              <br />
              <CButton color="primary" type="button" onClick={addProduct} className="mb-2">
                + Add Product
              </CButton>

              {!isSmallScreen ? (
                // TABLE VIEW for Desktop / Tablet
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>SAP Code</th>
                      <th>Product Type</th>
                      <th>Serialize</th>
                      <th>Order Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.details.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td style={{ minWidth: '180px' }}>
                          <Select
                            options={productsData.map((p) => ({
                              value: p.sap_code,
                              label: `${p.sap_code} - ${p.name}`,
                            }))}
                            value={
                              item.sap_code
                                ? { value: item.sap_code, label: `${item.sap_code} - ${item.name}` }
                                : null
                            }
                            onChange={(opt) =>
                              handleDetailChange(index, 'sap_code', opt ? opt.value : '')
                            }
                            isClearable
                            styles={{
                              container: (base) => ({ ...base, width: '100%' }),
                              menu: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                          />
                        </td>
                        <td>
                          <CFormInput value={item.product_type ?? ''} readOnly />
                        </td>
                        <td>
                          <CFormInput value={item.serialize ? 'True' : 'False'} readOnly />
                        </td>
                        <td>
                          <CFormInput
                            type="number"
                            min={0}
                            value={item.ref_quantity ?? ''}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value))
                              handleDetailChange(index, 'ref_quantity', val)
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                // CARD VIEW for Mobile
                <div className="d-flex flex-column gap-3">
                  {formData.details.map((item, index) => (
                    <CCard key={index} className="p-2 shadow-sm">
                      <p className="fw-bold mb-1">Product #{index + 1}</p>
                      <CButton
                        color="light"
                        className="w-100 text-start mb-2"
                        onClick={() => {
                          setActiveIndex(index)
                          setShowModal(true)
                        }}
                      >
                        {item.sap_code ? `${item.sap_code} - ${item.name}` : 'Select Product'}
                      </CButton>
                      <CFormInput
                        className="mb-2"
                        value={item.product_type ?? ''}
                        readOnly
                        placeholder="Product Type"
                      />
                      <CFormInput
                        className="mb-2"
                        value={item.serialize ? 'True' : 'False'}
                        readOnly
                        placeholder="Serialize"
                      />
                      <CFormInput
                        type="number"
                        min={0}
                        value={item.ref_quantity ?? ''}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value))
                          handleDetailChange(index, 'ref_quantity', val)
                        }}
                        placeholder="Order Qty"
                      />
                    </CCard>
                  ))}
                </div>
              )}

              {/* Modal khusus mobile */}
              <CModal visible={showModal} onClose={() => setShowModal(false)} alignment="center">
                <CModalBody>
                  <Select
                    autoFocus
                    options={productsData.map((p) => ({
                      value: p.sap_code,
                      label: `${p.sap_code} - ${p.name}`,
                    }))}
                    value={
                      activeIndex !== null && formData.details[activeIndex]?.sap_code
                        ? {
                            value: formData.details[activeIndex].sap_code,
                            label: `${formData.details[activeIndex].sap_code} - ${formData.details[activeIndex].name}`,
                          }
                        : null
                    }
                    onChange={(opt) => {
                      if (activeIndex !== null) {
                        handleDetailChange(activeIndex, 'sap_code', opt ? opt.value : '')
                      }
                      setShowModal(false)
                    }}
                    isClearable
                  />
                </CModalBody>
              </CModal>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                <CButton color="primary" type="submit" disabled={loading}>
                  {loading ? 'Saving…' : 'Save'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

const FormRow = ({ label, children }) => (
  <CRow className="mb-3">
    <CFormLabel className="col-sm-3 col-form-label">{label}</CFormLabel>
    <CCol sm={9}>{children}</CCol>
  </CRow>
)

export default ReceivingHeader
