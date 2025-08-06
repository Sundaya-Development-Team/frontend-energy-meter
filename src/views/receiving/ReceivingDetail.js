/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useMemo } from 'react'
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
  CFormInput,
  CPagination,
  CPaginationItem,
  CFormTextarea,
} from '@coreui/react'
import { backendReceiving } from '../../api/axios'
import { toast } from 'react-toastify'

// Komponen CounterCard
const CounterCard = ({ title, value }) => (
  <CCard className="mb-3">
    <CCardBody>
      <h6 className="text-muted">{title}</h6>
      <h4>{value}</h4>
    </CCardBody>
  </CCard>
)

// Komponen FormRow
const FormRow = ({ label, labelCols = '2', children }) => (
  <div className="mb-3 row">
    <label className={`col-sm-${labelCols} col-form-label`}>{label}</label>
    <div className={`col-sm-${12 - Number(labelCols)}`}>{children}</div>
  </div>
)

const ReceivingDetail = () => {
  const { receivingHeaderId } = useParams()
  const [loading, setLoading] = useState(true)
  const [header, setHeader] = useState(null)
  const [items, setItems] = useState([])

  const [scanningItem, setScanningItem] = useState(null)
  const [formData, setFormData] = useState({
    serialNumber: '',
    notes: '',
  })
  const [scannedQty, setScannedQty] = useState(0)
  const [trackedTotal, setTrackedTotal] = useState(0)
  const [isFormLocked, setIsFormLocked] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const fetchDetail = async () => {
    setLoading(true)
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

  // const fetchStaging = async () => {
  //   setLoading(true)
  //   try {
  //     await backendReceiving.get(`/serial-staging/receiving-header/${receivingHeaderId}`)
  //   } catch (error) {
  //     toast.error('Failed to fetch receiving Staging')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  useEffect(() => {
    fetchDetail()
    // fetchStaging()
  }, [receivingHeaderId])

  const handleScan = (item) => {
    fetchStagingItem(item)
  }

  const paginatedSerialNumbers = useMemo(() => {
    if (!scanningItem?.serialNumbers) return []

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return scanningItem.serialNumbers.slice(startIndex, endIndex)
  }, [scanningItem, currentPage])

  const fetchStagingItem = async (item) => {
    // setLoading(true)

    try {
      const stagingRes = await backendReceiving.get(`/serial-staging/receiving-item/${item.id}`)

      filterStageingItem(item, stagingRes)
    } catch (error) {
      toast.error('Failed to fetch Receiving Staging')
    } finally {
      // setLoading(false)
    }
  }

  const filterStageingItem = (item, stagingRes) => {
    console.log('item scan : ', item.id)

    const itemName = item.product.data.name
    const stagingSummary = stagingRes.data.data.staging_summary
    const receivingItem = stagingRes.data.data.receiving_item
    const serialNumbers = stagingRes.data.data.serial_numbers

    const combinedData = {
      //Receiving
      // Dari item hasil select button scan
      itemId: item.id,
      itemName: itemName,

      //Serial Staging
      // Dari staging summary
      totalStaged: stagingSummary.total_staged,
      expectedQuantity: stagingSummary.expected_quantity,
      remainingStage: stagingSummary.remaining_to_stage,
      stagingComplete: stagingSummary.staging_complete,

      // Dari receiving_item
      receivingItemId: receivingItem.id,
      receivingHeadersId: receivingItem.receiving_headers_id,
      productId: receivingItem.product_id,
      isSerialized: receivingItem.is_serialized,
      quantity: receivingItem.quantity,
      notes: receivingItem.notes,
      itemType: receivingItem.item_type,
      createdAt: receivingItem.created_at,
      updatedAt: receivingItem.updated_at,

      // Header info
      grNumber: receivingItem.receiving_header?.gr_number || null,
      referenceAO: receivingItem.receiving_header?.reference_ao || null,

      // Tambahan: serial numbers array
      serialNumbers: serialNumbers,
    }

    setScanningItem(combinedData)
  }

  const handleInput = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAccept = async () => {
    console.log('Accept Handle')

    try {
      const payload = {
        status: 'accept',
      }

      await backendReceiving.put(`/receiving-headers/${receivingHeaderId}`, payload)
      toast.success('Receiving rejected successfully')
      fetchDetail() // refresh detail after reject
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Gagal melakukan reject pada receiving',
      )
    }
  }

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to REJECT this receiving?')) return

    try {
      const payload = {
        status: 'reject',
      }

      await backendReceiving.put(`/receiving-headers/${receivingHeaderId}`, payload)
      toast.success('Receiving rejected successfully')
      fetchDetail() // refresh detail after reject
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Gagal melakukan reject pada receiving',
      )
    }
  }

  const handleSerial = async () => {
    const serialNumber = formData.serialNumber.replace(/\s+/g, '')
    if (!serialNumber) return

    const payload = {
      receiving_item_id: scanningItem.itemId,
      serial_number: serialNumber,
    }

    try {
      const response = await backendReceiving.post('/serial-staging', payload)

      // Ambil data serial baru dari response
      const newSerial = response.data.data

      // Toast sukses dari server
      toast.success(response.data.message || 'Serial Number berhasil disimpan')

      // Bersihkan input
      setFormData({ serialNumber: '' })

      // Optimistic update ke scanningItem (atau combinedData jika kamu pakai array)
      setScanningItem((prev) => ({
        ...prev,
        totalStaged: prev.totalStaged + 1,
        remainingStage: prev.remainingStage - 1,
        serialNumbers: [newSerial, ...(prev.serialNumbers || [])],
      }))

      // (Opsional) auto scroll atau highlight serial baru
      setTimeout(() => {
        document.getElementById('serial-top')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Terjadi kesalahan saat menyimpan Serial Number'

      toast.error(message)
      console.error('Gagal simpan Serial Number:', error)
    }
  }

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

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Receiving Detail - GR Number: {header?.gr_number}</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={6}>
                <div className="fw-semibold">PO Number</div>
                <div>{header?.purchase_order?.po_number || '-'}</div>
              </CCol>
              <CCol md={6}>
                <div className="fw-semibold">Batch</div>
                <div>{header?.batch || '-'}</div>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <div className="fw-semibold">Status</div>
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
              </CCol>
              <CCol md={6}>
                <div className="fw-semibold">Received Date</div>
                <div>
                  {header?.received_date
                    ? new Date(header.received_date).toLocaleDateString()
                    : '-'}
                </div>
              </CCol>
            </CRow>

            {/* <CRow className="mb-3">
              <CCol md={6}>
                <FormRow label="Notes">
                  <CFormTextarea
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInput}
                    placeholder="Write any additional notes"
                  />
                </FormRow>
              </CCol>

              <CCol md={6}>
                <div className="fw-semibold">Location</div>
                <div>{header?.location || '-'}</div>
              </CCol>
            </CRow> */}

            <CRow className="mb-3"></CRow>

            <h5 className="mt-4">
              <b>Receiving Items</b>
            </h5>
            <CTable bordered responsive>
              <CTableHead>
                <CTableRow className="text-center">
                  <CTableHeaderCell>No</CTableHeaderCell>
                  <CTableHeaderCell>Product</CTableHeaderCell>
                  <CTableHeaderCell>Item Type</CTableHeaderCell>
                  <CTableHeaderCell>Qty</CTableHeaderCell>
                  <CTableHeaderCell>Serialized</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <CTableRow key={item.id || index} className="text-center">
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{item.product.data.name || '-'}</CTableDataCell>
                      <CTableDataCell>{item.item_type}</CTableDataCell>
                      <CTableDataCell>{item.quantity}</CTableDataCell>
                      <CTableDataCell>{item.is_serialized ? 'Yes' : 'No'}</CTableDataCell>
                      <CTableDataCell>
                        {item.is_serialized && (
                          <CButton
                            size="sm"
                            color="primary"
                            onClick={() => handleScan(item)}
                            className="d-block mx-auto"
                          >
                            Scan
                          </CButton>
                        )}
                      </CTableDataCell>
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

            {header?.status !== 'completed' && (
              <div className="d-flex justify-content-between mt-3">
                <CCol md={12} className="d-flex justify-content-end align-items-end">
                  <CButton color="danger" className="me-2 text-white" onClick={handleReject}>
                    Reject
                  </CButton>
                  <CButton color="success" className="text-white" onClick={handleAccept}>
                    Accept
                  </CButton>
                </CCol>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {scanningItem && (
        <CCol xs={12}>
          <CRow>
            {' '}
            {/* Kiri: Info dan Input */}
            <CCol md={6}>
              <CCard className="mb-4 h-100">
                <CCardHeader>
                  <strong>Scan Serial Number : {scanningItem.itemName || '-'}</strong>
                </CCardHeader>
                <CCardBody>
                  <FormRow label="Serial Number" labelCols="2">
                    <CFormInput
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleInput}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSerial()
                        }
                      }}
                      disabled={isFormLocked}
                    />
                  </FormRow>
                  <CounterCard title="Expected Quantity" value={scanningItem.expectedQuantity} />
                  <CounterCard title="Remaining Quantity" value={scanningItem.remainingStage} />
                </CCardBody>
              </CCard>
            </CCol>
            {/* Kanan: Tabel Serial Numbers */}
            <CCol md={6}>
              <CCard className="mb-4 h-100">
                <CCardHeader>
                  <strong>Staged Serial Numbers || Total Staged: {scanningItem.totalStaged}</strong>
                </CCardHeader>
                <CCardBody className="d-flex flex-column">
                  <div className="flex-grow-1 overflow-auto">
                    <CTable striped hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>No</CTableHeaderCell>
                          <CTableHeaderCell>Serial Number</CTableHeaderCell>
                          <CTableHeaderCell>Staged At</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {paginatedSerialNumbers.map((sn, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </CTableDataCell>
                            <CTableDataCell>{sn.serial_number}</CTableDataCell>
                            <CTableDataCell>
                              {new Date(sn.created_at).toLocaleString()}
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>

                  {/* Pagination Control */}
                  <div className="d-flex justify-content-end mt-3">
                    <CPagination>
                      <CPaginationItem
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                      >
                        Previous
                      </CPaginationItem>
                      {Array.from({
                        length: Math.ceil(scanningItem.serialNumbers.length / itemsPerPage),
                      }).map((_, i) => (
                        <CPaginationItem
                          key={i}
                          active={i + 1 === currentPage}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </CPaginationItem>
                      ))}
                      <CPaginationItem
                        disabled={
                          currentPage ===
                          Math.ceil(scanningItem.serialNumbers.length / itemsPerPage)
                        }
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                      >
                        Next
                      </CPaginationItem>
                    </CPagination>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCol>
      )}
    </CRow>
  )
}

export default ReceivingDetail
