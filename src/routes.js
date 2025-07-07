import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Admin
const Incoming = React.lazy(() => import('./views/admins/incoming/IncomingPage'))
const Product = React.lazy(() => import('./views/admins/product/ProductPage'))
const DynamicQuestionForm = React.lazy(() => import('./views/admins/DynamicQuestionForm'))
const Partner = React.lazy(() => import('./views/admins/partner/PartnerPage'))
const SemiProductPage = React.lazy(() => import('./views/admins/trackeditems/SemiProductPage'))

// Semi Production
const IncomingUnit = React.lazy(() => import('./views/semiproduction/IncomingUnit'))
const PraQC = React.lazy(() => import('./views/semiproduction/PraQC'))
const QCUnits = React.lazy(() => import('./views/semiproduction/QCUnits'))
const ReportQCUnit = React.lazy(() => import('./views/semiproduction/ReportQCUnit'))

//Production
const BatchingProduction = React.lazy(() => import('./views/production/BatchingProduction'))

// Assemble
const ScanBeforeAssemble = React.lazy(
  () => import('./views/production/assemble/ScanBeforeAssemble'),
)
const QCAssemble = React.lazy(() => import('./views/production/assemble/QCAssemble'))
const ScanAfterAssemble = React.lazy(() => import('./views/production/assemble/ScanAfterAssemble'))

// On
const ScanBeforeOn = React.lazy(() => import('./views/production/ontest/ScanBeforeOn'))
const ScanAfterOn = React.lazy(() => import('./views/production/ontest/ScanAfterOn'))

// Hipot
const ScanBeforeHipot = React.lazy(() => import('./views/production/hipottest/ScanBeforeHipot'))
const ScanAfterHipot = React.lazy(() => import('./views/production/hipottest/ScanAfterHipot'))

// Calibration
const ScanBeforeCalibration = React.lazy(
  () => import('./views/production/calibrationtest/ScanBeforeCalibration'),
)
const ScanAfterCalibration = React.lazy(
  () => import('./views/production/calibrationtest/ScanAfterCalibration'),
)

// Aging
const BatchingAging = React.lazy(() => import('./views/production/agingtest/BatchingAging'))
const ScanBeforeAging = React.lazy(() => import('./views/production/agingtest/ScanBeforeAging'))
const ScanAfterAging = React.lazy(() => import('./views/production/agingtest/ScanAfterAging'))

// Clear Zero
const ScanBeforeClearZero = React.lazy(
  () => import('./views/production/clearzero/ScanBeforeClearZero'),
)
const ScanAfterZeroClear = React.lazy(
  () => import('./views/production/clearzero/ScanAfterClearZero'),
)

// Closing Cover
const ScanBeforeClosingCover = React.lazy(
  () => import('./views/production/closingcover/ScanBeforeClosingCover'),
)
const ScanAfterClosingCover = React.lazy(
  () => import('./views/production/closingcover/ScanAfterClosingCover'),
)

// Inventory
const IncomingUnits = React.lazy(() => import('./views/production/inventory/IncomingUnits'))

// Delivery
const ScanAfterPacking = React.lazy(() => import('./views/delivery/ScanAfterPacking'))
const ScanBeforePacking = React.lazy(() => import('./views/delivery/ScanBeforePacking'))
const ScanDelivery = React.lazy(() => import('./views/delivery/ScanDelivery'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/admin', name: 'Admin', element: DynamicQuestionForm, exact: true },
  { path: '/admin/dynamicquestion', name: 'Dynamic Question', element: DynamicQuestionForm },
  { path: '/admin/incoming', name: 'Admin Incoming', element: Incoming },
  { path: '/admin/partner', name: 'Admin Partner', element: Partner },
  { path: '/admin/product', name: 'Admin Product', element: Product },
  { path: '/admin/semiproduct', name: 'Admin Semi Product', element: SemiProductPage },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/delivery', name: 'Delivery', element: ScanBeforePacking, exact: true },
  { path: '/delivery/packing/after', name: 'Delivery Packing After', element: ScanAfterPacking },
  { path: '/delivery/packing/before', name: 'Delivery Packing Before', element: ScanBeforePacking },
  { path: '/delivery/scan', name: 'Scan Delivery', element: ScanDelivery },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/inventory', name: 'Inventory', element: IncomingUnits },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/production', name: 'Production', element: IncomingUnit, exact: true },
  { path: '/production/batch', name: 'Batching Production', element: BatchingProduction },
  {
    path: '/production/assemble',
    name: 'Assemble Production',
    element: ScanBeforeAssemble,
    exact: true,
  },
  {
    path: '/production/assemble/after',
    name: 'Scan After Assemble',
    element: ScanAfterAssemble,
  },
  {
    path: '/production/assemble/before',
    name: 'Scan Before Assemble',
    element: ScanBeforeAssemble,
  },
  {
    path: '/production/assemble/qc',
    name: 'Quality Control Assemble',
    element: QCAssemble,
  },
  {
    path: '/production/aging',
    name: 'Aging Test',
    element: ScanBeforeAging,
    exact: true,
  },
  {
    path: '/production/aging/after',
    name: 'Scan After Aging Test',
    element: ScanAfterAging,
  },
  {
    path: '/production/aging/batching',
    name: 'Batching Aging Test',
    element: BatchingAging,
  },
  {
    path: '/production/aging/before',
    name: 'Scan Before Aging Test',
    element: ScanBeforeAging,
  },
  {
    path: '/production/calibration',
    name: 'Calibration Testing',
    element: ScanBeforeCalibration,
    exact: true,
  },
  {
    path: '/production/calibration/after',
    name: 'Scan After Calibration Testing',
    element: ScanAfterCalibration,
  },
  {
    path: '/production/calibration/before',
    name: 'Scan Before Calibration Testing',
    element: ScanBeforeCalibration,
  },
  {
    path: '/production/clearzero',
    name: 'Clear Zero',
    element: ScanBeforeClearZero,
    exact: true,
  },
  {
    path: '/production/clearzero/after',
    name: 'Scan After Clear Zero',
    element: ScanAfterZeroClear,
  },
  {
    path: '/production/clearzero/before',
    name: 'Scan Before Clear Zero',
    element: ScanBeforeClearZero,
  },
  {
    path: '/production/closingcover',
    name: 'Closing Cover',
    element: ScanBeforeClosingCover,
    exact: true,
  },
  {
    path: '/production/closingcover/after',
    name: 'Scan After Closing Cover',
    element: ScanAfterClosingCover,
  },
  {
    path: '/production/closingcover/before',
    name: 'Scan Before Closing Cover',
    element: ScanBeforeClosingCover,
  },
  {
    path: '/production/hipot',
    name: 'Hipot Testing',
    element: ScanBeforeHipot,
    exact: true,
  },
  {
    path: '/production/hipot/after',
    name: 'Scan After Hipot Testing',
    element: ScanAfterHipot,
  },
  {
    path: '/production/hipot/before',
    name: 'Scan Before Hipot Testing',
    element: ScanBeforeHipot,
  },
  {
    path: '/production/on',
    name: 'On Test',
    element: ScanBeforeOn,
    exact: true,
  },
  {
    path: '/production/on/after',
    name: 'Scan After On',
    element: ScanAfterOn,
  },
  {
    path: '/production/on/before',
    name: 'Scan Before On',
    element: ScanBeforeOn,
  },
  { path: '/semiproduction', name: 'Semi Production', element: BatchingProduction, exact: true },
  { path: '/semiproduction/praqc', name: 'Pra-QC Semi Product', element: PraQC },
  { path: '/semiproduction/incoming', name: 'Incoming Semi Product', element: IncomingUnit },
  { path: '/semiproduction/qcunits', name: 'QC Semi Product', element: QCUnits },
  { path: '/semiproduction/reportqcunit', name: 'Report QC Semi Product', element: ReportQCUnit },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
