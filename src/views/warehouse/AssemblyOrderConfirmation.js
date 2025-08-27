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
import { backendAssembly, backendWh } from '../../api/axios'
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
  const [stockData, setStockData] = useState({})
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

  // const handleOrderChange = (e) => {
  //   const orderId = e.target.value
  //   const order = orders.find((o) => o.id === Number(orderId))

  //   setSelectedOrder(order || null)

  //   setFormData((prev) => ({
  //     ...prev,
  //     status: order?.status || '', // isi default dari order yg dipilih
  //     notes: '', // reset notes tiap ganti order
  //   }))
  // }

  // const handleOrderChange = async (e) => {
  //   const orderId = e.target.value
  //   const order = orders.find((o) => o.id === Number(orderId))
  //   setSelectedOrder(order || null)
  //   setSelectedItems({})

  //   setFormData((prev) => ({
  //     ...prev,
  //     status: order?.status || '', // isi default dari order yg dipilih
  //     notes: '', // reset notes tiap ganti order
  //   }))

  //   if (order && order.assembly_order_items?.length > 0) {
  //     const productIds = order.assembly_order_items.map((i) => i.product_id)

  //     try {
  //       const res = await backendWh.post('/stock-units/stock-by-multiple-products', {
  //         product_ids: productIds,
  //         warehouse_id: 1, // ganti sesuai warehouse kamu
  //         include_zero_stock: true,
  //       })

  //       if (res.data.success) {
  //         const map = {}
  //         res.data.data.stock_by_product.forEach((s) => {
  //           map[s.product_id] = s.total_quantity
  //         })
  //         setStockData(map)
  //       }
  //     } catch (err) {
  //       console.error('Failed fetch stock', err)
  //     }
  //   } else {
  //     setStockData({})
  //   }
  // }

  // Fungsi reusable untuk fetch order & stock
  const fetchOrderData = async (orderId) => {
    const order = orders.find((o) => o.id === Number(orderId))
    setSelectedOrder(order || null)
    setSelectedItems({})

    setFormData((prev) => ({
      ...prev,
      status: order?.status || '',
      notes: '',
    }))

    if (order && order.assembly_order_items?.length > 0) {
      const productIds = order.assembly_order_items.map((i) => i.product_id)

      try {
        const res = await backendWh.post('/stock-units/stock-by-multiple-products', {
          product_ids: productIds,
          warehouse_id: 1, // sesuaikan warehouse
          include_zero_stock: true,
        })

        if (res.data.success) {
          const map = {}
          res.data.data.stock_by_product.forEach((s) => {
            map[s.product_id] = s.total_quantity
          })
          setStockData(map)
        }
      } catch (err) {
        console.error('Failed fetch stock', err)
      }
    } else {
      setStockData({})
    }
  }

  // Untuk dipanggil di onChange select
  const handleOrderChange = (e) => {
    fetchOrderData(e.target.value)
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

      const confirmations = Object.entries(selectedItems)
        .filter(([_, item]) => item.checked && item.qty > 0)
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
        confirmed_by: 1, // ganti id user login
        confirmations,
      }

      const response = await backendAssembly.post(
        '/assembly-order-items-confirmations/batch',
        payload,
      )

      if (response.data.success) {
        toast.success(response.data?.message || 'SUCCESS CONFIRM ORDER')

        if (selectedOrder?.id) {
          try {
            const res = await backendAssembly.get(`/assembly-orders/${selectedOrder.id}`)
            if (res.data.success) {
              const updatedOrder = res.data.data
              setSelectedOrder(updatedOrder) // update full order
              setSelectedItems({}) // reset selection
              // update stock
              const productIds = updatedOrder.assembly_order_items.map((i) => i.product_id)
              const stockRes = await backendWh.post('/stock-units/stock-by-multiple-products', {
                product_ids: productIds,
                warehouse_id: 1,
                include_zero_stock: true,
              })
              const map = {}
              stockRes.data.data.stock_by_product.forEach((s) => {
                map[s.product_id] = s.total_quantity
              })
              setStockData(map)
            }
          } catch (err) {
            console.error('Failed to refresh order', err)
          }
        }
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
                <option value="partial">Partial</option>
                <option value="completed">Completed</option>
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
                    <CTableHeaderCell>Stock</CTableHeaderCell>
                    <CTableHeaderCell>Confirm Qty</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {!selectedOrder ? (
                    <CTableRow>
                      <CTableDataCell colSpan={7} className="text-center text-muted">
                        Order not selected
                      </CTableDataCell>
                    </CTableRow>
                  ) : selectedOrder.assembly_order_items?.length > 0 ? (
                    [...selectedOrder.assembly_order_items]
                      .sort((a, b) => a.product_name.localeCompare(b.product_name))
                      .map((item) => {
                        const remaining = item.qty_remaining
                        const stock = stockData[item.product_id] ?? '-'
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
                                  remaining === 0 ||
                                  stock < remaining
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
                              {item.qty_remaining}
                            </CTableDataCell>

                            {/* Remaining */}
                            <CTableDataCell className="text-danger fw-semibold">
                              {remaining}
                            </CTableDataCell>

                            {/* Stock */}
                            <CTableDataCell className="fw-semibold">{stock}</CTableDataCell>

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
                                  remaining === 0 ||
                                  stock < remaining
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
                      <CTableDataCell colSpan={7} className="text-center text-muted">
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
