/* eslint-disable prettier/prettier */
import axios from 'axios'

const QUALITY_SERVICE = import.meta.env.VITE_QUALITY_SERVICE
const PRODUCT = import.meta.env.VITE_PRODUCT
const PARTNER = import.meta.env.VITE_PARTNER
const INCOMING = import.meta.env.VITE_INCOMING
const TRACKEDITEMS = import.meta.env.VITE_TRACKEDITEMS
const UPLOADFILE = import.meta.env.VITE_UPLOAD
const AQL = import.meta.env.VITE_AQL

// console.log("baseURL_BE = " + urlBackendTicket);
export const backendQualityService = axios.create({
  baseURL: QUALITY_SERVICE,
})

export const backendProduct = axios.create({
  baseURL: PRODUCT,
})

export const backendPartner = axios.create({
  baseURL: PARTNER,
})

export const backendIncoming = axios.create({
  baseURL: INCOMING,
})

export const backendTrackedItems = axios.create({
  baseURL: TRACKEDITEMS,
})

export const backendUploadFile = axios.create({
  baseURL: UPLOADFILE,
})

export const backendAql = axios.create({
  baseURL: AQL,
})
