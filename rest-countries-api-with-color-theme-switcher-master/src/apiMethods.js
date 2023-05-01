import { calculatePageSize } from './helpers.js';

const API_ENDPOINT = 'https://restcountries.com/v3.1/';
const FIELDS = 'fields=name,capital,region,flags,population,subregion,tld,currencies,languages,borders,fifa,cca2,cca3,cioc';
const PAGE_SIZE = calculatePageSize();

async function searchCountriesByName(name, signal) {
    const result = await fetch(`${API_ENDPOINT}name/${name}?${FIELDS}`, { signal });
    if (result.status === 404) return [];
    return await result.json();
}

async function searchCountriesByRegion(region) {
    return (await fetch(`${API_ENDPOINT}region/${region}?${FIELDS}`)).json();
}
async function getAllCountries() {
    return (await fetch(`${API_ENDPOINT}all?${FIELDS}`)).json();
}

async function searchCountryByCode(code) {
    return (await fetch(`${API_ENDPOINT}alpha/${code}?${FIELDS}`)).json();
}

async function searchCountriesByCodes(codes) {
    return (await fetch(`${API_ENDPOINT}alpha?codes=${codes.join(',')}&${FIELDS}`)).json();
}

export {
    PAGE_SIZE,
    getAllCountries,
    searchCountriesByName,
    searchCountriesByRegion,
    searchCountryByCode,
    searchCountriesByCodes,
};
