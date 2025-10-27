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
import { toast } from 'react-toastify'
import { backendTracking } from '../../api/axios'

const TrackingFinalProduct = () => {
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [data, setData] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const navigate = useNavigate()

  const handleDetail = (row) => {
    navigate(`/tracking/detail/${row.tracking_id}`)
  }

  // === FILTER STATE PER KOLOM ===
  const [filters, setFilters] = useState({
    'QC-SPS-PCBA-001': '',
    'QC-AT003': '',
    'QC-OT004': '',
    'QC-HT005': '',
    'QC-AT007': '',
  })

  // === FETCH DATA ===
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      try {
        let allRecords = []
        let page = 1
        const limit = 100
        let hasMore = true

        while (hasMore) {
          const res = await backendTracking.post('/qc-results/history', {
            page,
            limit,
            is_serial: true,
            tracking_type: 'assembly',
          })

          const result = res.data?.data?.records ?? []
          allRecords = [...allRecords, ...result]

          hasMore = result.length === limit
          page++
        }

        setData(allRecords)
      } catch (err) {
        console.error('Gagal fetch data:', err)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
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

  // === GET DATA YANG SEDANG TAMPIL DI PAGE ===
  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredData.slice(start, end)
  }, [filteredData, currentPage, rowsPerPage])

  // === DOWNLOAD CSV ===
  const exportToCSV = (exportData, filenameSuffix) => {
    if (!exportData || exportData.length === 0) {
      toast.error('No data to export!')
      return
    }

    const headers = [
      'No',
      'Serial Number',
      'PLN Serial',
      'Receiving Test',
      'Assembly Test',
      'ON Test',
      'Hippot Test',
      'Aging Test',
    ]

    const rows = exportData.map((row, index) => [
      index + 1,
      row.serial_number,
      row.pln_code || '-',
      row.qc_history?.['QC-SPS-PCBA-001']?.status || '-',
      row.qc_history?.['QC-AT003']?.status || '-',
      row.qc_history?.['QC-OT004']?.status || '-',
      row.qc_history?.['QC-HT005']?.status || '-',
      row.qc_history?.['QC-AT007']?.status || '-',
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers, ...rows].map((e) => e.join(',')).join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `tracking_${filenameSuffix}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success(`Exported ${exportData.length} rows successfully!`)
  }

  const handleDownloadPage = () => {
    exportToCSV(currentPageData, 'page')
  }

  const handleDownloadAll = () => {
    exportToCSV(filteredData, 'all')
  }

  const columns = [
    // { name: 'Serial Number', selector: (row) => row.serial_number, sortable: true },
    { name: 'PLN Serial', selector: (row) => row.pln_code || '-', sortable: true },
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
    {
      name: 'ON Test',
      selector: (row) => row.qc_history?.['QC-OT004']?.status,
      sortable: true,
    },
    {
      name: 'Hippot Test',
      selector: (row) => row.qc_history?.['QC-HT005']?.status,
      sortable: true,
    },
    {
      name: 'Aging Test',
      selector: (row) => row.qc_history?.['QC-AT007']?.status,
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
        {/* Search + Download */}
        <CRow className="mb-3 align-items-center">
          <CCol md={4} sm={6}>
            <CFormInput
              type="text"
              placeholder="Search..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              size="sm"
            />
          </CCol>
          <CCol md={8} sm={6} className="text-end">
            <CButton
              color="success"
              size="sm"
              className="me-2"
              onClick={handleDownloadPage}
              disabled={loading || currentPageData.length === 0}
            >
              Download Page
            </CButton>
            <CButton
              color="primary"
              size="sm"
              onClick={handleDownloadAll}
              disabled={loading || filteredData.length === 0}
            >
              Download All
            </CButton>
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
          paginationPerPage={rowsPerPage}
          onChangePage={(page) => setCurrentPage(page)}
          onChangeRowsPerPage={(newPerPage) => setRowsPerPage(newPerPage)}
        />
      </CCardBody>
    </CCard>
  )
}

export default TrackingFinalProduct
