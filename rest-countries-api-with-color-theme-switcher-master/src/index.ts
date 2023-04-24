import { Country } from './Country'

const API_ENDPOINT = 'https://restcountries.com/v3.1/'
const FIELDS = '?fields=name,capital,region,flags,population'

async function searchCountryByName(name: string) {
    return (await fetch(`${API_ENDPOINT}name/${name}${FIELDS}`)).json()
}

async function searchCountryByRegion(region: string) {
    return (await fetch(`${API_ENDPOINT}region/${region}${FIELDS}`)).json()
}
async function getAllCountries() {
    return (await fetch(`${API_ENDPOINT}all${FIELDS}`)).json()
}

getAllCountries().then((countries) => {
    console.log(countries[0])
    createTemplate(countries[0])
})

function createTemplate(country: Country) {
    const template = document.getElementById('country-template') as HTMLTemplateElement
    const content = template.content.cloneNode(true)
}
