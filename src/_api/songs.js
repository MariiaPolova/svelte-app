import * as api from './api'

export function getSongsList (title, sortProp) {
  return api.get(`/songs/search`, {titleOrArtist: title, sortProp})
}

export function getSubscriptionsBySongID (id, isExpired) {
  return api.get(`/songs/${id}`, {expired: isExpired})
}