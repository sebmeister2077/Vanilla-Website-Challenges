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

getAllCountries().then((countries) => {
    console.log(countries[0])
    countries.slice(0, 10).forEach(createTemplate)
})

function createTemplate(country) {
    const template = document.getElementById('country-template')
    const main = document.getElementsByTagName('main')[0]
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
