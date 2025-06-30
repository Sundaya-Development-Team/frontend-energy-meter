/* eslint-disable prettier/prettier */

import React, { useEffect, useRef, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import $ from 'jquery'
import 'datatables.net-bs5'
import 'datatables.net-responsive-bs5'
import 'datatables.net-buttons-bs5'
import 'datatables.net-buttons/js/buttons.html5.js'
import 'datatables.net-buttons/js/buttons.print.js'
import JSZip from 'jszip'
import { backendProduct } from '../../../api/axios'

window.JSZip = JSZip // tombol excel/csv memerlukan JSZip

const ViewProduct = () => {
  const tableRef = useRef(null)
  const [tableData, setTableData] = useState([])

  const getAllProduct = async () => {
    try {
      const res = await backendProduct.get('/products/all')
      setTableData(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const deleteProduct = async (id) => {
    try {
      const res = await backendProduct.delete(`/products/delete/${id}`)
      alert(res.data?.message || 'Produk berhasil dihapus')
    } catch (error) {
      console.error(error)
    }
  }

  /* --------------------------- GET DATA --------------------------- */
  useEffect(() => {
    getAllProduct()
  }, [])

  /* --------------------- DATATABLE INITIALISATION ----------------- */
  useEffect(() => {
    if (!tableData.length) return

    let dt

    // kolom Action ↓
    const actionCol = {
      title: 'Action',
      data: null,
      orderable: false,
      className: 'text-center',
      render: (_, __, row) =>
        `
        <button class="btn btn-sm btn-warning btn-edit me-1" data-id="${row.id}">
          <i class="cil-pencil">Edit</i>
        </button>
        <button class="btn btn-sm btn-danger btn-delete" data-id="${row.id}">
          <i class="cil-trash">Delete</i>
        </button>
        `,
    }

    if ($.fn.dataTable.isDataTable(tableRef.current)) {
      dt = $(tableRef.current).DataTable()
      dt.clear().rows.add(tableData).draw()
    } else {
      dt = $(tableRef.current).DataTable({
        data: tableData,
        responsive: true,
        dom:
          "<'row mb-2'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
          "<'row'<'col-12'tr>>" +
          "<'row mt-2'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>",
        buttons: [
          { extend: 'copyHtml5', text: 'Copy' },
          { extend: 'excelHtml5', text: 'Excel' },
          { extend: 'csvHtml5', text: 'CSV' },
          { extend: 'print', text: 'Print' },
        ],
        columns: [
          { title: 'ID', data: 'id' },
          { title: 'Product Code', data: 'product_code' },
          { title: 'SAP Code', data: 'sap_code' },
          { title: 'Name', data: 'name' },
          { title: 'Unit Of Measure', data: 'uom.name' },
          { title: 'Type', data: 'product_type', className: 'text-capitalize' },
          { title: 'Category', data: 'category.name', className: 'text-capitalize' },
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
            // render: (img) => `<img src="/assets/img/${img}" alt="${img}" width="40" />`,
          },
          actionCol, // ← kolom baru
        ],
        language: {
          searchPlaceholder: '🔍  Search …',
          info: 'Showing _START_ – _END_ of _TOTAL_ products',
        },
      })

      $(dt.buttons().nodes()).addClass('btn btn-sm btn-outline-primary me-1 mb-1')
    }

    /* -------- Event listener untuk Edit / Delete ---------- */
    const $tableElm = $(tableRef.current)

    $tableElm.on('click', '.btn-edit', function () {
      const id = $(this).data('id')
      console.log('edit id:', id)
      // TODO : buka modal edit / navigate ke halaman edit
    })

    $tableElm.on('click', '.btn-delete', function () {
      const id = $(this).data('id')
      if (window.confirm('Delete this product?')) {
        console.log('delete id:', id)
        deleteProduct(id)
        // TODO : panggil API delete lalu refresh data
      }
    })

    return () => {
      $tableElm.off('click') // lepas listener
      if ($.fn.dataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy(true)
      }
    }
  }, [tableData])

  /* ------------------------------- UI ------------------------------ */
  return (
    <CRow>
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

export default ViewProduct
