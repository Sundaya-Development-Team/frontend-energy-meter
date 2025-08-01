/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import { backendProduct } from '../../../api/axios'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'

const ProductPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editData, setEditData] = useState(null)
  const [form, setForm] = useState({ name: '', sap_code: '', type: '', supplier: '', active: '' })

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalRows, setTotalRows] = useState(0)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await backendProduct.get('/', {
        params: {
          page,
          limit,
          sortBy: 'name',
          sortOrder: 'asc',
          include_details: true,
          include_categories: true,
          include_components: true,
        },
      })
      const totalData = res.data.meta.pagination.totalItems
      setProducts(res.data.data || [])
      setTotalRows(totalData || 0)
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, limit])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editData) {
        await backendProduct.put(`/${editData.id}`, form)
        toast.success('Product updated')
      } else {
        await backendProduct.post('/', form)
        toast.success('Product created')
      }
      setModalVisible(false)
      setForm({ name: '', sap_code: '', type: '', supplier: '', active: '' })
      setEditData(null)
      fetchProducts()
    } catch (error) {
      toast.error('Failed to save product')
    }
  }

  const handleEdit = (row) => {
    setEditData(row)
    setForm({
      name: row.name,
      sap_code: row.sap_code,
      type: row.type.name || '',
      supplier: row.supplier.name || '',
      active: row.is_active ? 'Yes' : 'No' || '',
    })
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await backendProduct.delete(`/${id}`)
      toast.success('Product deleted')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const columns = [
    {
      name: 'No',
      width: '60px',
      cell: (row, index) => (
        <div style={{ textAlign: 'center', width: '100%' }}>{(page - 1) * limit + index + 1}</div>
      ),
    },
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'SAP Code', selector: (row) => row.sap_code, sortable: true },
    {
      name: 'Type',
      selector: (row) => row.type.name || '-',
      sortable: true,
    },
    {
      name: 'Supplier',
      selector: (row) => row.supplier.name || '-',
      sortable: true,
    },
    {
      name: 'Active',
      selector: (row) => (row.is_active ? 'Yes' : 'No'),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2">
          <CButton size="sm" color="warning" onClick={() => handleEdit(row)}>
            Edit
          </CButton>
          <CButton size="sm" color="danger" onClick={() => handleDelete(row.id)}>
            Delete
          </CButton>
        </div>
      ),
    },
  ]

  const ExpandedComponent = ({ data }) => {
    const detail = data.details?.[0] || {}

    return (
      <div className="p-3 border-top bg-light rounded">
        <CRow className="mb-2">
          <CCol xs={12} md={6}>
            <strong>Name:</strong> {data.name}
          </CCol>
          <CCol xs={12} md={6}>
            <strong>SAP Code:</strong> {data.sap_code}
          </CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol xs={12} md={6}>
            <strong>Type:</strong> {data.type.name || '-'}
          </CCol>
          <CCol xs={12} md={6}>
            <strong>Supplier:</strong> {data.supplier.name || '-'}
          </CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol xs={12} md={6}>
            <strong>Active:</strong> {data.is_active ? 'Yes' : 'No'}
          </CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol xs={12}>
            <strong>Image:</strong>
            <div className="mt-2">
              <img
                src={data.image_url || '-'}
                alt="Product"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
            </div>
          </CCol>
        </CRow>
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Product List</strong>
            <CButton onClick={() => setModalVisible(true)}>Add Product</CButton>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <div className="text-center">
                <CSpinner />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={products}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationDefaultPage={page}
                onChangePage={(page) => setPage(page)}
                onChangeRowsPerPage={(newLimit, newPage) => {
                  setLimit(newLimit)
                  setPage(1)
                }}
                responsive
                highlightOnHover
                striped
                expandableRows
                expandableRowsComponent={ExpandedComponent}
              />
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editData ? 'Edit Product' : 'Add Product'}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <CFormLabel>Name</CFormLabel>
            <CFormInput name="name" value={form.name} onChange={handleInputChange} required />

            <CFormLabel className="mt-2">SAP Code</CFormLabel>
            <CFormInput
              name="sap_code"
              value={form.sap_code}
              onChange={handleInputChange}
              required
            />

            <CFormLabel className="mt-2">Type</CFormLabel>
            <CFormInput name="type" value={form.type} onChange={handleInputChange} required />

            <CFormLabel className="mt-2">Supplier</CFormLabel>
            <CFormInput
              name="supplier"
              value={form.supplier}
              onChange={handleInputChange}
              required
            />

            <CFormLabel className="mt-2">Active</CFormLabel>
            <CFormInput name="active" value={form.active} onChange={handleInputChange} />
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Cancel
            </CButton>
            <CButton type="submit" color="primary">
              {editData ? 'Update' : 'Create'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </CRow>
  )
}

export default ProductPage
