import * as api from './api'

export function getInvoicesById (param) {
  return api.get(`/invoices/${param}`)
}
