import { calculatePageSize } from './helpers.js'

const API_ENDPOINT = 'https://restcountries.com/v3.1/'
const FIELDS = '?fields=name,capital,region,flags,population'
const PAGE_SIZE = calculatePageSize()

async function searchCountriesByName(name, signal) {
    const result = await fetch(`${API_ENDPOINT}name/${name}${FIELDS}`, { signal })
    if (result.status === 404) return []
    return await result.json()
}

async function searchCountriesByRegion(region) {
    return (await fetch(`${API_ENDPOINT}region/${region}${FIELDS}`)).json()
}
async function getAllCountries() {
    return (await fetch(`${API_ENDPOINT}all${FIELDS}`)).json()
}

export { PAGE_SIZE, getAllCountries, searchCountriesByName, searchCountriesByRegion }
