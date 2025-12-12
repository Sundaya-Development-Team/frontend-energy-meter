import React, { lazy } from 'react'
import PrivateRoutes from './PrivateRoutes'

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'))
const Dashboard = lazy(() => import('./views/dashboard/Dashboard'))

//Receiving
const PurchaseOrder = React.lazy(() => import('./views/receiving/PurchaseOrder'))
const ReceivingHeader = React.lazy(() => import('./views/receiving/ReceivingHeader'))
const ReceivingList = React.lazy(() => import('./views/receiving/ReceivingList'))
const ReceivingDetail = React.lazy(() => import('./views/receiving/ReceivingDetail'))
const ReceivingNonSerialList = React.lazy(() => import('./views/receiving/ReceivingNonSerialList'))

//QC Receiving
const ReceivingSerialQc = React.lazy(() => import('./views/receiving/ReceivingSerialQc'))
const DetailNonSerialQc = React.lazy(() => import('./views/receiving/DetailNonSerialQc'))

//Tracking
const TrackingList = React.lazy(() => import('./views/tracking/TrackingList'))
const TrackingDetail = React.lazy(() => import('./views/tracking/TrackingDetail'))
const TrackingFinalProduct = React.lazy(() => import('./views/tracking/TrackingFinalProduct'))

//QCProd
const ProdQcSerialAql = React.lazy(() => import('./views/production/formqc/ProdQcSerialAql'))
const ProdQcSerialNoAql = React.lazy(() => import('./views/production/formqc/ProdQcSerialNoAql'))
const ProdQcRepair = React.lazy(() => import('./views/production/formqc/RepairQc'))

//QCPerformance
const PerformaceSampling = React.lazy(() => import('./views/performance/ScanSamplingPerformance'))
const QCPerformanceAql = React.lazy(() => import('./views/performance/QcPerformanceAql'))

// Assembly
const PlnOrder = React.lazy(() => import('./views/production/assembly/PlnOrder'))
const AssemblyOrder = React.lazy(() => import('./views/production/assembly/AssemblyOrder'))
const AssemblySerialList = React.lazy(
  () => import('./views/production/assembly/AssemblySerialList'),
)
const MatchingAssemblyPcbSerial = React.lazy(
  () => import('./views/production/assembly/MatchingAssemblyPcb'),
)
const ValidateAssemblySerial = React.lazy(
  () => import('./views/production/assembly/ValidateAssemblySerial'),
)

//Shipping
const ShippingHeader = React.lazy(() => import('./views/shipping/ShippingHeader'))

//Aging
const ScanBeforeAging = React.lazy(() => import('./views/production/agingtest/ScanBeforeAging'))

//Finishing
const ScanBeforeClearZero = React.lazy(
  () => import('./views/production/finishing/ScanBeforeClearZero'),
)
const QCClearZero = React.lazy(() => import('./views/production/finishing/QCClearZero'))
const ScanAfterZeroClear = React.lazy(
  () => import('./views/production/finishing/ScanAfterClearZero'),
)
const SidePlnSerial = React.lazy(() => import('./views/production/plnserial/SidePlnSerial'))
const PlnSerialComparator = React.lazy(
  () => import('./views/production/finishing/PlnSerialComparator'),
)
const PrintLaser = React.lazy(() => import('./views/production/finishing/PrintLaser'))
const GenerateBoxSerial = React.lazy(() => import('./views/production/finishing/GenerateBoxSerial'))

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
          'QC_RECEIVING',
          'ADMIN',
          'PRODUKSI_ELEKTRONIK:SOLDER_RELAY',
          'PRODUKSI_ELEKTRONIK:SOLDER_PAPAN_TOMBOL',
          'PRODUKSI_ELEKTRONIK:PASANG_COVER',
          'PRODUKSI_ELEKTRONIK:TEST_ON',
          'PIC_HIPOT',
          'PIC_CHAMBER',
          'GUDANG_ELEKTRONIK',
          'GUDANG_NON_ELEKTRONIK',
          'PO_RECEIVING',
          'QC_SUB_ASSEMBLY',
          'QC_ASSEMBLY',
          'ON_TEST',
          'HIPOT_TEST',
          'TEST_BENCH1',
          'ULTRA_SONIC',
          'QC_REF_METER',
          'TEST_BENCH2',
          'AGING_TEST',
          'LASER_PRINT',
          'QC_COVER',
          'GENERATE_BOX',
        ]}
      >
        <DefaultLayout>
          <Dashboard />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  //Receiving
  { 
    path: '/receiving', 
    name: 'Receiving',
    element: (
      <PrivateRoutes requiredPermission={['ADMIN', 'PO_RECEIVING']}>
        <DefaultLayout>
          <ReceivingList />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/receiving/purchaseOrder',
    name: 'Purchase Order',
    element: (
      <PrivateRoutes requiredPermission={['ADMIN', 'PO_RECEIVING']}>
        <DefaultLayout>
          <PurchaseOrder />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/receiving/receivingHeader',
    name: 'Receving Header',
    element: (
      <PrivateRoutes requiredPermission={['ADMIN', 'PO_RECEIVING']}>
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
      <PrivateRoutes requiredPermission={['ADMIN', 'PO_RECEIVING']}>
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
      <PrivateRoutes requiredPermission={['ADMIN', 'PO_RECEIVING']}>
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
      <PrivateRoutes requiredPermission={['ADMIN', 'QC_RECEIVING']}>
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
      <PrivateRoutes requiredPermission={['ADMIN', 'QC_RECEIVING']}>
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
      <PrivateRoutes requiredPermission={['ADMIN', 'QC_RECEIVING']}>
        <DefaultLayout>
          <DetailNonSerialQc />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  //Tracking
  { 
    path: '/tracking', 
    name: 'Tracking',
    element: (
      <PrivateRoutes requiredPermission={['ADMIN', 'QC_RECEIVING']}>
        <DefaultLayout>
          <TrackingList />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/tracking/list',
    name: 'Tracking Product List',
    element: (
      <PrivateRoutes requiredPermission={['ADMIN',
      'PO_RECEIVING',
      'QC_RECEIVING',
      'QC_SUB_ASSEMBLY',
      'QC_ASSEMBLY',
      'ON_TEST',
      'HIPOT_TEST',
      'PIC_HIPOT',
      'TEST_BENCH1',
      'ULTRA_SONIC',
      'QC_REF_METER',
      'TEST_BENCH2',
      'AGING_TEST',
      'LASER_PRINT',
      'QC_COVER']}>
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
      <PrivateRoutes requiredPermission={['ADMIN',
      'PO_RECEIVING',
      'QC_RECEIVING',
      'QC_SUB_ASSEMBLY',
      'QC_ASSEMBLY',
      'ON_TEST',
      'HIPOT_TEST',
      'PIC_HIPOT',
      'TEST_BENCH1',
      'ULTRA_SONIC',
      'QC_REF_METER',
      'TEST_BENCH2',
      'AGING_TEST',
      'LASER_PRINT',
      'QC_COVER']}>
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
      <PrivateRoutes requiredPermission={['ADMIN', 'QC_RECEIVING']}>
        <DefaultLayout>
          <TrackingFinalProduct />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  //Production
  { 
    path: '/production', 
    name: 'Production',
    element: (
      <PrivateRoutes
        requiredPermission={[
          'QC_RECEIVING',
          'ADMIN',
          'PRODUKSI_ELEKTRONIK:SOLDER_RELAY',
          'PRODUKSI_ELEKTRONIK:SOLDER_PAPAN_TOMBOL',
          'PRODUKSI_ELEKTRONIK:PASANG_COVER',
          'PRODUKSI_ELEKTRONIK:TEST_ON',
          'PIC_HIPOT',
          'PIC_CHAMBER',
          'GUDANG_ELEKTRONIK',
          'GUDANG_NON_ELEKTRONIK',
          'PO_RECEIVING',
          'QC_SUB_ASSEMBLY',
          'QC_ASSEMBLY',
          'ON_TEST',
          'HIPOT_TEST',
          'TEST_BENCH1',
          'ULTRA_SONIC',
          'QC_REF_METER',
          'TEST_BENCH2',
          'AGING_TEST',
          'LASER_PRINT',
          'QC_COVER',
          'GENERATE_BOX',
        ]}
      >
        <DefaultLayout>
          <Dashboard />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },

  //Producrion - Assembly
  { 
    path: '/production/assembly', 
    name: 'Assembly',
    element: (
      <PrivateRoutes
        requiredPermission={[
          'ADMIN',
          'SPV_QC',
          'QC_SUB_ASSEMBLY',
          'QC_ASSEMBLY',
          'ON_TEST',
          'HIPOT_TEST',
          'TEST_BENCH1',
          'ULTRA_SONIC',
          'QC_REF_METER',
          'TEST_BENCH2',
          'AGING_TEST',
          'LASER_PRINT',
          'QC_COVER',
          'GENERATE_BOX',
        ]}
      >
        <DefaultLayout>
          <Dashboard />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/production/assembly/plnorder',
    name: 'Create PLN Order',
    element: (
      <PrivateRoutes requiredPermission={['ADMIN']}>
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
      <PrivateRoutes requiredPermission={['ADMIN']}>
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
      <PrivateRoutes requiredPermission={['ADMIN', 'QC_SUB_ASSEMBLY']}>
        <DefaultLayout>
          <AssemblySerialList />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/production/assembly/validateAssemblySerial',
    name: 'Validate Serial',
    element: (
      <PrivateRoutes requiredPermission={['ADMIN', 'QC_ASSEMBLY']}>
        <DefaultLayout>
          <ValidateAssemblySerial />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/production/assembly/matchingassypcb',
    name: 'Matching Assy & PCB Serial',
    element: (
      <PrivateRoutes requiredPermission={['ADMIN', 'QC_ASSEMBLY']}>
        <DefaultLayout>
          <MatchingAssemblyPcbSerial />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },

  //QC Production Aql Serial
  { path: '/production/serialaql', name: '' },
  {
    path: '/production/serialaql/:qcIdParams/:qcNameParams/:qcPlaceParams',
    name: '',
    element: (
      <PrivateRoutes requiredPermission={['ADMIN']}>
        <DefaultLayout>
          <ProdQcSerialAql />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },

  //QC Production No Aql Serial
  { path: '/production/serialnoaql', name: 'QC Serial No AQL' },
  {
    path: '/production/serialnoaql/:qcIdParams/:qcNameParams/:qcPlaceParams',
    name: '',
    element: (
      <PrivateRoutes
        requiredPermission={[
          'ADMIN',
          'ON_TEST',
          'QC_SUB_ASSEMBLY',
          'QC_ASSEMBLY',
          'HIPOT_TEST',
          'PIC_HIPOT',
          'TEST_BENCH1',
          'ULTRA_SONIC',
          'QC_REF_METER',
          'TEST_BENCH2',
          'AGING_TEST',
          'LASER_PRINT',
          'QC_COVER',
          'QC_RECEIVING',
        ]}
      >
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
      <PrivateRoutes requiredPermission={['ADMIN']}>
        <DefaultLayout>
          <ScanBeforeAging />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  //PLN Serial
  { path: '/production/plnserial', name: 'PLN Serial' },
  {
    path: '/production/plnserial/scansidepln',
    name: 'SCAN PLN & Production Barcode',
    element: (
      <PrivateRoutes requiredPermission={['ADMIN']}>
        <DefaultLayout>
          <SidePlnSerial />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  //Finishing Assembly
  { path: '/production/finishing', name: 'Finishing' },
  {
    path: '/production/finishing/printlaser/:qcIdParams/:postNameParams/:qcPlaceParams',
    name: 'Print Laser',
    element: (
      <PrivateRoutes requiredPermission={['ADMIN','LASER_PRINT','LASER_PRINT1','LASER_PRINT2']}>
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
      <PrivateRoutes requiredPermission={['ADMIN']}>
        <DefaultLayout>
          <PlnSerialComparator />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: '/production/finishing/generateboxserial',
    name: 'Generate Box Serial',
    element: (
      <PrivateRoutes requiredPermission={['ADMIN']}>
        <DefaultLayout>
          <GenerateBoxSerial />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  { path: '/performance', name: 'Performance' , element: (
    <PrivateRoutes
        requiredPermission={[
          'ADMIN',
          'ON_TEST',
          'QC_SUB_ASSEMBLY',
          'QC_ASSEMBLY',
          'HIPOT_TEST',
          'PIC_HIPOT',
          'TEST_BENCH1',
          'ULTRA_SONIC',
          'QC_REF_METER',
          'TEST_BENCH2',
          'AGING_TEST',
          'LASER_PRINT',
          'QC_COVER',
          'QC_RECEIVING',
        ]}
      >
      <DefaultLayout>
        <Dashboard />
      </DefaultLayout>
    </PrivateRoutes>
  ) },
  { path: '/performance/:qcIdParams/:qcNameParams/:qcPlaceParams', name: 'Qc Performance', element: (
    <PrivateRoutes requiredPermission={['ADMIN']}>
      <DefaultLayout>
        <QCPerformanceAql />
      </DefaultLayout>
    </PrivateRoutes>
  ) },
  { path: '/performance/sampling', name: 'Sampling', element: (
    <PrivateRoutes
        requiredPermission={[
          'ADMIN',
          'ON_TEST',
          'QC_SUB_ASSEMBLY',
          'QC_ASSEMBLY',
          'HIPOT_TEST',
          'PIC_HIPOT',
          'TEST_BENCH1',
          'ULTRA_SONIC',
          'QC_REF_METER',
          'TEST_BENCH2',
          'AGING_TEST',
          'LASER_PRINT',
          'QC_COVER',
          'QC_RECEIVING',
        ]}
      >
      <DefaultLayout>
        <Dashboard />
      </DefaultLayout>
    </PrivateRoutes>
  ) },
  { path: '/performance/sampling/:qcIdParams/:qcNameParams/:qcPlaceParams', name: 'Sampling Unit', element: (
    <PrivateRoutes requiredPermission={['ADMIN']}>
      <DefaultLayout>
        <PerformaceSampling />
      </DefaultLayout>
    </PrivateRoutes>
  ) },
  
  { path: '/repair', name: 'Repair' },
  {
    path: '/repair/:qcIdParams/:qcNameParams/:qcPlaceParams',
    name: '',
    element: (
      <PrivateRoutes requiredPermission={['ADMIN']}>
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
      <PrivateRoutes requiredPermission={['ADMIN']}>
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
      <PrivateRoutes requiredPermission={['ADMIN']}>
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
      <PrivateRoutes requiredPermission={['ADMIN','GUDANG_ELEKTRONIK', 'GUDANG_NON_ELEKTRONIK']}>
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
      <PrivateRoutes requiredPermission={['ADMIN','GUDANG_ELEKTRONIK', 'GUDANG_NON_ELEKTRONIK']}>
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
      <PrivateRoutes requiredPermission={['ADMIN','GUDANG_ELEKTRONIK', 'GUDANG_NON_ELEKTRONIK']}>
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
      <PrivateRoutes requiredPermission={['ADMIN','GUDANG_ELEKTRONIK', 'GUDANG_NON_ELEKTRONIK']}>
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
      <PrivateRoutes requiredPermission={['ADMIN','GUDANG_ELEKTRONIK', 'GUDANG_NON_ELEKTRONIK']}>
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
      <PrivateRoutes requiredPermission={['ADMIN','GUDANG_ELEKTRONIK', 'GUDANG_NON_ELEKTRONIK']}>
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
      <PrivateRoutes requiredPermission={['ADMIN']}>
        <DefaultLayout>
          <GeneratePlnSerial />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
  //Shipping
  { path: '/shipping', name: 'Shipping' },
  {
    path: '/shipping/shippingorder',
    name: 'Shipping Order',
    element: (
      <PrivateRoutes requiredPermission={['ADMIN']}>
        <DefaultLayout>
          <ShippingHeader />
        </DefaultLayout>
      </PrivateRoutes>
    ),
  },
]

export default routes
