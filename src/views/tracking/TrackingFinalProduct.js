import React, { useState, useMemo } from 'react'
import { CCard, CCardBody, CSpinner, CFormSelect } from '@coreui/react'
import DataTable from 'react-data-table-component'
import { CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const TrackingFinalProduct = () => {
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')

  // di dalam komponen
  const navigate = useNavigate()

  const handleDetail = (row) => {
    // misalnya navigate ke halaman detail pakai id
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
      // search global (cek semua kolom string)
      const keyword = searchKeyword.toLowerCase()
      const matchesSearch =
        keyword === '' ||
        Object.values(row).some((val) => String(val).toLowerCase().includes(keyword))

      // filter per kolom
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (value === '') return true // no filter
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
        <CButton size="sm" color="primary" onClick={() => handleDetail(row.id)}>
          Detail
        </CButton>
      ),
      ignoreRowClick: true,
    },
  ]
  const renderFilterSelect = (colKey, label) => (
    <div className="me-2">
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
        {/* <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="form-control form-control-sm w-25"
          />
        </div> */}

        <div className="row mb-3">
          <div className="col-md-4 col-sm-6">
            <input
              type="text"
              placeholder="Search..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="form-control form-control-sm"
            />
          </div>
        </div>

        <div className="row mb-3">
          {/* Kolom kiri */}
          <div className="col-md-6">
            <div className="row g-2">
              <div className="col-6">{renderFilterSelect('receiving_test', 'Receiving')}</div>
              <div className="col-6">{renderFilterSelect('assembly_test', 'Assembly')}</div>
              <div className="col-6">{renderFilterSelect('on_test', 'ON Test')}</div>
              <div className="col-6">{renderFilterSelect('hippot_test', 'Hippot')}</div>
            </div>
          </div>

          {/* Kolom kanan */}
          <div className="col-md-6">
            <div className="row g-2">
              <div className="col-6">{renderFilterSelect('aging_test', 'Aging')}</div>
              <div className="col-6">{renderFilterSelect('clear_zero1', 'Clear Zero1')}</div>
              <div className="col-6">{renderFilterSelect('clear_zero2', 'Clear Zero2')}</div>
            </div>
          </div>
        </div>

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
