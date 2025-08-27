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
  CFormTextarea,
} from '@coreui/react'
import { backendAssembly } from '../../api/axios'
import { toast } from 'react-toastify'

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
  const [formData, setFormData] = useState({
    notes: '',
  })

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

    setFormData((prev) => ({
      ...prev,
      status: order?.status || '', // isi default dari order yg dipilih
      notes: '', // reset notes tiap ganti order
    }))
  }
  const handleInput = (e) => {
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) || 0 : value,
    }))

    //jika ingin checklist aktif berdasarkan select status
    // setSelectedOrder((prev) => ({
    //   ...prev,
    //   [name]: type === 'number' ? Number(value) || 0 : value,
    // }))
  }

  const handleOrderConfirmation = async () => {
    try {
      if (!selectedOrder) return

      const payload = {
        assembly_order_id: selectedOrder.id,
        status: formData.status, // 🔥 ambil dari formData
        confirmed_by: 1, // bisa diganti user login
        note: formData.notes || '', // 🔥 ambil dari formData
      }

      const response = await backendAssembly.post('/assembly-order-confirmations', payload)
      if (response.data.success === true) {
        // Update state biar UI langsung ikut berubah
        setSelectedOrder((prev) => ({
          ...prev,
          status: 'in_progress',
        }))

        toast.success(response.data?.message || 'SUCCESS')
      } else {
        toast.error('FAILED CONFIRM ORDER!!')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'FAILED TO ORDER CONFRIMATION')
    }
  }

  const handleSubmit = async () => {
    try {
      if (!selectedOrder) return

      // ambil item yg dicentang
      const confirmations = Object.entries(selectedItems)
        .filter(([_, item]) => item.checked && item.qty > 0) // cuma yg dipilih
        .map(([id, item]) => {
          const orderItem = selectedOrder.assembly_order_items.find((i) => i.id === Number(id))
          return {
            request_order_item_id: orderItem.id,
            product_id: orderItem.product_id,
            qty_confirmed: item.qty,
            note: formData.notes || '',
          }
        })

      const payload = {
        assembly_order_id: selectedOrder.id,
        confirmed_by: 123, // ganti id user login
        confirmations,
      }

      console.log('payload : ', payload)

      const response = await backendAssembly.post(
        '/assembly-order-items-confirmations/batch',
        payload,
      )

      if (response.data.success) {
        toast.success(response.data?.message || 'SUCCESS CONFIRM ORDER')
        setSelectedOrder((prev) => ({
          ...prev,
          status: 'in_progress',
        }))
      } else {
        toast.error('FAILED CONFIRM ORDER!!')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'FAILED TO CONFIRM ORDER')
    }
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

            <FormRow label="Status">
              <CFormSelect
                name="status"
                value={formData.status}
                onChange={handleInput}
                disabled={!selectedOrder}
              >
                <option value="">-- Select Status --</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="failed">Reject</option>
              </CFormSelect>
            </FormRow>

            <FormRow label="Notes">
              <CFormTextarea
                type="text"
                name="notes"
                rows={3}
                placeholder="Enter notes here"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notes: e.target.value,
                  })
                }
                disabled={!selectedOrder || formData.status !== 'pending'}
              />
            </FormRow>

            {/* Tombol tambahan sebelum Order Details */}
            <div className="d-flex justify-content-end mt-3">
              {selectedOrder?.status === 'pending' && (
                <div>
                  <CButton
                    color="success"
                    className="me-2 text-white"
                    onClick={handleOrderConfirmation}
                  >
                    Order Confirmation
                  </CButton>
                </div>
              )}
            </div>

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
                              disabled={
                                selectedOrder.status === 'pending' ||
                                selectedOrder.status === 'failed' ||
                                remaining === 0
                              }
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
                              disabled={
                                !selectedItems[item.id]?.checked ||
                                selectedOrder.status === 'pending' ||
                                selectedOrder.status === 'failed' ||
                                remaining === 0
                              }
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
                {selectedOrder &&
                  selectedOrder.status !== 'pending' &&
                  selectedOrder.status !== 'failed' && (
                    <CButton color="primary" onClick={handleSubmit}>
                      Submit Confirmation
                    </CButton>
                  )}
              </div>
            </div>
          </>
        )}
      </CCardBody>
    </CCard>
  )
}

export default AssemblyOrders
