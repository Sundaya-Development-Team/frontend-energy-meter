/* eslint-disable prettier/prettier */
import axios from 'axios'

const QUALITY_SERVICE = import.meta.env.VITE_QUALITY_SERVICE
const PRODUCT = import.meta.env.VITE_PRODUCT
const PARTNER = import.meta.env.VITE_PARTNER
const INCOMING = import.meta.env.VITE_INCOMING
const TRACKEDITEMS = import.meta.env.VITE_TRACKEDITEMS

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
