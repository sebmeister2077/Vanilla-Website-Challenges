const API_ENDPOINT = 'https://restcountries.com/v3.1/'
const FIELDS = '?fields=name,capital,region,flags,population'
const PAGE_SIZE = 20

//initial
getAllCountries().then(applyNewCountries)

region.addEventListener('change', function () {
    const newRegion = this.value
    searchCountriesByRegion(newRegion).then(applyNewCountries)
})

var searchNameTimeout
var searchNameAbort
searchName.addEventListener('keypress', function () {
    const newName = this.value.trim()
    console.log(newName)
    if (searchNameTimeout) clearTimeout(searchNameTimeout)
    searchNameAbort?.abort()
    searchNameAbort = new AbortController()
    searchNameTimeout = setTimeout(() => {
        searchCountriesByName(newName, searchNameAbort.signal).then(applyNewCountries)
        searchNameTimeout = null
        searchNameAbort = null
    }, 1000)
})

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

function applyNewCountries(newCountries) {
    document.querySelectorAll('.country').forEach((el) => el.remove())
    newCountries.slice(0, PAGE_SIZE).forEach(createTemplate)
}

function createTemplate(country) {
    const template = document.getElementById('country-template')
    const main = document.querySelector('.countries')
    const content = template.content.cloneNode(true)

    //image
    const image = content.querySelector('img')
    if (image) {
        image.src = country.flags.png
        image.alt = country.flags.alt
    }

    //name
    const name = content.querySelector('.country-name')
    name.innerText = country.name.common

    //population
    setValueForLabel(content, '#population-', country.name.common, country.population)

    //region
    setValueForLabel(content, '#region-', country.name.common, country.population)

    //capital
    setValueForLabel(content, '#capital-', country.name.common, country.capital[0])

    main.append(content)
}

function setValueForLabel(content, id, idSuffix, givenValue) {
    const value = content.querySelector(id)
    const label = value.previousElementSibling
    const newId = value.id + idSuffix
    label.htmlFor = newId
    value.id = newId
    value.innerText = givenValue
}
