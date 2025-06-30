/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react'
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
  CRow,
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

const AddProduct = () => {
  const tableRef = useRef(null)
  const dtInstance = useRef(null)
  const [tableData, setTableData] = useState([])
  const [uomData, setUomData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [formData, setFormData] = useState({
    sapCode: '',
    productName: '',
    uom: '',
    productType: '',
    productCategory: '',
    aktifView: '',
    image: 'test.jpg',
  })

  const SAP_OPTIONS = [
    { value: 'SAP1', label: 'SAP1', name: 'Product One' },
    { value: 'SAP2', label: 'SAP2', name: 'Product Two' },
    { value: 'SAP3', label: 'SAP3', name: 'Product Three' },
  ]

  const getAllProduct = async () => {
    console.log('Getting All Product data')
    try {
      const res = await backendProduct.get('/products/all')
      setTableData(res.data.data)
    } catch (err) {
      console.error('Error fetching All Product data', err)
    }
  }

  const getUomData = async () => {
    console.log('Getting UOM data')
    try {
      const res = await backendProduct.get('/uom/all')
      const { data } = res.data
      setUomData(data)
    } catch (error) {
      console.log('Error fetching UOM data', error)
    }
  }

  const getCategoryData = async () => {
    console.log('Getting Category data')
    try {
      const res = await backendProduct.get('/categories/all')
      const { data } = res.data
      setCategoryData(data)
    } catch (error) {
      console.log('Error fetching category data', error)
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Yakin hapus produk?')) return
    try {
      const res = await backendProduct.delete(`/products/delete/${id}`)
      // alert(res.data?.message || 'Produk berhasil dihapus')
      window.location.reload()
      // await getAllProduct()
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target

    // dropdown Aktif View → boolean
    if (name === 'aktifView') {
      return setFormData((p) => ({ ...p, aktifView: value === 'true' }))
    }

    // file input
    if (type === 'file') {
      return setFormData((p) => ({ ...p, image: files[0] }))
    }

    // generic
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handleSapChange = (e) => {
    const code = e.target.value
    const selected = SAP_OPTIONS.find((o) => o.value === code)
    setFormData((p) => ({
      ...p,
      sapCode: code,
      productName: selected ? selected.name : '',
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const required = ['sapCode', 'uom', 'productType', 'productCategory', 'aktifView']
    for (const f of required) {
      if (!formData[f] && formData[f] !== false) {
        return alert(`Field ${f} wajib diisi`)
      }
    }
    // console.log('Form data:', formData)
    // alert(`
    //   SAP Code: ${formData.sapCode}
    //   Product Name: ${formData.productName}
    //   Unit Of Measure: ${formData.uom}
    //   Product Type: ${formData.productType}
    //   Product Category: ${formData.productCategory}
    //   Aktif View: ${formData.aktifView}
    //   Image: ${formData.image}
    //   `)

    const payload = {
      sap_code: formData.sapCode,
      name: formData.productName,
      uom_id: Number(formData.uom),
      category_id: Number(formData.productCategory),
      is_active: formData.aktifView,
      product_type: formData.productType,
      img: formData.image?.name || null,
    }
    try {
      const res = await backendProduct.post('/products/add', payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      alert(res.data?.message || 'Produk berhasil disimpan')
      window.location.reload()
      // await getAllProduct()
      // setFormData((p) => ({ ...p, productName: '' }))
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Terjadi kesalahan saat menyimpan produk'
      alert(`Error : ${msg}`)
      console.error(err)
    }
  }

  useEffect(() => {
    console.log('Component rendered')
    getUomData()
    getCategoryData()
    getAllProduct()
  }, [])

  useEffect(() => {
    if (dtInstance.current || !tableData.length) return // sudah ada atau belum ada data

    const actionCol = {
      title: 'Action',
      data: null,
      orderable: false,
      className: 'text-center',
      render: (_, __, row) => `
        <button class="btn btn-sm btn-warning btn-edit me-1" data-id="${row.id}">
          <i class="cil-pencil">Edit</i>
        </button>
        <button class="btn btn-sm btn-danger btn-delete" data-id="${row.id}">
          <i class="cil-trash">Delete</i>
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
      language: {
        searchPlaceholder: '🔍  Search …',
        info: 'Showing _START_ – _END_ of _TOTAL_ products',
      },
    })

    /* styling tombol */
    $(dtInstance.current.buttons().nodes()).addClass('btn btn-sm btn-outline-primary me-1 mb-1')

    /* listener sekali saja */
    const $table = $(tableRef.current)
    $table.on('click', '.btn-delete', (e) => {
      const id = $(e.currentTarget).data('id')
      deleteProduct(id)
    })
    $table.on('click', '.btn-edit', (e) => {
      const id = $(e.currentTarget).data('id')
      alert(`Edit product id: ${id} (belum di‑implementasi)`)
    })

    return () => {
      $table.off('click')
      dtInstance.current?.destroy(true)
    }
  }, [tableData])

  return (
    <CRow>
      {/* Add Product */}
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add Product</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {/* SAP Code */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="sapCode" className="col-sm-2 col-form-label">
                  SAP Code
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="text"
                    id="sapCode"
                    name="sapCode"
                    value={formData.sapCode}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              {/* Product Name */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="productName" className="col-sm-2 col-form-label">
                  Product Name
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              {/* Unit Of Measure */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="uom" className="col-sm-2 col-form-label">
                  Unit Of Measure
                </CFormLabel>
                <CCol sm={10}>
                  <CFormSelect
                    id="uom"
                    name="uom"
                    value={formData.uom}
                    onChange={handleChange}
                    required
                  >
                    <option value="0">Select Unit Of Measure</option>
                    {uomData.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Product Type */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="productType" className="col-sm-2 col-form-label">
                  Product Type
                </CFormLabel>
                <CCol sm={10}>
                  <CFormSelect
                    id="productType"
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Product Type</option>
                    <option value="raw_material">Raw Material</option>
                    <option value="semi_finished">Semi Finished</option>
                    <option value="finished_good">Finished Good</option>
                    <option value="chemical">Chemical</option>
                    <option value="electrical">Electrical</option>
                    <option value="packaging">Packaging</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Product Category */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="productCategory" className="col-sm-2 col-form-label">
                  Product Category
                </CFormLabel>
                <CCol sm={10}>
                  <CFormSelect
                    id="productCategory"
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Product Category</option>
                    {categoryData.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Aktif View */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="aktifView" className="col-sm-2 col-form-label">
                  Aktif View
                </CFormLabel>
                <CCol sm={10}>
                  <CFormSelect
                    name="aktifView"
                    value={String(formData.aktifView)}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Aktif View</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Image */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="image" className="col-sm-2 col-form-label">
                  Image
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="file" id="image" name="image" onChange={handleChange} />
                </CCol>
              </CRow>

              {/* Submit */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="primary" type="submit">
                  Submit
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      {/* Product List */}
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Product List</strong>
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
  )
}

export default AddProduct
