import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBarcode,
  cilBell,
  cilCalculator,
  cilCart,
  cilChartLine,
  cilChartPie,
  cilCheckAlt,
  cilCheckCircle,
  cilClipboard,
  cilCog,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilFactory,
  cilFindInPage,
  cilFlipToBack,
  cilGroup,
  cilHistory,
  cilInbox,
  cilIndustry,
  cilLayers,
  cilLibrary,
  cilList,
  cilLocationPin,
  cilMediaPlay,
  cilNotes,
  cilPencil,
  cilPrint,
  cilPuzzle,
  cilReload,
  cilScreenDesktop,
  cilSettings,
  cilShareBoxed,
  cilShieldAlt,
  cilSpeedometer,
  cilSpreadsheet,
  cilStar,
  cilStorage,
  cilSync,
  cilTag,
  cilTask,
  cilTransfer,
  cilTruck,
  cilWc,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    permissions: [
      'DASHBOARD',
      'ADMIN',
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
      'QC_COVER',
      'GENERATE_BOX',
    ],
  },

  // Receiving Products
  {
    component: CNavTitle,
    name: 'Receiving Products',
    permissions: ['ADMIN', 'PO_RECEIVING'],
  },
  {
    component: CNavItem,
    name: 'Purchase Order',
    to: '/receiving/purchaseOrder',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    permissions: ['ADMIN', 'PO_RECEIVING'],
  },
  {
    component: CNavItem,
    name: 'Receiving Products',
    to: '/receiving/receivingHeader',
    icon: <CIcon icon={cilInbox} customClassName="nav-icon" />,
    permissions: ['ADMIN', 'PO_RECEIVING'], // multi permission bisa akses
  },
  {
    component: CNavItem,
    name: 'Receiving List',
    to: '/receiving/receivingList',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    permissions: ['ADMIN', 'PO_RECEIVING'],
  },
  {
    component: CNavItem,
    name: 'Receiving Serial QC',
    to: '/receiving/receivingserialqc',
    icon: <CIcon icon={cilBarcode} customClassName="nav-icon" />,
    permissions: ['ADMIN', 'QC_RECEIVING'],
  },
  {
    component: CNavItem,
    name: 'Non Serial QC List',
    to: '/receiving/receivingnonseriallist',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    permissions: ['ADMIN', 'QC_RECEIVING'],
  },

  // Tracking
  {
    component: CNavTitle,
    name: 'Tracking',
    permissions: [ 'DASHBOARD',
      'ADMIN',
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
      'QC_COVER',],
  },
  {
    component: CNavItem,
    name: 'Tracking Prod Process',
    to: '/tracking/list',
    icon: <CIcon icon={cilFindInPage} customClassName="nav-icon" />,
    permissions: [ 'DASHBOARD',
      'ADMIN',
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
      'QC_COVER'],
  },
  {
    component: CNavItem,
    name: 'Tracking Final Product',
    to: '/tracking/finalproduct',
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
    permissions: ['ADMIN', 'QC_RECEIVING'],
  },

  // Production
  {
    component: CNavTitle,
    name: 'Production',
    permissions: ['ADMIN',
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
      'GENERATE_BOX',],
  },
  // Assembly
  {
    component: CNavGroup,
    name: 'Assembly',
    to: '/production/assembly',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
    permissions: [
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
    ],
    items: [
      {
        component: CNavItem,
        name: 'Create PLN Order',
        to: '/production/assembly/plnorder',
        permissions: ['ADMIN'],
      },
      {
        component: CNavItem,
        name: 'Req. Assembly Order',
        to: '/production/assembly/assemblyorder',
        permissions: ['ADMIN'],
      },
      {
        component: CNavItem,
        name: 'Assembly Serial List',
        to: '/production/assembly/assemblyseriallist',
        permissions: ['ADMIN', 'QC_SUB_ASSEMBLY'],
      },
      // {
      //   component: CNavItem,
      //   name: 'Validate Assy Serial',
      //   to: '/production/assembly/validateAssemblySerial',
      // },
      {
        component: CNavItem,
        name: 'QC Base Sub Assy',
        to: '/production/serialnoaql/QC-SA002/Base Sub Assy/QC Line 1 Sub Assembly',
        permissions: ['ADMIN', 'QC_SUB_ASSEMBLY'],
      },
      {
        component: CNavItem,
        name: 'Matching Assy & PCB',
        to: '/production/assembly/matchingassypcb',
        permissions: ['ADMIN', 'QC_ASSEMBLY'],
      },
      // {
      //   component: CNavItem,
      //   name: 'Quality Control',
      //   to: '/production/assembly/qc',
      // },
      {
        component: CNavItem,
        name: 'QC Assembly',
        to: '/production/serialnoaql/QC-AT003/Assembly/QC Line 2 Final Assembly',
        permissions: ['ADMIN', 'QC_ASSEMBLY'],
      },
      // {
      //   component: CNavItem,
      //   name: 'Scan After',
      //   to: '/production/assembly/after',
      // },
    ],
  },

  // On Test
  {
    component: CNavGroup,
    name: 'On Test',
    to: '/production/on',
    icon: <CIcon icon={cilMediaPlay} customClassName="nav-icon" />,
    permissions: ['ADMIN', 'ON_TEST'],
    items: [
      {
        component: CNavItem,
        name: 'QC Test ON',
        to: '/production/serialnoaql/QC-OT004/Test ON/QC Line 3 ON Test',
        permissions: ['ADMIN', 'ON_TEST'],
      },
    ],
  },

  // Hipot Test
  {
    component: CNavGroup,
    name: 'Hipot Test',
    to: '/production/hipot',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
    permissions: ['ADMIN', 'HIPOT_TEST','PIC_HIPOT'],
    items: [
      {
        component: CNavItem,
        name: 'QC Hipot Test',
        to: '/production/serialnoaql/QC-HT005/Hipot Test/QC Line 4 HiPot Test',
        permissions: ['ADMIN', 'HIPOT_TEST','PIC_HIPOT'],
      },
    ],
  },

  // Ultrasonic
  {
    component: CNavGroup,
    name: 'Ultrasonic',
    to: '/production/ultrasonic',
    icon: <CIcon icon={cilSync} customClassName="nav-icon" />,
    permissions: ['ADMIN', 'ULTRA_SONIC'],
    items: [
      {
        component: CNavItem,
        name: 'QC Ultrasonic',
        to: '/production/serialnoaql/QC-U015/Ultrasonic Test/QC Line 6 Ultrasonik',
        permissions: ['ADMIN', 'ULTRA_SONIC'],
      },
    ],
  },

  // Ref. Meter
  {
    component: CNavGroup,
    name: 'Ref. Meter',
    to: '/production/refmeter',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    permissions: ['ADMIN',  'QC_REF_METER'],
    items: [
      {
        component: CNavItem,
        name: 'QC Ref. Meter',
        to: '/production/serialnoaql/QC-RM013/QC Ref. Meter/QC Line 7 Referensi Meter',
        permissions: ['ADMIN',  'QC_REF_METER'],
      },
    ],
  },

  // Test Bench 1
  {
    component: CNavGroup,
    name: 'Test Bench 1',
    to: '/production/calibration',
    icon: <CIcon icon={cilScreenDesktop} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'QC Test Bench 1',
        to: '/production/serialnoaql/QC-TB1006/Test Bench 1/QC Line 5 Test Bench 1',
        permissions: ['ADMIN',  'TEST_BENCH1'],
      },
    ],
  },

  // Test Bench 2
  {
    component: CNavGroup,
    name: 'Test Bench 2',
    to: '/production/calibration',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    permissions: ['ADMIN',  'TEST_BENCH2'],
    items: [
      {
        component: CNavItem,
        name: 'QC Test Bench 2',
        to: '/production/serialnoaql/QC-TB2014/Test Bench 2/QC Line 8 Test Bench 2',
        permissions: ['ADMIN',  'TEST_BENCH2'],
      },
    ],
  },

  // Aging Test
  {
    component: CNavGroup,
    name: 'Aging Test',
    to: '/production/aging',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    permissions: ['ADMIN',  'AGING_TEST'],
    items: [
     
      {
        component: CNavItem,
        name: 'Scan Before',
        to: '/production/aging/before',
        permissions: ['ADMIN',  'AGING_TEST'],
      },
      {
        component: CNavItem,
        name: 'QC Aging',
        to: '/production/serialaql/QC-AT007/Aging/QC Line 9 Aging Test',
        permissions: ['ADMIN',  'AGING_TEST'],
      },
     
    ],
  },

  // Matching Assy & PLN
  // {
  //   component: CNavGroup,
  //   name: 'Matching Assy & PLN',
  //   to: '/production/plnserial',
  //   icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Matching Assy & PLN',
  //       to: '/production/plnserial/scansidepln',
  //     },
  //   ],
  // },

  // Laser Print
  {
    component: CNavGroup,
    name: 'Laser Print',
    to: '/production/finishing',
    icon: <CIcon icon={cilPrint} customClassName="nav-icon" />,
    permissions: ['ADMIN',  'LASER_PRINT1','LASER_PRINT2','LASER_PRINT'],
    items: [
      {
        component: CNavItem,
        name: 'Print Laser Post 1',
        to: '/production/finishing/printlaser/QC-LE016-1/Post 1/QC Line 10 Laser Engrave Post 1',
        permissions: ['ADMIN',  'LASER_PRINT1','LASER_PRINT'],
      },
      {
        component: CNavItem,
        name: 'Print Laser Post 2',
        to: '/production/finishing/printlaser/QC-LE016-2/Post 2/QC Line 10 Laser Engrave Post 2',
        permissions: ['ADMIN',  'LASER_PRINT2','LASER_PRINT'],
      },
      // {
      //   component: CNavItem,
      //   name: 'QC Laser & Engraving',
      //   to: '/production/serialnoaql/QC-LE016/QC Laser And Engraving/Qc Laser & Egraving',
      // },
    ],
  },
  {
    component: CNavGroup,
    name: 'Finishing',
    to: '/production/finishing',
    icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
    permissions: ['ADMIN',  'QC_COVER', 'GENERATE_BOX'],
    items: [
      // {
      //   component: CNavItem,
      //   name: 'SCAN PLN Serial',
      //   to: '/production/finishing/scansidepln',
      // },
      {
        component: CNavItem,
        name: 'QC Cover',
        to: '/production/serialnoaql/QC-C001/QC Cover/QC Line 11 Cover',
        permissions: ['ADMIN',  'QC_COVER'],
      },
      {
        component: CNavItem,
        name: 'Generate Box Serial',
        to: '/production/finishing/generateboxserial',
        permissions: ['ADMIN',  'GENERATE_BOX'],
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Performance',
    permissions: ['ADMIN',  'QC_REPAIR'],
  },
  {
    component: CNavItem,
    name: 'Sampling',
    to: '/performance/sampling/QC-PTS001/QC Performance Sampling/QC Line 12 Performance',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    permissions: ['ADMIN'],
    
  },
  {
    component: CNavItem,
    name: 'Performance Test',
    to: '/performance/QC-PT001/QC Performance/QC Line 12 Performance',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    permissions: ['ADMIN'],
    
  },

  {
    component: CNavTitle,
    name: 'Repair',
    permissions: ['ADMIN',  'QC_REPAIR'],
  },
  {
    component: CNavItem,
    name: 'QC Repair',
    to: '/repair/QC-R015/QC Repair/Workshop Repair',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    permissions: ['ADMIN',  'QC_REPAIR'],
    
  },
  {
    component: CNavTitle,
    name: 'Shipping',
    permissions: ['ADMIN'],
  },
  {
    component: CNavItem,
    name: 'Shipping Order',
    to: '/shipping/shippingorder',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    permissions: ['ADMIN'],
  },
  {
    component: CNavTitle,
    name: 'Master Data',
    permissions: ['ADMIN'],
  },
  {
    component: CNavItem,
    name: 'Master Product',
    to: '/masterdata/product',
    icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
    permissions: ['ADMIN'],
  },
  {
    component: CNavItem,
    name: 'Master Supplier',
    to: '/masterdata/supplier',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    permissions: ['ADMIN'],
  },
  {
    component: CNavTitle,
    name: 'Warehouse',
    permissions: ['ADMIN', 'GUDANG_ELEKTRONIK', 'GUDANG_NON_ELEKTRONIK'],
  },
  {
    component: CNavItem,
    name: 'Acc. Assembly Order',
    to: '/warehouse/outgoing/assemblyorder',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
    permissions: ['ADMIN', 'GUDANG_ELEKTRONIK', 'GUDANG_NON_ELEKTRONIK'],
  },
  {
    component: CNavItem,
    name: 'WH Stock (Opname)',
    to: '/warehouse/stock/warehouseStock',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
    permissions: ['ADMIN','GUDANG_ELEKTRONIK', 'GUDANG_NON_ELEKTRONIK'],
  },
  {
    component: CNavItem,
    name: 'WH Data Master',
    to: '/warehouse/warehouseMaster',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
    permissions: ['ADMIN','GUDANG_ELEKTRONIK', 'GUDANG_NON_ELEKTRONIK'],
  },
  {
    component: CNavItem,
    name: 'Req. Receiving to WH',
    to: '/warehouse/receivingwhrequest',
    icon: <CIcon icon={cilTransfer} customClassName="nav-icon" />,
    permissions: ['ADMIN','GUDANG_ELEKTRONIK', 'GUDANG_NON_ELEKTRONIK'],
  },
  {
    component: CNavItem,
    name: 'Req. Assembly to WH',
    to: '/warehouse/assemblywhrequest',
    icon: <CIcon icon={cilTransfer} customClassName="nav-icon" />,
    permissions: ['ADMIN','GUDANG_ELEKTRONIK', 'GUDANG_NON_ELEKTRONIK'],
  },

  {
    component: CNavItem,
    name: 'Serial Stock Confirm',
    to: '/warehouse/serialstockconfirm',
    icon: <CIcon icon={cilCheckAlt} customClassName="nav-icon" />,
    permissions: ['ADMIN','GUDANG_ELEKTRONIK', 'GUDANG_NON_ELEKTRONIK'],
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

  //Admin
  // {
  //   component: CNavTitle,
  //   name: 'Admins',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Generate PLN Serial',
  //   to: '/admin/generate/plnserial',
  //   icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  // },

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
