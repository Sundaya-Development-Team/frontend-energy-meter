import React, { useEffect, useState, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CForm,
  CModalBody,
  CFormLabel,
  CFormSelect,
  CModalFooter,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import { backendWh } from '../../api/axios'

// Komponen detail row
const ExpandedComponent = ({ data }) => (
  <div className="p-3 border-top bg-light rounded">
    <CRow className="mb-2">
      <CCol md={6}>
        <strong>Warehouse Code:</strong> {data.code}
      </CCol>
      <CCol md={6}>
        <strong>Name:</strong> {data.name}
      </CCol>
    </CRow>
    <CRow className="mb-2">
      <CCol md={6}>
        <strong>Location:</strong> {data.location || '-'}
      </CCol>
      <CCol md={6}>
        <strong>Created:</strong> {data.created_at?.name || '-'}
      </CCol>
    </CRow>
    {/* <CRow>
      <CCol>
        <strong>Image:</strong>
        <div className="mt-2">
          {data.image_url ? (
            <img
              src={data.image_url}
              alt="Product"
              style={{
                width: '100%',
                maxWidth: '300px',
                height: 'auto',
                borderRadius: '8px',
              }}
            />
          ) : (
            <span>-</span>
          )}
        </div>
      </CCol>
    </CRow> */}
  </div>
)

const WarehouseList = () => {
  const [data, setData] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [loading, setLoading] = useState(false)
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

  const fetchWarehouses = useCallback(
    async (page = currentPage, limit = perPage, search = searchKeyword) => {
      setLoading(true)
      try {
        const res = await backendWh.get('/', {
          params: { page, limit, search },
        })
        const { data: warehouses, pagination } = res.data
        setData(warehouses || [])
        setTotalRows(pagination?.total || 0)
      } catch (error) {
        toast.error('Failed to fetch warehouses')
      } finally {
        setLoading(false)
      }
    },
    [currentPage, perPage, searchKeyword],
  )

  useEffect(() => {
    fetchWarehouses()
  }, [fetchWarehouses])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage)
    setCurrentPage(page)
  }

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value)
    setCurrentPage(1)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchWarehouses(1, perPage, searchKeyword)
  }

  const resetForm = () => {
    setForm({
      name: '',
      sap_code: '',
      product_type_id: '',
      supplier_id: '',
      is_active: true,
      image: null,
    })

    setEditData(null)
  }

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await backendProduct.delete(`/${id}`)
      toast.success('Product deleted')
      if (products.length === 1 && page > 1) setPage((prev) => prev - 1)
      else fetchProducts()
      resetForm()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const handleInputChange = (e) => {
    const { name, location, code } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    console.log('handle input')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      is_active: form.is_active === true || form.is_active === 'true',
    }

    // try {
    //   let res
    //   if (editData) {
    //     res = await backendProduct.put(`/${editData.id}`, payload)
    //     toast.success(res.data?.message || 'Product updated')
    //   } else {
    //     res = await backendProduct.post('/', payload)
    //     toast.success(res.data?.message || 'Product created')
    //   }
    //   setModalVisible(false)
    //   resetForm()
    //   fetchProducts()
    // } catch {
    //   toast.error('Failed to save product')
    // }
  }

  const columns = [
    { name: 'Warehouse Code', selector: (row) => row.code || '-', sortable: true },
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'Location', selector: (row) => row.location || '-', sortable: true },
    { name: 'Created', selector: (row) => row.created_at || '-', sortable: true },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Warehouses</strong>
            <CButton onClick={() => setModalVisible(true)}>+ Add Warehouse</CButton>
          </CCardHeader>
          <CCardBody>
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <CRow>
                <CCol md={4}>
                  <CFormInput
                    type="text"
                    placeholder="Search..."
                    value={searchKeyword}
                    onChange={handleSearchChange}
                  />
                </CCol>
              </CRow>
            </form>
            <DataTable
              columns={columns}
              data={data}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              expandableRows
              expandableRowsComponent={ExpandedComponent}
              highlightOnHover
              striped
            />
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
            <CFormLabel>Warehouse Name</CFormLabel>
            <CFormInput name="name" value={form.name} onChange={handleInputChange} required />

            <CFormLabel className="mt-2">Location</CFormLabel>
            <CFormInput name="code" value={form.location} onChange={handleInputChange} required />

            <CFormLabel className="mt-2">Warehouse Code</CFormLabel>
            <CFormInput name="code" value={form.code} onChange={handleInputChange} required />
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
  )
}

export default WarehouseList
