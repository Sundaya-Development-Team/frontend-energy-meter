/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
  CButton,
} from '@coreui/react'
import { backendReceiving } from '../../api/axios'
import { toast } from 'react-toastify'

const ReceivingDetail = () => {
  const { receivingHeaderId } = useParams()
  const [loading, setLoading] = useState(true)
  const [header, setHeader] = useState(null)
  const [stagingData, setStagingData] = useState(null)
  const [items, setItems] = useState([])

  const fetchDetail = async () => {
    setLoading(true)
    console.log('fetch detail : ', receivingHeaderId)
    try {
      const res = await backendReceiving.get(`/receiving-headers/${receivingHeaderId}`)

      const headerData = res.data.data
      setHeader(headerData)
      setItems(headerData?.receiving_items || [])
    } catch (error) {
      toast.error('Failed to fetch receiving detail')
    } finally {
      setLoading(false)
    }
  }

  const fetchStaging = async () => {
    setLoading(true)
    console.log('fetch detail : ', receivingHeaderId)
    try {
      const res = await backendReceiving.get(
        `/serial-staging/receiving-header/${receivingHeaderId}`,
      )

      const staging = res.data.data
      console.log('staging :', staging)
      // setStagingData(stagingData)
      // setItems(headerData?.receiving_items || [])
    } catch (error) {
      toast.error('Failed to fetch receiving Staging')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
    fetchStaging()
  }, [receivingHeaderId])

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '300px' }}
      >
        <CSpinner color="primary" size="lg" />
      </div>
    )
  }

  const handleScan = (item) => {
    console.log('Scan item:', item)
    // Tambahkan logika scan di sini (navigasi, popup, dsb.)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Receiving Detail - GR Number: {header?.gr_number}</strong>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>PO Number:</strong> {header?.purchase_order?.po_number || '-'}
            </p>
            <p>
              <strong>Batch:</strong> {header?.batch}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <CBadge
                color={
                  header?.status === 'completed'
                    ? 'success'
                    : header?.status === 'rejected'
                      ? 'danger'
                      : 'warning'
                }
              >
                {header?.status}
              </CBadge>
            </p>
            <p>
              <strong>Received Date:</strong>{' '}
              {header?.received_date ? new Date(header.received_date).toLocaleDateString() : '-'}
            </p>
            <p>
              <strong>Location:</strong> {header?.location}
            </p>

            <h5 className="mt-4">Receiving Items</h5>
            <CTable bordered responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>No</CTableHeaderCell>
                  <CTableHeaderCell>Product</CTableHeaderCell>
                  <CTableHeaderCell>Item Type</CTableHeaderCell>
                  <CTableHeaderCell>Qty</CTableHeaderCell>
                  <CTableHeaderCell>Serialized</CTableHeaderCell>
                  <CTableHeaderCell>Notes</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <CTableRow key={item.id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{item.product.data.name || '-'}</CTableDataCell>
                      <CTableDataCell>{item.item_type}</CTableDataCell>
                      <CTableDataCell>{item.quantity}</CTableDataCell>
                      <CTableDataCell>
                        {item.is_serialized ? (
                          <>
                            Yes{' '}
                            <CButton
                              size="sm"
                              color="primary"
                              className="ms-2"
                              onClick={() => handleScan(item)}
                            >
                              Scan
                            </CButton>
                          </>
                        ) : (
                          'No'
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{item.notes || '-'}</CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={6} className="text-center">
                      No items found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ReceivingDetail
