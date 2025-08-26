/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CFormTextarea,
} from '@coreui/react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { backendProduct, backendAssembly } from '../../../api/axios'

const OrderForm = () => {
  const [productsData, setProductsData] = useState([])
  const [selectedParent, setSelectedParent] = useState(null)
  const [formData, setFormData] = useState({
    product_id: '',
    qty: 1,
    order_number: '',
    items: [], // array of selected component IDs
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await backendProduct.get('/parents')
        setProductsData(res.data.data || [])
      } catch (err) {
        console.error('Fetch product error:', err)
      }
    }

    fetchProducts()
  }, [])

  const getOptionLabel = (p) => `${p.sap_code} - ${p.name}`

  // Handle pilih product → simpan parent & reset items
  const handleSelectProduct = (opt) => {
    const parent = productsData.find((p) => p.id === opt?.value)
    setSelectedParent(parent || null)
    setFormData((prev) => ({
      ...prev,
      product_id: opt ? opt.value : '',
      items: [], // reset pilihan item ketika ganti parent
    }))
  }

  // Checklist item (berdasarkan component.id)
  const toggleItem = (componentId) => {
    setFormData((prev) => {
      const exists = prev.items.includes(componentId)
      return {
        ...prev,
        items: exists ? prev.items.filter((i) => i !== componentId) : [...prev.items, componentId],
      }
    })
  }
  const handleInput = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.product_id || formData.qty <= 0 || !formData.order_number) {
        toast.warn('Please fill all fields correctly.')
        setLoading(false)
        return
      }

      if (!selectedParent) {
        toast.warn('Please select a product.')
        setLoading(false)
        return
      }

      if (formData.items.length === 0) {
        toast.warn('Please select at least one item.')
        setLoading(false)
        return
      }

      // Build items payload dari parentOf + perkalian qty utama
      const itemsPayload = (selectedParent.components || [])
        .filter((c) => formData.items.includes(c.component.id))
        .map((c) => ({
          product_id: c.component.id,
          qty_request: (Number(c.quantity) || 0) * Number(formData.qty),
        }))

      const payload = {
        order_number: formData.order_number,
        product_id: formData.product_id,

        qty: Number(formData.qty),

        status: 'pending',
        request_by: 1,
        notes: formData.notes || '', // biar gak undefined
        assembly_order_items: itemsPayload,
      }

      console.log('Payload:', payload)

      // contoh call API
      const res = await backendAssembly.post('/assembly-orders/with-items', payload)

      // toast.success(res.data.message || 'Order submitted successfully!')
    } catch (err) {
      console.error('Submit error:', err)
      toast.error(err.response?.data?.message || 'Failed to submit order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol md={12} className="mx-auto">
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Order</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {/* AO/PO */}
              <FormRow label="AO/PO">
                <CFormInput
                  type="text"
                  value={formData.order_number}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, order_number: e.target.value }))
                  }
                  required
                />
              </FormRow>

              {/* Product */}
              <FormRow label="Product">
                <Select
                  options={productsData.map((p) => ({ value: p.id, label: getOptionLabel(p) }))}
                  value={
                    formData.product_id
                      ? (() => {
                          const found = productsData.find((p) => p.id === formData.product_id)
                          return found ? { value: found.id, label: getOptionLabel(found) } : null
                        })()
                      : null
                  }
                  onChange={handleSelectProduct}
                  isClearable
                  placeholder="Select Product"
                />
              </FormRow>

              {/* Qty */}
              <FormRow label="Qty">
                <CFormInput
                  type="number"
                  min={1}
                  value={formData.qty}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, qty: Number(e.target.value) }))
                  }
                  required
                />
              </FormRow>

              <FormRow label="Notes">
                <CFormTextarea
                  rows={3}
                  name="notes"
                  onChange={handleInput}
                  value={formData.notes}
                  placeholder="Write any additional notes"
                />
              </FormRow>

              {/* Items - tabel dari parentOf (BOM) */}
              {/* Items - tabel dari parentOf (BOM) */}
              {selectedParent && selectedParent.components?.length > 0 && (
                <CRow className="mb-3">
                  <CCol md={12}>
                    <h5 className="mb-3">Items</h5>
                    <CTable striped bordered hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell scope="col">#</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Code</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                          <CTableHeaderCell scope="col">BOM Qty</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Total Qty</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Select</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {selectedParent.components.map((c, idx) => {
                          const checked = formData.items.includes(c.component.id)
                          const baseQty = Number(c.quantity) || 0
                          const totalQty = baseQty * Number(formData.qty || 0)
                          return (
                            <CTableRow key={c.component.id}>
                              <CTableHeaderCell scope="row">{idx + 1}</CTableHeaderCell>
                              <CTableDataCell>{c.component.sap_code}</CTableDataCell>
                              <CTableDataCell>{c.component.name}</CTableDataCell>
                              <CTableDataCell>{baseQty}</CTableDataCell>
                              <CTableDataCell>{totalQty}</CTableDataCell>
                              <CTableDataCell>
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleItem(c.component.id)}
                                />
                              </CTableDataCell>
                            </CTableRow>
                          )
                        })}
                      </CTableBody>
                    </CTable>
                  </CCol>
                </CRow>
              )}

              {/* Submit */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                <CButton color="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <CSpinner size="sm" /> Saving…
                    </>
                  ) : (
                    'Save'
                  )}
                </CButton>
              </div>
              {/* <div className="d-grid gap-2 mt-3">
                <CButton type="submit" color="primary">
                  Submit
                </CButton>
              </div> */}
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

export default OrderForm
