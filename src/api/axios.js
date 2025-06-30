/* eslint-disable prettier/prettier */
import axios from 'axios'

const QUALITY_SERVICE = import.meta.env.VITE_QUALITY_SERVICE
const PRODUCT = import.meta.env.VITE_PRODUCT

// console.log("baseURL_BE = " + urlBackendTicket);
export const backendQualityService = axios.create({
  baseURL: QUALITY_SERVICE,
})

export const backendProduct = axios.create({
  baseURL: PRODUCT,
})
