import React, { useState, useMemo, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CSpinner,
  CFormSelect,
  CFormInput,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import { backendTracking } from '../../api/axios'

const TrackingFinalProduct = () => {
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [data, setData] = useState([])

  const navigate = useNavigate()

  const handleDetail = (row) => {
    navigate(`/tracking/final-product/${row.id}`)
  }

  // === FILTER STATE PER KOLOM ===
  const [filters, setFilters] = useState({
    'QC-SPS-PCBA-001': '',
    'QC-AT003': '',
    'QC-OT004': '',
    'QC-HT005': '',
    'QC-AT007': '',
    'QC-CZ1008': '',
    'QC-CZ2010': '',
  })

  // === FETCH DATA FROM API ===
  // === FETCH DATA FROM API ===
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await backendTracking.post('/qc-results/history', {
          page: 1,
          limit: 50,
          is_serial: true,
        })

        console.log('API response:', res.data) // cek dulu struktur

        // sesuaikan dengan struktur response
        // const result = res.data?.data?.items ?? res.data?.data ?? []
        const result = res.data?.data?.records

        setData(Array.isArray(result) ? result : [])
      } catch (err) {
        console.error('Gagal fetch data:', err)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // === FILTER LOGIC ===
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const keyword = searchKeyword.toLowerCase()
      const matchesSearch =
        keyword === '' ||
        Object.values(row).some((val) =>
          String(val || '')
            .toLowerCase()
            .includes(keyword),
        )

      const matchesFilters = Object.entries(filters).every(([qcKey, qcValue]) => {
        if (qcValue === '') return true
        return row.qc_history?.[qcKey]?.status === qcValue
      })

      return matchesSearch && matchesFilters
    })
  }, [data, searchKeyword, filters])

  const columns = [
    { name: 'Serial Number', selector: (row) => row.serial_number, sortable: true },
    { name: 'PLN Serial', selector: (row) => row.pln_serial, sortable: true },
    {
      name: 'Receiving Test',
      selector: (row) => row.qc_history?.['QC-SPS-PCBA-001']?.status,
      sortable: true,
    },
    {
      name: 'Assembly Test',
      selector: (row) => row.qc_history?.['QC-AT003']?.status,
      sortable: true,
    },
    { name: 'ON Test', selector: (row) => row.qc_history?.['QC-OT004']?.status, sortable: true },
    {
      name: 'Hippot Test',
      selector: (row) => row.qc_history?.['QC-HT005']?.status,
      sortable: true,
    },
    { name: 'Aging Test', selector: (row) => row.qc_history?.['QC-AT007']?.status, sortable: true },
    {
      name: 'Clear Zero1',
      selector: (row) => row.qc_history?.['QC-CZ1008']?.status,
      sortable: true,
    },
    {
      name: 'Clear Zero2',
      selector: (row) => row.qc_history?.['QC-CZ2010']?.status,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <CButton size="sm" color="primary" onClick={() => handleDetail(row)}>
          Detail
        </CButton>
      ),
      ignoreRowClick: true,
    },
  ]

  const renderFilterSelect = (colKey, label) => (
    <div>
      <small>{label}</small>
      <CFormSelect
        size="sm"
        value={filters[colKey]}
        onChange={(e) => setFilters({ ...filters, [colKey]: e.target.value })}
      >
        <option value="">All</option>
        <option value="PASS">PASS</option>
        <option value="FAIL">FAIL</option>
        <option value="PENDING">PENDING</option>
        <option value="on_progress">on_progress</option>
      </CFormSelect>
    </div>
  )

  return (
    <CCard>
      <CCardBody>
        {/* Search */}
        <CRow className="mb-3">
          <CCol md={4} sm={6}>
            <CFormInput
              type="text"
              placeholder="Search..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              size="sm"
            />
          </CCol>
        </CRow>

        {/* Filter Dropdowns */}
        <CRow className="mb-3">
          <CCol md={6}>
            <CRow className="g-2">
              <CCol xs={6}>{renderFilterSelect('QC-SPS-PCBA-001', 'Receiving')}</CCol>
              <CCol xs={6}>{renderFilterSelect('QC-AT003', 'Assembly')}</CCol>
              <CCol xs={6}>{renderFilterSelect('QC-OT004', 'ON Test')}</CCol>
              <CCol xs={6}>{renderFilterSelect('QC-HT005', 'Hippot')}</CCol>
            </CRow>
          </CCol>

          <CCol md={6}>
            <CRow className="g-2">
              <CCol xs={6}>{renderFilterSelect('QC-AT007', 'Aging')}</CCol>
              <CCol xs={6}>{renderFilterSelect('QC-CZ1008', 'Clear Zero1')}</CCol>
              <CCol xs={6}>{renderFilterSelect('QC-CZ2010', 'Clear Zero2')}</CCol>
            </CRow>
          </CCol>
        </CRow>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={loading}
          progressComponent={<CSpinner size="sm" />}
          pagination
          highlightOnHover
          persistTableHead
          noDataComponent="No data available"
        />
      </CCardBody>
    </CCard>
  )
}

export default TrackingFinalProduct
