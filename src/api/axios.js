/* eslint-disable prettier/prettier */
import axios from 'axios'

const urlBackendTicket = process.env.REACT_APP_TICKET_URL_BACKEND
const urlBackendSite = process.env.REACT_APP_SITE_URL_BACKEND

// console.log("baseURL_BE = " + urlBackendTicket);
export const backendTicket = axios.create({
  baseURL: urlBackendTicket,
})
export const backendSite = axios.create({
  baseURL: urlBackendSite,
})
