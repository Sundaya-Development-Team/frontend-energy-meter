import React, { lazy } from 'react'
import PrivateRoutes from './privateRoutes'

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'))
const Dashboard = lazy(() => import('./views/dashboard/Dashboard'))

//Receiving
const PurchaseOrder = React.lazy(() => import('./views/receiving/PurchaseOrder'))
const ReceivingHeader = React.lazy(() => import('./views/receiving/ReceivingHeader'))
const ReceivingList = React.lazy(() => import('./views/receiving/ReceivingList'))
const ReceivingSerialQc = React.lazy(() => import('./views/receiving/ReceivingSerialQc'))
const ReceivingNonSerialList = React.lazy(
  () => import('./views/receiving/ReceivingNonSerialList.js'),
)
const DetailNonSerialQc = React.lazy(() => import('./views/receiving/DetailNonSerialQc.js'))

//Tracking
const TrackingList = React.lazy(() => import('./views/tracking/TrackingList'))
const TrackingDetail = React.lazy(() => import('./views/tracking/TrackingDetail'))
const TrackingFinalProduct = React.lazy(() => import('./views/tracking/TrackingFinalProduct'))

// Assembly
const PlnOrder = React.lazy(() => import('./views/production/assembly/PlnOrder.js'))
const AssemblyOrder = React.lazy(() => import('./views/production/assembly/AssemblyOrder.js'))

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
]

export default routes
