import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCollapse,
  CListGroup,
  CListGroupItem,
  CSpinner,
} from '@coreui/react'
import { backendTracking } from '../../api/axios'

const DashboardPLN = () => {
  const [orders, setOrders] = useState([])
  const [expanded, setExpanded] = useState({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await backendTracking.get('/pln-order-grouping', {
          params: { page, limit, order: 'desc' }, // ✅ pakai params di sini
        })

        if (res.data.success) {
          setOrders(res.data.data.pln_orders || [])
        }
      } catch (err) {
        console.error('Error fetching PLN orders:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, limit]) // refetch saat page/limit berubah

  const toggleExpand = (assemblyId) => {
    setExpanded((prev) => ({
      ...prev,
      [assemblyId]: !prev[assemblyId],
    }))
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div>
      {orders.length === 0 ? (
        <p className="text-center text-muted">No PLN Orders found</p>
      ) : (
        orders.map((order) => (
          <CCard key={order.pln_order_id} className="mb-3 shadow-sm">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>PLN_Order_id: {order.pln_order_id}</strong>
              <span className="badge bg-primary fs-6">{order.record_count}</span>
            </CCardHeader>
            <CCardBody>
              {order.assemblies.map((asm, idx) => (
                <div key={asm.assembly_id} className="mb-2">
                  <CButton
                    color="light"
                    className="d-flex justify-content-between align-items-center w-100"
                    onClick={() => toggleExpand(asm.assembly_id)}
                  >
                    {/* sementara */}
                    <span>Batch {idx + 1}</span>
                    {/* end sementara */}
                    <span className="badge bg-info">{asm.current_quantity}</span>
                  </CButton>

                  <CCollapse visible={expanded[asm.assembly_id]}>
                    <CListGroup>
                      {asm.qc_status_breakdown.map((qc) => (
                        <CListGroupItem key={qc.qc_id}>
                          {qc.qc_name} : <strong>{qc.count}</strong>
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                  </CCollapse>
                </div>
              ))}
            </CCardBody>
          </CCard>
        ))
      )}

      {/* 🔹 Pagination Control */}
      <div className="d-flex justify-content-between mt-3">
        <CButton disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </CButton>
        <span>Page {page}</span>
        <CButton onClick={() => setPage((p) => p + 1)}>Next</CButton>
      </div>
    </div>
  )
}

export default DashboardPLN
