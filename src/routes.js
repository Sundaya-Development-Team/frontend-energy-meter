import React, { lazy } from 'react'
import PrivateRoutes from './PrivateRoutes'

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'))
const Dashboard = lazy(() => import('./views/dashboard/Dashboard'))

//Receiving
const PurchaseOrder = React.lazy(() => import('./views/receiving/PurchaseOrder'))
const ReceivingHeader = React.lazy(() => import('./views/receiving/ReceivingHeader'))
const ReceivingList = React.lazy(() => import('./views/receiving/ReceivingList'))
const ReceivingDetail = React.lazy(() => import('./views/receiving/ReceivingDetail'))
const ReceivingNonSerialList = React.lazy(
  () => import('./views/receiving/ReceivingNonSerialList.js'),
)
//QC Receiving
const ReceivingSerialQc = React.lazy(() => import('./views/receiving/ReceivingSerialQc'))
const DetailNonSerialQc = React.lazy(() => import('./views/receiving/DetailNonSerialQc.js'))

//Tracking
const TrackingList = React.lazy(() => import('./views/tracking/TrackingList'))
const TrackingDetail = React.lazy(() => import('./views/tracking/TrackingDetail'))
const TrackingFinalProduct = React.lazy(() => import('./views/tracking/TrackingFinalProduct'))

//QCProd
const ProdQcSerialAql = React.lazy(() => import('./views/production/formqc/ProdQcSerialAql.js'))
const ProdQcSerialNoAql = React.lazy(() => import('./views/production/formqc/ProdQcSerialNoAql.js'))
const ProdQcRepair = React.lazy(() => import('./views/production/formqc/RepairQc.js'))

// Assembly
const PlnOrder = React.lazy(() => import('./views/production/assembly/PlnOrder.js'))
const AssemblyOrder = React.lazy(() => import('./views/production/assembly/AssemblyOrder.js'))
const AssemblySerialList = React.lazy(
  () => import('./views/production/assembly/AssemblySerialList.js'),
)
const ScanBeforeAssembly = React.lazy(
  () => import('./views/production/assembly/ScanBeforeAssembly.js'),
)

//Aging
const ScanBeforeAging = React.lazy(() => import('./views/production/agingtest/ScanBeforeAging'))

//Finishing
const ScanBeforeClearZero = React.lazy(
  () => import('./views/production/finishing/ScanBeforeClearZero'),
)
const QCClearZero = React.lazy(() => import('./views/production/finishing/QCClearZero'))
const ScanAfterZeroClear = React.lazy(
  () => import('./views/production/finishing/ScanAfterClearZero.js'),
)
const SidePlnSerial = React.lazy(() => import('./views/production/finishing/SidePlnSerial'))
const PlnSerialComparator = React.lazy(
  () => import('./views/production/finishing/PlnSerialComparator'),
)
const PrintLaser = React.lazy(() => import('./views/production/finishing/PrintLaser'))

//Master Data
//Master Product
const Product = React.lazy(() => import('./views/admins/product/ProductPage'))

//MAster Supplier
const Supplier = React.lazy(() => import('./views/admins/supplier/SupplierPage'))

// Warehouse
const AssemblyOrderConfirmation = React.lazy(
  () => import('./views/warehouse/AssemblyOrderConfirmation'),
)
const WarehouseStock = React.lazy(() => import('./views/warehouse/WarehouseStock'))
const WarehouseMaster = React.lazy(() => import('./views/warehouse/WarehouseMaster'))
const ReceivingWhRequest = React.lazy(() => import('./views/warehouse/ReceivingWhRequest'))
const AssemblyWhRequest = React.lazy(() => import('./views/warehouse/AssemblyWhRequest'))
const SerialStockConfirm = React.lazy(() => import('./views/warehouse/SerialStockConfirm'))

//Admin Generate Serial PLN
const GeneratePlnSerial = React.lazy(() => import('./views/admins/generate/GeneratePlnSerial'))

const routes = [
  //Dashboard
  {
    path: '/dashboard',
    element: (
      <PrivateRoutes
        requiredPermission={[
          'QC_ENGINEER',
          'ADMIN',
          'SPV_QC',
          'PRODUKSI_ELEKTRONIK:SOLDER_RELAY',
          'PRODUKSI_ELEKTRONIK:SOLDER_PAPAN_TOMBOL',
          'PRODUKSI_ELEKTRONIK:PASANG_COVER',
          'PRODUKSI_ELEKTRONIK:TEST_ON',
          'PIC_HIPOT',
          'PIC_CHAMBER',
          'GUDANG_ELEKTRONIK',
          'GUDANG_NON_ELEKTRONIK',
        ]}
      >
        <DefaultLayout>
          <Dashboard />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  //Reciving
  { path: '/receiving', name: 'Receiving' },
  {
    path: '/receiving/purchaseOrder',
    name: 'Purchase Order',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <PurchaseOrder />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/receiving/receivingHeader',
    name: 'Receving Header213',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <ReceivingHeader />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/receiving/receivingList',
    name: 'Receiving List',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <ReceivingList />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/receiving/receivingDetail/:receivingHeaderId',
    name: 'Receiving Detail',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <ReceivingDetail />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/receiving/receivingserialqc',
    name: 'Receiving Serial QC',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <ReceivingSerialQc />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/receiving/receivingnonseriallist',
    name: 'Non Serial QC List',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <ReceivingNonSerialList />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/receiving/detailnonserialqc/:trackingId',
    name: 'Reciving Non Serial Detail',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <DetailNonSerialQc />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  //Tracking
  { path: '/tracking', name: 'Tracking' },
  {
    path: '/tracking/list',
    name: 'Tracking Product List',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <TrackingList />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/tracking/detail/:trackingId',
    name: 'Tracking Detail',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <TrackingDetail />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/tracking/finalproduct',
    name: 'Tracking Final Product',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <TrackingFinalProduct />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  //Production
  { path: '/production', name: 'Production' },

  //Producrion - Assembly
  { path: '/production/assembly', name: 'Assembly' },
  {
    path: '/production/assembly/plnorder',
    name: 'Create PLN Order',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <PlnOrder />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/production/assembly/assemblyorder',
    name: 'Req. Assembly Order',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <AssemblyOrder />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/production/assembly/assemblyseriallist',
    name: 'Assembly Serial List',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <AssemblySerialList />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/production/assembly/before',
    name: 'Scan Before',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <ScanBeforeAssembly />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },

  //QC Production Aql Serial
  { path: '/production/serialaql', name: '' },
  {
    path: '/production/serialaql/:qcIdParams/:qcNameParams',
    name: 'Scan Before',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <ProdQcSerialAql />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  //QC Production No Aql Serial
  { path: '/production/serialnoaql', name: 'QC Serial No AQL' },
  {
    path: '/production/serialnoaql/:qcIdParams/:qcNameParams',
    name: '',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <ProdQcSerialNoAql />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/production/serialnoaql/:qcIdParams/:qcNameParams',
    name: '',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <ProdQcSerialNoAql />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  { path: '/production/aging', name: 'Aging Test' },
  {
    path: '/production/aging/before',
    name: 'Scan Before Aging Test',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <ScanBeforeAging />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  //Finishing Assembly
  { path: '/production/finishing', name: 'Finishing' },
  {
    path: '/production/finishing/scansidepln',
    name: 'SCAN PLN & Production Barcode',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <SidePlnSerial />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/production/finishing/printlaser/post1',
    name: 'Post 1',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <PrintLaser />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/production/finishing/printlaser/post2',
    name: 'Post 2',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <PrintLaser />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/production/finishing/comparePlnSerial',
    name: 'Check Side & Cover Serial',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <PlnSerialComparator />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  { path: '/repair', name: 'Repair' },
  {
    path: '/repair/:qcIdParams/:qcNameParams',
    name: '',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <ProdQcRepair />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  //Master Data
  { path: '/masterdata', name: 'Master Data' },
  //Product
  {
    path: '/masterdata/product',
    name: 'Product',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <Product />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  //Supplier
  {
    path: '/masterdata/supplier',
    name: 'Supplier',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <Supplier />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },

  //Warehouse
  { path: '/warehouse', name: 'Warehouse' },

  //Warehouse Outgoing
  { path: '/warehouse/outgoing', name: 'Outgoing' },
  {
    path: '/warehouse/outgoing/assemblyorder',
    name: 'Acc. Assembly order',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <AssemblyOrderConfirmation />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },

  //Warehouse Stock
  { path: '/warehouse/stock', name: 'Stock' },
  {
    path: '/warehouse/stock/warehouseStock',
    name: 'Stock Opname',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <WarehouseStock />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/warehouse/warehouseMaster',
    name: 'Warehouse Data Master',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <WarehouseMaster />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/warehouse/receivingwhrequest',
    name: 'Receiving to WH Request List',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <ReceivingWhRequest />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/warehouse/assemblywhrequest',
    name: 'Assembly to WH Request',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <AssemblyWhRequest />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/warehouse/serialstockconfirm',
    name: 'Assembly Order Confirmation',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <SerialStockConfirm />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  //Admin
  { path: '/admin', name: 'Admin' },
  //Generate
  { path: '/admin/generate', name: 'Generate' },
  {
    path: '/admin/generate/plnserial',
    name: 'Geneare PLN Serial',
    element: (
      <PrivateRoutes requiredPermission={['SPV_QC', 'ADMIN']}>
        <DefaultLayout>
          <GeneratePlnSerial />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
]

export default routes
