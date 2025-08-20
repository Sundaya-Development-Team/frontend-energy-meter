import React, { useState, useMemo } from 'react'
import {
  CCard,
  CCardBody,
  CSpinner,
  CFormSelect,
  CFormInput,
  CRow,
  CCol,
  CFormCheck,
  CButton,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'

const TrackingFinalProduct = () => {
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterSerialized, setFilterSerialized] = useState(false)
  const [filterNonSerialized, setFilterNonSerialized] = useState(false)

  const navigate = useNavigate()

  const handleDetail = (row) => {
    navigate(`/tracking/final-product/${row.id}`)
  }

  // === FILTER STATE PER KOLOM ===
  const [filters, setFilters] = useState({
    receiving_test: '',
    assembly_test: '',
    on_test: '',
    hippot_test: '',
    aging_test: '',
    clear_zero1: '',
    clear_zero2: '',
  })

  // === DUMMY DATA ===
  const data = [
    {
      id: 1,
      pln_serial: 'PLN123456',
      receiving_test: 'PASS',
      assembly_test: 'PASS',
      on_test: 'PASS',
      hippot_test: 'PASS',
      aging_test: 'PASS',
      clear_zero1: 'PASS',
      clear_zero2: 'PASS',
    },
    {
      id: 2,
      pln_serial: 'PLN654321',
      receiving_test: 'PASS',
      assembly_test: 'FAIL',
      on_test: 'PASS',
      hippot_test: 'FAIL',
      aging_test: 'PASS',
      clear_zero1: 'PASS',
      clear_zero2: 'FAIL',
    },
    {
      id: 3,
      pln_serial: 'PLN777888',
      receiving_test: 'FAIL',
      assembly_test: 'PASS',
      on_test: 'FAIL',
      hippot_test: 'PASS',
      aging_test: 'FAIL',
      clear_zero1: 'FAIL',
      clear_zero2: 'PASS',
    },
  ]

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

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (value === '') return true
        return row[key] === value
      })

      return matchesSearch && matchesFilters
    })
  }, [data, searchKeyword, filters])

  const columns = [
    { name: 'PLN Serial', selector: (row) => row.pln_serial, sortable: true },
    { name: 'Receiving Test', selector: (row) => row.receiving_test, sortable: true },
    { name: 'Assembly Test', selector: (row) => row.assembly_test, sortable: true },
    { name: 'ON Test', selector: (row) => row.on_test, sortable: true },
    { name: 'Hippot Test', selector: (row) => row.hippot_test, sortable: true },
    { name: 'Aging Test', selector: (row) => row.aging_test, sortable: true },
    { name: 'Clear Zero1', selector: (row) => row.clear_zero1, sortable: true },
    { name: 'Clear Zero2', selector: (row) => row.clear_zero2, sortable: true },
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
      </CFormSelect>
    </div>
  )

  return (
    <CCard>
      <CCardBody>
        {/* Search & Checkbox */}
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

          {/* <CCol md={8} sm={6} className="d-flex align-items-center gap-3 mt-2 mt-sm-0">
            <CFormCheck
              label="Serialized"
              checked={filterSerialized}
              onChange={(e) => setFilterSerialized(e.target.checked)}
            />
            <CFormCheck
              label="Non-Serialized"
              checked={filterNonSerialized}
              onChange={(e) => setFilterNonSerialized(e.target.checked)}
            />
          </CCol> */}
        </CRow>

        {/* Filter Dropdowns */}
        <CRow className="mb-3">
          <CCol md={6}>
            <CRow className="g-2">
              <CCol xs={6}>{renderFilterSelect('receiving_test', 'Receiving')}</CCol>
              <CCol xs={6}>{renderFilterSelect('assembly_test', 'Assembly')}</CCol>
              <CCol xs={6}>{renderFilterSelect('on_test', 'ON Test')}</CCol>
              <CCol xs={6}>{renderFilterSelect('hippot_test', 'Hippot')}</CCol>
            </CRow>
          </CCol>

          <CCol md={6}>
            <CRow className="g-2">
              <CCol xs={6}>{renderFilterSelect('aging_test', 'Aging')}</CCol>
              <CCol xs={6}>{renderFilterSelect('clear_zero1', 'Clear Zero1')}</CCol>
              <CCol xs={6}>{renderFilterSelect('clear_zero2', 'Clear Zero2')}</CCol>
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
        />
      </CCardBody>
    </CCard>
  )
}

export default TrackingFinalProduct
