const API_ENDPOINT = 'https://restcountries.com/v3.1/'
const FIELDS = '?fields=name,capital,region,flags,population'

async function searchCountryByName(name) {
    return (await fetch(`${API_ENDPOINT}name/${name}${FIELDS}`)).json()
}

async function searchCountryByRegion(region) {
    return (await fetch(`${API_ENDPOINT}region/${region}${FIELDS}`)).json()
}
async function getAllCountries() {
    return (await fetch(`${API_ENDPOINT}all${FIELDS}`)).json()
}

getAllCountries().then(console.log)
