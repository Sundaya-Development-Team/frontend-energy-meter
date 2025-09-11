import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CSpinner, CRow, CCol, CFormInput } from '@coreui/react'
import DataTable from 'react-data-table-component'
import { backendWh } from '../../api/axios'

const WarehouseStock = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [summary, setSummary] = useState(null)

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await backendWh.get('/stock-units/stock-by-product')

      if (response.data.success) {
        const stockList = response.data.data?.stock_by_product || []
        setRecords(stockList)
        setSummary(response.data.data?.summary || null)
      }
    } catch (error) {
      console.error('Error fetching stock by product:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  // filter by product name
  const filteredRecords = records.filter((item) =>
    item.product_details?.name.toLowerCase().includes(searchKeyword.toLowerCase()),
  )

  const handleUpdate = (row) => {
    console.log('Update clicked for:', row)
    // nanti bisa buka modal atau panggil API update unit_count
  }

  const columns = [
    {
      name: 'No',
      selector: (row, index) => index + 1,
      width: '70px',
    },
    {
      name: 'Product Name',
      selector: (row) => row.product_details?.name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: (row) => row.product_details?.description,
    },
    {
      name: 'Total Quantity',
      selector: (row) => row.total_quantity,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <button className="btn btn-sm btn-primary" onClick={() => handleUpdate(row)}>
          Update
        </button>
      ),
      ignoreRowClick: true,
    },
  ]

  return (
    <CCard>
      <CCardHeader>
        <strong>Stock by Product</strong>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-3">
          <CCol md={4}>
            <CFormInput
              placeholder="Search product..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </CCol>
        </CRow>

        <DataTable
          columns={columns}
          data={filteredRecords}
          progressPending={loading}
          progressComponent={<CSpinner />}
          highlightOnHover
          striped
          pagination
        />

        {/* {summary && (
          <div className="mt-3">
            <h6>Summary:</h6>
            <ul>
              <li>Total Products: {summary.total_products}</li>
              <li>Total Quantity: {summary.total_quantity}</li>
              <li>Total Units: {summary.total_units}</li>
            </ul>
          </div>
        )} */}
      </CCardBody>
    </CCard>
  )
}

export default WarehouseStock
