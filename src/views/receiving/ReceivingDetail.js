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
  const [formData, setFormData] = useState({ serialNumber: '' })
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
                  <CTableHeaderCell>Action</CTableHeaderCell>
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
                      <CTableDataCell>{item.is_serialized ? 'Yes' : 'No'}</CTableDataCell>
                      <CTableDataCell>
                        {item.is_serialized && (
                          <CButton size="sm" color="primary" onClick={() => handleScan(item)}>
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
          </CCardBody>
        </CCard>
      </CCol>

      {scanningItem && (
        <CRow className="align-items-stretch">
          {/* Kiri: Info dan Input */}
          <CCol md={6} className="h-100">
            <CCard className="mb-4 h-100">
              <CCardHeader>
                <strong>Scan Serial Number : {scanningItem.itemName || '-'} </strong>
              </CCardHeader>
              <CCardBody>
                {/* <h5>Scan For: {scanningItem.itemName || '-'}</h5> */}
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
          {scanningItem?.serialNumbers?.length > 0 && (
            <CCol md={6} className="h-100">
              <CCard className="mb-4 h-100">
                <CCardHeader>
                  <strong>
                    Staged Serial Numbers || Total Staged: {scanningItem.totalStaged}{' '}
                  </strong>
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
          )}
        </CRow>
      )}
    </CRow>
  )
}

export default ReceivingDetail
