import * as api from './api'

export function getsubscriptionsById (param, expired) {
  return api.get(`/subscriptions/${param}`, {expired})
}

export function getPaymentSubscriptionsById (param, state = 'live') {
  return api.get(`/subscriptions/payments`, {accountCode: param, state})
}

export function getDbRecordsById (param) {
  return api.get(`/subscriptions/records`, {accountCode: param})
}

export function getBundleDbRecordsById (param) {
  return api.get(`/subscriptions/bundle-records`, {accountCode: param})
}
