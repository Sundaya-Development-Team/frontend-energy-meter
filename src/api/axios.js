import axios from 'axios'

const QUALITY_SERVICE = import.meta.env.VITE_QUALITY_SERVICE
const UPLOADFILE = import.meta.env.VITE_UPLOAD
const VITE_MASTER_DATA = import.meta.env.VITE_MASTER_DATA
const VITE_RECEIVING = import.meta.env.VITE_RECEIVING
const PARTNER = import.meta.env.VITE_PARTNER
const INCOMING = import.meta.env.VITE_INCOMING
const TRACKEDITEMS = import.meta.env.VITE_TRACKEDITEMS
const AQL = import.meta.env.VITE_AQL
const WAREHOUSE = import.meta.env.VITE_WAREHOUSE

const BASE_SERVER = import.meta.env.VITE_SERVER
const VITE_SERVER_DATA = import.meta.env.VITE_SERVER_DATA

// export const backendQualityService = axios.create({
//   baseURL: `${BASE_SERVER}/v1/quality-service`,
// })

// export const backendUploadFile = axios.create({
//   baseURL: `${BASE_SERVER}/v1/upload-service`,
// })

// export const backendProduct = axios.create({
//   baseURL: `${BASE_SERVER}/v1/products`,
// })

//Master Data
export const backendProduct = axios.create({
  baseURL: `${VITE_SERVER_DATA}/api/v2/master-data/products`,
})

export const backendSupplier = axios.create({
  baseURL: `${VITE_SERVER_DATA}/api/v2/master-data/suppliers`,
})

export const backendProductTypes = axios.create({
  baseURL: `${VITE_SERVER_DATA}/api/v2/master-data/product-types`,
})

//Receiving
export const backendReceiving = axios.create({
  baseURL: `${VITE_SERVER_DATA}/api/v2/receiving`,
})

export const backendTracking = axios.create({
  baseURL: `${VITE_SERVER_DATA}/api/v2/tracking`,
})

//QC

export const backendQc = axios.create({
  baseURL: `${VITE_SERVER_DATA}/api/v1/quality-service`,
})

//Warehouse
export const backendWh = axios.create({
  baseURL: `${VITE_SERVER_DATA}/api/v2/warehouse`,
})

//Generate Serial number
export const backendGenerate = axios.create({
  baseURL: `${VITE_SERVER_DATA}/api/v2/serial-numbers`,
})

// export const backendPartner = axios.create({
//   baseURL: `${BASE_SERVER}/v1/partner`,
// })

export const backendIncoming = axios.create({
  baseURL: `${BASE_SERVER}/v1/receiving-products`,
})

export const backendTrackedItems = axios.create({
  baseURL: `${BASE_SERVER}/v1/tracked-items`,
})

export const backendAql = axios.create({
  baseURL: `${BASE_SERVER}/v1/aql`,
})

export const backendWarehouse = axios.create({
  baseURL: `${BASE_SERVER}/v1/warehouses`,
})

export const backendQualityService = axios.create({
  baseURL: QUALITY_SERVICE,
})

export const backendUploadFile = axios.create({
  baseURL: UPLOADFILE,
})

// export const backendProduct = axios.create({
//   baseURL: PRODUCT,
// })

export const backendPartner = axios.create({
  baseURL: PARTNER,
})

// export const backendIncoming = axios.create({
//   baseURL: INCOMING,
// })

// export const backendTrackedItems = axios.create({
//   baseURL: TRACKEDITEMS,
// })

// export const backendAql = axios.create({
//   baseURL: AQL,
// })

// export const backendWarehouse = axios.create({
//   baseURL: WAREHOUSE,
// })
