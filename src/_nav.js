import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBarcode,
  cilBell,
  cilCalculator,
  cilChartLine,
  cilChartPie,
  cilCheckAlt,
  cilCog,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilFactory,
  cilGroup,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilShareBoxed,
  cilSpeedometer,
  cilSpreadsheet,
  cilStar,
  cilStorage,
  cilTag,
  cilTask,
  cilTruck,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    permissions: ['DASHBOARD', 'QC_ENGINEER'],
  },
  {
    component: CNavTitle,
    name: 'Receiving Products',
  },
  {
    component: CNavItem,
    name: 'Purchase Order',
    to: '/receiving/purchaseOrder',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Receiving Products',
    to: '/receiving/receivingHeader',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    permissions: ['QC_ENGINEER', 'WAREHOUSE_ADMIN'], // multi permission bisa akses
  },
  {
    component: CNavItem,
    name: 'Receiving List',
    to: '/receiving/receivingList',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Receiving Serial QC',
    to: '/receiving/receivingserialqc',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Non Serial QC List',
    to: '/receiving/receivingnonseriallist',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Tracking',
  },
  {
    component: CNavItem,
    name: 'Tracking Production List',
    to: '/tracking/list',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tracking Final Product',
    to: '/tracking/finalproduct',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Production',
  },

  {
    component: CNavGroup,
    name: 'Assembly',
    to: '/production/assembly',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Create PLN Order',
        to: '/production/assembly/plnorder',
      },
      {
        component: CNavItem,
        name: 'Req. Assembly Order',
        to: '/production/assembly/assemblyorder',
      },
      {
        component: CNavItem,
        name: 'Assembly Serial List',
        to: '/production/assembly/assemblyseriallist',
      },
      {
        component: CNavItem,
        name: 'Scan Before',
        to: '/production/assembly/before',
      },
      // {
      //   component: CNavItem,
      //   name: 'Quality Control',
      //   to: '/production/assembly/qc',
      // },
      {
        component: CNavItem,
        name: 'QC Assembly',
        to: '/production/serialnoaql/QC-AT003/Assembly',
      },
      // {
      //   component: CNavItem,
      //   name: 'Scan After',
      //   to: '/production/assembly/after',
      // },
    ],
  },

  {
    component: CNavGroup,
    name: 'On Test',
    to: '/production/on',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    items: [
      // {
      //   component: CNavItem,
      //   name: 'Scan Before',
      //   to: '/production/on/before',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Quality Control',
      //   to: '/production/on/qc',
      // },
      {
        component: CNavItem,
        name: 'QC Test ON',
        to: '/production/serialnoaql/QC-OT004/Test ON',
      },

      // {
      //   component: CNavItem,
      //   name: 'Scan After',
      //   to: '/production/on/after',
      // },
    ],
  },
  {
    component: CNavGroup,
    name: 'Hipot Test',
    to: '/production/hipot',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    items: [
      // {
      //   component: CNavItem,
      //   name: 'Scan Before',
      //   to: '/production/hipot/before',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Quality Control',
      //   to: '/production/hipot/qc',
      // },
      {
        component: CNavItem,
        name: 'QC Hipot Test',
        to: '/production/serialnoaql/QC-HT005/Hipot Test',
      },
      // {
      //   component: CNavItem,
      //   name: 'Scan After',
      //   to: '/production/hipot/after',
      // },
    ],
  },
  {
    component: CNavGroup,
    name: 'Calibration & Ultrasonic',
    to: '/production/calibration',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    items: [
      // {
      //   component: CNavItem,
      //   name: 'Scan Before',
      //   to: '/production/calibration/before',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Quality Control',
      //   to: '/production/calibration/qc',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Scan After',
      //   to: '/production/calibration/after',
      // },
      {
        component: CNavItem,
        name: 'QC Calibration 1',
        to: '/production/serialnoaql/QC-CT006/Calibration 1 Test',
      },
      {
        component: CNavItem,
        name: 'QC Ultrasonic',
        to: '/production/serialnoaql/QC-U015/Ultrasonic Test',
      },
      {
        component: CNavItem,
        name: 'QC Calibration 2',
        to: '/production/serialnoaql/QC-CT2014/Calibration 2 Test',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Aging Test',
    to: '/production/aging',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    items: [
      // {
      //   component: CNavItem,
      //   name: 'Batching',
      //   to: '/production/aging/batching',
      // },
      {
        component: CNavItem,
        name: 'Scan Before',
        to: '/production/aging/before',
      },
      // {
      //   component: CNavItem,
      //   name: 'Quality Control',
      //   to: '/production/aging/qc',
      // },
      {
        component: CNavItem,
        name: 'QC Aging',
        to: '/production/serialaql/QC-AT007/Aging',
      },
      // {
      //   component: CNavItem,
      //   name: 'Scan After',
      //   to: '/production/aging/after',
      // },
    ],
  },
  {
    component: CNavGroup,
    name: 'Ref. Meter',
    to: '/production/refmeter',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'QC Ref. Meter',
        to: '/production/serialnoaql/QC-RM013/QC Ref. Meter',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Finishing',
    to: '/production/finishing/clearzero',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'SCAN PLN Serial',
        to: '/production/finishing/scansidepln',
      },
      {
        component: CNavItem,
        name: 'Print Laser Post 1',
        to: '/production/finishing/printlaser/post1',
      },
      {
        component: CNavItem,
        name: 'Print Laser Post 2',
        to: '/production/finishing/printlaser/post2',
      },
      {
        component: CNavItem,
        name: 'Matching PLN Serial',
        to: '/production/finishing/comparePlnSerial',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Repair',
  },
  {
    component: CNavItem,
    name: 'QC Repair',
    to: '/repair/QC-R015/QC Repair',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Master Data',
  },
  {
    component: CNavItem,
    name: 'Master Product',
    to: '/masterdata/product',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Master Supplier',
    to: '/masterdata/supplier',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Warehouse',
  },
  {
    component: CNavItem,
    name: 'Acc. Assembly Order',
    to: '/warehouse/outgoing/assemblyorder',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'WH Stock (Opname)',
    to: '/warehouse/stock/warehouseStock',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'WH Data Master',
    to: '/warehouse/warehouseMaster',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Req. Receiving to WH',
    to: '/warehouse/receivingwhrequest',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Req. Assembly to WH',
    to: '/warehouse/assemblywhrequest',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Serial Stock Confirm',
    to: '/warehouse/serialstockconfirm',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },

  // {
  //   component: CNavTitle,
  //   name: 'Delivery',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Packing',
  //   to: '/delivery/packing',
  //   icon: <CIcon icon={cilShareBoxed} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Scan Packing 1',
  //       to: '/delivery/packing/before',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Scan Packing 2',
  //       to: '/delivery/packing/after',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Scan',
  //   to: '/delivery/scan',
  //   icon: <CIcon icon={cilBarcode} customClassName="nav-icon" />,
  // },
  {
    component: CNavTitle,
    name: 'Admins',
  },
  {
    component: CNavItem,
    name: 'Generate PLN Serial',
    to: '/admin/generate/plnserial',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Confirm Lassered Serial',
  //   to: '/admin/generate/confirmlassered',
  //   icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
]

export default _nav
