import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormSelect,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CButton,
} from '@coreui/react'
import { backendAssembly } from '../../api/axios'

const FormRow = ({ label, children }) => (
  <CRow className="mb-3 align-items-center">
    <CCol md={4}>
      <CFormLabel className="fw-semibold">{label}</CFormLabel>
    </CCol>
    <CCol md={8}>{children}</CCol>
  </CRow>
)

const AssemblyOrders = () => {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState({})

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await backendAssembly.get('/assembly-orders')
      setOrders(response.data.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderChange = (e) => {
    const orderId = e.target.value
    const order = orders.find((o) => o.id === Number(orderId))
    setSelectedOrder(order || null)
    setSelectedItems({})
  }

  const handleInput = (e) => {
    const { name, value } = e.target
    setSelectedOrder((prev) => ({
      ...prev,
      [name]: Number(value) || 0,
    }))
  }

  const handleSubmit = async () => {
    if (!selectedOrder) {
      alert('Please select an order first.')
      return
    }

    // Bentuk payload dari selectedItems
    const payload = {
      order_id: selectedOrder.id,
      items: Object.entries(selectedItems)
        .filter(([_, val]) => val.checked && val.qty > 0) // ambil hanya yang dipilih
        .map(([id, val]) => ({
          product_id: Number(id),
          quantity: val.qty,
        })),
    }
    console.log('Payload : ', payload)
    // if (payload.items.length === 0) {
    //   alert('Please select at least one item with quantity.')
    //   return
    // }

    // try {
    //   const response = await backendTracking.post('/confirmations', payload)
    //   console.log('Response:', response.data)
    //   alert('Confirmation submitted successfully!')
    //   // reset pilihan
    //   setSelectedItems({})
    // } catch (error) {
    //   console.error(error)
    //   alert('Failed to submit confirmation.')
    // }
  }

  return (
    <CCard>
      <CCardHeader>Assembly Order Confirmation</CCardHeader>
      <CCardBody>
        {loading ? (
          <CSpinner />
        ) : (
          <>
            {/* Dropdown pilih order */}
            <FormRow label="Assembly Order">
              <CFormSelect onChange={handleOrderChange}>
                <option value="">-- Select Order --</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.order_number}
                  </option>
                ))}
              </CFormSelect>
            </FormRow>

            <FormRow label="Product Name">
              <CFormInput
                type="text"
                placeholder=""
                name="product_name"
                min={1}
                value={selectedOrder?.product_name || ''}
                onChange={handleInput}
                disabled
              />
            </FormRow>

            <FormRow label="Quantity">
              <CFormInput
                type="number"
                placeholder=""
                name="quantity"
                min={1}
                value={selectedOrder?.quantity || ''}
                onChange={handleInput}
                disabled
              />
            </FormRow>

            {/* Detail order */}
            {/* Detail order */}
            <div className="mt-4">
              <h6 className="fw-bold mb-3">Order Details</h6>
              <CTable
                bordered
                striped
                hover
                responsive
                small
                align="middle"
                className="text-center"
              >
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-start ps-3">Select</CTableHeaderCell>
                    <CTableHeaderCell className="text-start ps-3">Product Name</CTableHeaderCell>
                    <CTableHeaderCell>Qty Request</CTableHeaderCell>
                    <CTableHeaderCell>Confirmed</CTableHeaderCell>
                    <CTableHeaderCell>Remaining</CTableHeaderCell>
                    <CTableHeaderCell>Confirm Qty</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {!selectedOrder ? (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center text-muted">
                        Order not selected
                      </CTableDataCell>
                    </CTableRow>
                  ) : selectedOrder.assembly_order_items?.length > 0 ? (
                    selectedOrder.assembly_order_items.map((item) => {
                      const remaining = item.qty_request - item.qty_confirmed
                      return (
                        <CTableRow key={item.id}>
                          {/* Checkbox */}
                          <CTableDataCell>
                            <input
                              type="checkbox"
                              checked={!!selectedItems[item.id]?.checked}
                              onChange={(e) =>
                                setSelectedItems((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    ...prev[item.id],
                                    checked: e.target.checked,
                                    qty: e.target.checked ? prev[item.id]?.qty || 0 : 0,
                                  },
                                }))
                              }
                            />
                          </CTableDataCell>

                          {/* Product Name */}
                          <CTableDataCell className="fw-medium text-start ps-3">
                            {item.product_name}
                          </CTableDataCell>

                          {/* Qty Request */}
                          <CTableDataCell>{item.qty_request}</CTableDataCell>

                          {/* Qty Confirmed */}
                          <CTableDataCell className="text-success fw-semibold">
                            {item.qty_confirmed}
                          </CTableDataCell>

                          {/* Remaining */}
                          <CTableDataCell className="text-danger fw-semibold">
                            {remaining}
                          </CTableDataCell>

                          {/* Input Confirm Qty */}
                          <CTableDataCell>
                            <input
                              type="number"
                              className="form-control text-center"
                              min={0}
                              max={remaining}
                              value={selectedItems[item.id]?.qty || ''}
                              disabled={!selectedItems[item.id]?.checked}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '')
                                value = Number(value)
                                if (value > remaining) value = remaining
                                if (value < 0) value = 0
                                setSelectedItems((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    ...prev[item.id],
                                    checked: true,
                                    qty: value,
                                  },
                                }))
                              }}
                            />
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center text-muted">
                        No data available
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              {/* Tombol submit */}
              <div className="d-flex justify-content-end mt-3">
                <CButton
                  color="primary"
                  disabled={!selectedOrder} // tombol disable kalau belum pilih order
                  onClick={handleSubmit}
                >
                  Submit Confirmation
                </CButton>
              </div>
            </div>
          </>
        )}
      </CCardBody>
    </CCard>
  )
}

export default AssemblyOrders
