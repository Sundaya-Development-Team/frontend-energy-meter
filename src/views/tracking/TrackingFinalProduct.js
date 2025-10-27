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

  // Daftar kolom QC sesuai tabel (Unut download CSV dan Filter)
  const qcColumns = [
    { code: 'QC-SA002', label: 'Sub Assembly' },
    { code: 'QC-AT003', label: 'Assembly' },
    { code: 'QC-OT004', label: 'ON Test' },
    { code: 'QC-HT005', label: 'Hippot' },
    { code: 'QC-CT1006', label: 'Calibration 1' },
    { code: 'QC-U015', label: 'Ultrasonic' },
    { code: 'QC-RM013', label: 'Ref. Meter' },
    { code: 'QC-CT2014', label: 'Calibration 2' },
    { code: 'QC-AT007', label: 'Aging' },
    { code: 'QC-LG016', label: 'Laser & Gripping' },
  ]

  // === FILTER STATE PER KOLOM ===
  const [filters, setFilters] = useState(
    qcColumns.reduce((acc, qc) => ({ ...acc, [qc.code]: '' }), {}),
  )

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
            is_pln_code: true,
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

  // untuk event double-click resize
  useEffect(() => {
    const table = document.querySelector('.rdt_Table')
    if (!table) return

    const expandedCols = new Map()

    const handleDoubleClick = (e) => {
      const cell = e.target.closest('.rdt_TableCell, .rdt_TableCol')
      if (!cell) return
      if (cell.querySelector('button') || cell.querySelector('span[role="button"]')) return

      const columnIndex = Array.from(cell.parentNode.children).indexOf(cell)
      if (columnIndex !== 0) return // hanya kolom pertama (PLN Serial)

      const rows = document.querySelectorAll('.rdt_TableRow')
      const headers = document.querySelectorAll('.rdt_TableCol')
      const allCells = [
        ...Array.from(rows).map((r) => r.children[columnIndex]),
        headers[columnIndex],
      ].filter(Boolean)

      const isExpanded = expandedCols.get(columnIndex) || false

      if (isExpanded) {
        // kembali ke ukuran default
        allCells.forEach((c) => {
          c.style.width = '150px'
          c.style.minWidth = '150px'
          c.style.maxWidth = '800px'
        })
        expandedCols.set(columnIndex, false)
        return
      }

      // expand sesuai konten
      allCells.forEach((c) => void c.offsetWidth)
      let maxWidth = 0
      allCells.forEach((c) => {
        const range = document.createRange()
        range.selectNodeContents(c)
        const rect = range.getBoundingClientRect()
        const contentWidth = rect.width + 48 // padding buffer
        if (contentWidth > maxWidth) maxWidth = contentWidth
      })

      const targetWidth = Math.min(maxWidth, 800)
      allCells.forEach((c) => {
        c.style.width = `${targetWidth}px`
        c.style.minWidth = `${targetWidth}px`
        c.style.maxWidth = `${targetWidth}px`
      })

      expandedCols.set(columnIndex, true)
    }

    table.addEventListener('dblclick', handleDoubleClick)
    return () => table.removeEventListener('dblclick', handleDoubleClick)
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

    // Header CSV
    const headers = ['No', 'Serial Number', 'PLN Serial', ...qcColumns.map((qc) => qc.label)]

    // Isi baris CSV
    const rows = exportData.map((row, index) => [
      index + 1,
      row.serial_number || '-',
      row.pln_code || '-',
      ...qcColumns.map((qc) => {
        const status = row.qc_history?.[qc.code]?.status || '-'
        const date = row.qc_history?.[qc.code]?.inspection_date
        let formattedDate = '-'

        if (date) {
          const d = new Date(date)
          // Tambahkan 7 jam untuk WIB
          d.setHours(d.getHours() + 7)
          formattedDate = d.toISOString().slice(0, 19).replace('T', ' ')
        }

        return formattedDate !== '-' ? `${status} (${formattedDate})` : status
      }),
    ])

    // Gabung jadi string CSV
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers, ...rows].map((e) => e.join(',')).join('\n')

    // Download otomatis
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

  const renderStatusBadge = (status, date) => {
    if (!status) return '-'

    const badgeStyle = {
      PASS: { color: 'white', backgroundColor: '#28a745' },
      FAIL: { color: 'white', backgroundColor: '#dc3545' },
      PENDING: { color: 'black', backgroundColor: '#ffc107' },
      on_progress: { color: 'white', backgroundColor: '#17a2b8' },
    }

    const style = badgeStyle[status] || { backgroundColor: '#6c757d', color: 'white' }

    // ✅ Format tanggal + jam ke zona waktu lokal (WIB)
    const formattedDate = date
      ? new Date(date).toLocaleString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Jakarta',
        })
      : null

    return (
      <div style={{ textAlign: 'center', lineHeight: '1.3' }}>
        <span
          style={{
            ...style,
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            fontWeight: 600,
            display: 'inline-block',
          }}
        >
          {status}
        </span>
        {formattedDate && (
          <div
            style={{
              fontSize: '0.7rem',
              color: '#555',
              marginTop: '3px',
            }}
          >
            {formattedDate}
          </div>
        )}
      </div>
    )
  }

  const columns = [
    {
      name: <span title="PLN Serial">PLN Serial</span>,
      selector: (row) => row.pln_code || '-',
      sortable: true,
    },
    ...qcColumns.map((qc) => ({
      name: <span title={qc.label}>{qc.label}</span>,
      selector: (row) => row.qc_history?.[qc.code]?.status,
      cell: (row) =>
        renderStatusBadge(
          row.qc_history?.[qc.code]?.status,
          row.qc_history?.[qc.code]?.inspection_date, // gunakan field waktu di sini
        ),
      sortable: true,
    })),
    {
      name: <span title="Actions">Actions</span>,
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
          {qcColumns.map((qc) => (
            <CCol key={qc.code} xs={6} md={3} className="mb-2">
              <small>{qc.label}</small>
              <CFormSelect
                size="sm"
                value={filters[qc.code]}
                onChange={(e) => setFilters({ ...filters, [qc.code]: e.target.value })}
              >
                <option value="">All</option>
                <option value="PASS">PASS</option>
                <option value="FAIL">FAIL</option>
                <option value="PENDING">PENDING</option>
                <option value="on_progress">on_progress</option>
              </CFormSelect>
            </CCol>
          ))}
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
