import * as api from './api'

export function getAccountInfoByEmail (email) {
  return api.get(`/users`, {email})
}

export function getAccountInfoByAccountCode (accountCode) {
  console.log('accountCode', accountCode);
  return api.get(`/users/${accountCode}`)
}