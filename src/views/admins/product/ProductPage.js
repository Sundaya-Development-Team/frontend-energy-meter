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
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { backendProduct } from '../../../api/axios'

const ProductPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editData, setEditData] = useState(null)
  const [form, setForm] = useState({
    name: '',
    sap_code: '',
    product_type_id: '',
    supplier_id: '',
    is_active: true,
    image: null,
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [types, setTypes] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalRows, setTotalRows] = useState(0)

  // ambil data produk
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
    } catch {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  //ambil data supplier
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://192.168.3.171:3030/api/suppliers', {
        params: { page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' }, // fix here
      })
      setSuppliers(res.data.data || [])
    } catch {
      toast.error('Failed to fetch suppliers')
    }
  }

  const fetchTypes = async () => {
    try {
      const res = await axios.get('http://192.168.3.171:3030/api/product-types', {
        params: { page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' }, // fix here
      })
      setTypes(res.data.data || [])
    } catch {
      toast.error('Failed to fetch product types')
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchSuppliers()
    fetchTypes()
  }, [page, limit])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setForm((prev) => ({ ...prev, [name]: newValue }))
  }

  // handle untuk create dan edit data
  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...form,
      is_active: form.is_active === true || form.is_active === 'true',
    }

    try {
      let res
      if (editData) {
        //catatan sebelum put data, perhatikan gambar dahulu berubah atau tidak
        res = await backendProduct.put(`/${editData.id}`, payload)
        toast.success(res.data?.message || 'Product updated')
      } else {
        //catatan sebelum post data, perhatikan gambar dahulu harus upload gambar
        res = await backendProduct.post('/', payload)
        toast.success(res.data?.message || 'Product created')
      }

      setModalVisible(false)
      resetForm()
      fetchProducts()
    } catch (error) {
      toast.error('Failed to save product')
    }
  }

  // besihkan form
  const resetForm = () => {
    setForm({
      name: '',
      sap_code: '',
      product_type_id: '',
      supplier_id: '',
      is_active: true,
      image: null,
    })
    setImagePreview(null)
    setEditData(null)
  }

  // handle untuk show modal dan data edit produk
  const handleEdit = (row) => {
    setEditData(row)
    setForm({
      name: row.name,
      sap_code: row.sap_code,
      product_type_id: row.product_type_id,
      supplier_id: row.supplier_id,
      is_active: row.is_active,
      image: null,
    })
    setImagePreview(row.image_url || null)
    setModalVisible(true)
  }

  // delete produk
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      await backendProduct.delete(`/${id}`)
      toast.success('Product deleted')

      // Cek jika halaman saat ini hanya punya 1 data
      if (products.length === 1 && page > 1) {
        setPage((prev) => prev - 1) // Kembali ke halaman sebelumnya
      } else {
        fetchProducts() // Tetap di halaman saat ini
      }

      resetForm()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  // kolom / table
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
      selector: (row) => row.type?.name || '-',
      sortable: true,
    },
    {
      name: 'Supplier',
      selector: (row) => row.supplier?.name || '-',
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

  // details produk
  const ExpandedComponent = ({ data }) => (
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
          <strong>Type:</strong> {data.type?.name || '-'}
        </CCol>
        <CCol xs={12} md={6}>
          <strong>Supplier:</strong> {data.supplier?.name || '-'}
        </CCol>
      </CRow>
      <CRow className="mb-2">
        <CCol xs={12}>
          <strong>Image:</strong>
          <div className="mt-2">
            <img
              src={data.image_url || '-'}
              alt="Product"
              style={{ width: '100%', maxWidth: '300px', height: 'auto', borderRadius: '8px' }}
            />
          </div>
        </CCol>
      </CRow>
    </div>
  )

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

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
                  onChangePage={(p) => setPage(p)}
                  onChangeRowsPerPage={(newLimit) => {
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
        <CModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false)
            resetForm()
          }}
        >
          <CModalHeader>
            <CModalTitle>{editData ? 'Edit Product' : 'Add Product'}</CModalTitle>
          </CModalHeader>
          <CForm onSubmit={handleSubmit}>
            <CModalBody>
              <CFormLabel>Product Name</CFormLabel>
              <CFormInput name="name" value={form.name} onChange={handleInputChange} required />

              <CFormLabel className="mt-2">SAP Code</CFormLabel>
              <CFormInput
                name="sap_code"
                value={form.sap_code}
                onChange={handleInputChange}
                required
              />

              <CFormLabel className="mt-2">Type</CFormLabel>
              <CFormSelect
                name="product_type_id"
                value={form.product_type_id}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select Type --</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </CFormSelect>

              <CFormLabel className="mt-2">Supplier</CFormLabel>
              <CFormSelect
                name="supplier_id"
                value={form.supplier_id}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </CFormSelect>

              <CFormLabel className="mt-2">Active</CFormLabel>
              <CFormSelect
                name="is_active"
                value={form.is_active}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    is_active: e.target.value === 'true',
                  }))
                }
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </CFormSelect>

              <CFormLabel className="mt-2">Image</CFormLabel>
              <CFormInput
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const imageUrl = URL.createObjectURL(file)
                    setForm((prev) => ({
                      ...prev,
                      image_url: imageUrl,
                      image_name: file.name,
                    }))
                    setImagePreview(imageUrl)
                  }
                }}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" height={100} />
                </div>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => {
                  setModalVisible(false)
                  resetForm()
                }}
              >
                Cancel
              </CButton>
              <CButton type="submit" color="primary">
                {editData ? 'Update' : 'Create'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>
      </CRow>
    </>
  )
}

export default ProductPage
