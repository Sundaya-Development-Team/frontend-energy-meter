/* eslint-disable prettier/prettier */

import React, { useEffect, useRef, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import $ from 'jquery'
import 'datatables.net-bs5'
import 'datatables.net-responsive-bs5'
import 'datatables.net-buttons-bs5'
import 'datatables.net-buttons/js/buttons.html5.js'
import 'datatables.net-buttons/js/buttons.print.js'
import JSZip from 'jszip'
import { backendProduct } from '../../../api/axios'

window.JSZip = JSZip

/* ---------- Komponen ---------- */
const SemiProductPage = () => {
  /* ---------- refs & state ---------- */
  const tableRef = useRef(null)
  const dtInstance = useRef(null)
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [uomData, setUomData] = useState([])
  const [catData, setCatData] = useState([])

  /* form di modal */
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' | 'edit'
  const [formData, setFormData] = useState({
    id: '', // hanya terisi saat edit
    sapCode: '',
    productName: '',
    uom: '',
    productType: '',
    productCategory: '',
    aktifView: '',
    image: '', // filename saja
  })

  /* ---------- helper ---------- */
  const refreshTable = async () => {
    const { data } = await backendProduct.get('/api/v1/products/all').then((r) => r.data)
    setTableData(data) // trigger rerender DataTable
  }

  /* ---------- modal helpers ---------- */
  const emptyForm = {
    id: '',
    sapCode: '',
    productName: '',
    uom: '',
    productType: '',
    productCategory: '',
    aktifView: '',
    image: '',
  }

  const handleOpenModal = (mode, rowData = null) => {
    setModalMode(mode)
    if (mode === 'edit' && rowData) {
      setFormData({
        id: rowData.id,
        sapCode: rowData.sap_code ?? '',
        productName: rowData.name ?? '',
        uom: rowData.uom?.id ?? '',
        productType: rowData.product_type ?? '',
        productCategory: rowData.category?.id ?? '',
        aktifView: rowData.is_active ?? '',
        image: rowData.img ?? '',
      })
    } else {
      setFormData(emptyForm)
    }
    setModalVisible(true)
  }

  /* onChange semua input */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'aktifView') {
      return setFormData((p) => ({ ...p, aktifView: value === 'true' }))
    }
    setFormData((p) => ({ ...p, [name]: value }))
  }

  /* ---------- Simpan (Add / Update) ---------- */
  const handleSave = async () => {
    try {
      setLoading(true)
      const payload = {
        sap_code: formData.sapCode,
        name: formData.productName,
        uom_id: Number(formData.uom),
        category_id: Number(formData.productCategory),
        is_active: formData.aktifView,
        product_type: formData.productType,
        img: formData.image,
      }
      if (modalMode === 'add') {
        await backendProduct.post('/api/v1/products/add', payload)
      } else {
        await backendProduct.put(`/api/v1/products/update/${formData.id}`, payload)
      }
      setModalVisible(false)
      await refreshTable()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ---------- fetch master ---------- */
  useEffect(() => {
    ;(async () => {
      const [uomRes, catRes] = await Promise.all([
        backendProduct.get('/api/v1/uom/all'),
        backendProduct.get('/api/v1/categories/all'),
      ])
      setUomData(uomRes.data.data)
      setCatData(catRes.data.data)
      await refreshTable()
    })()
  }, [])

  /* ---------- DataTable init & update ---------- */
  useEffect(() => {
    if (!tableData.length) return

    /* jika DT belum ada → inisialisasi */
    if (!dtInstance.current) {
      const actionCol = {
        title: 'Action',
        data: null,
        className: 'text-center',
        orderable: false,
        render: (_, __, row) => `
          <button class="btn btn-sm btn-primary btn-edit me-1" data-row='${JSON.stringify(row)}'>
            Edit
          </button>
          <button class="btn btn-sm btn-danger btn-delete" data-id='${row.id}'>
            Del
          </button>`,
      }

      dtInstance.current = $(tableRef.current).DataTable({
        data: tableData,
        responsive: true,
        dom:
          "<'row mb-2'<'col-md-6'B><'col-md-6'f>>" +
          "<'row'<'col-12'tr>>" +
          "<'row mt-2'<'col-md-6'i><'col-md-6'p>>",
        buttons: [
          { extend: 'copyHtml5', text: 'Copy' },
          { extend: 'excelHtml5', text: 'Excel' },
          { extend: 'csvHtml5', text: 'CSV' },
          { extend: 'print', text: 'Print' },
        ],
        columns: [
          actionCol,
          { title: 'ID', data: 'id' },
          { title: 'Product Code', data: 'product_code' },
          { title: 'SAP Code', data: 'sap_code' },
          { title: 'Name', data: 'name' },
          { title: 'Unit', data: 'uom', render: (u) => u?.name ?? '-' },
          { title: 'Type', data: 'product_type', className: 'text-capitalize' },
          { title: 'Category', data: 'category', render: (c) => c?.name ?? '-' },
          {
            title: 'Active',
            data: 'is_active',
            className: 'text-center',
            render: (a) =>
              a
                ? '<span class="badge bg-success">Yes</span>'
                : '<span class="badge bg-danger">No</span>',
          },
          {
            title: 'Image',
            data: 'img',
            orderable: false,
            className: 'text-center',
            // render: (img) => (img ? `<img src="/assets/img/${img}" alt="${img}" width="40"/>` : '-'),
          },
        ],
      })
      $(dtInstance.current.buttons().nodes()).addClass('btn btn-sm btn-outline-primary me-1 mb-1')

      /* Daftarkan 1x listener Edit / Delete */
      const $tbl = $(tableRef.current)
      $tbl.on('click', '.btn-delete', async (e) => {
        const id = $(e.currentTarget).data('id')
        if (window.confirm('Delete this Product?')) {
          await backendProduct.delete(`/products/delete/${id}`)
          await refreshTable()
        }
      })
      $tbl.on('click', '.btn-edit', (e) => {
        const row = JSON.parse($(e.currentTarget).attr('data-row'))
        handleOpenModal('edit', row)
      })
    } else {
      /* jika DT sudah ada → update datanya */
      dtInstance.current.clear().rows.add(tableData).draw(false)
    }
  }, [tableData])
  /* ---------- render ---------- */
  return (
    <>
      <CRow>
        <CCol xs={90}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Semi Product List</strong>
              <CButton
                className="fw-bold text-white"
                color="success"
                size="sm"
                onClick={() => handleOpenModal('add')}
              >
                + Add Product
              </CButton>
            </CCardHeader>
            <CCardBody>
              <div className="table-responsive">
                <table
                  ref={tableRef}
                  className="table table-striped table-bordered align-middle"
                  style={{ width: '100%' }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ---------- MODAL ---------- */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>{modalMode === 'add' ? 'Add Product' : 'Edit Product'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {/* SAP Code */}
            <CRow className="mb-3">
              <CFormLabel className="col-sm-3 col-form-label">SAP Code</CFormLabel>
              <CCol sm={9}>
                <CFormInput name="sapCode" value={formData.sapCode} onChange={handleInputChange} />
              </CCol>
            </CRow>

            {/* Product Name */}
            <CRow className="mb-3">
              <CFormLabel className="col-sm-3 col-form-label">Product Name</CFormLabel>
              <CCol sm={9}>
                <CFormInput
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>

            {/* UOM */}
            <CRow className="mb-3">
              <CFormLabel className="col-sm-3 col-form-label">Unit</CFormLabel>
              <CCol sm={9}>
                <CFormSelect name="uom" value={formData.uom} onChange={handleInputChange}>
                  <option value="">Select UOM</option>
                  {uomData.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            {/* Product Type */}
            <CRow className="mb-3">
              <CFormLabel className="col-sm-3 col-form-label">Product Type</CFormLabel>
              <CCol sm={9}>
                <CFormSelect
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="raw_material">Raw Material</option>
                  <option value="semi_finished">Semi Finished</option>
                  <option value="finished_good">Finished Good</option>
                </CFormSelect>
              </CCol>
            </CRow>

            {/* Category */}
            <CRow className="mb-3">
              <CFormLabel className="col-sm-3 col-form-label">Category</CFormLabel>
              <CCol sm={9}>
                <CFormSelect
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {catData.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            {/* Aktif View */}
            <CRow className="mb-3">
              <CFormLabel className="col-sm-3 col-form-label">Aktif View</CFormLabel>
              <CCol sm={9}>
                <CFormSelect
                  name="aktifView"
                  value={String(formData.aktifView)}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </CFormSelect>
              </CCol>
            </CRow>

            {/* Image */}
            <CRow className="mb-3">
              <CFormLabel htmlFor="image" className="col-sm-3 col-form-label">
                Image
              </CFormLabel>
              <CCol sm={9}>
                <CFormInput
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Loading...' : 'Save'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default SemiProductPage
