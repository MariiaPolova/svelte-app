import * as api from './api'

export function getContinentsList () {
  return api.get(`/radiostations/continents`);
}

// *** zero value params will be omited on the back end ***
export function getRegionsList (continentId = 0) {
  return api.get(`/radiostations/regions`, { continent: continentId });
}

export function getCountriesList (regionId = 0) {
  return api.get(`/radiostations/countries`,  { region: regionId });
}

export function getCitiesList (countryId = 0) {
  return api.get(`/radiostations/cities`, { country: countryId });
}

// *** city param is obligatory for the radiostations search ***
export function getradiostationsByFilters (cityId, countryId) {
  return api.get(`/radiostations/radiostationsByFilters`, { city: cityId, country: countryId });
}