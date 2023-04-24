

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
    createTemplate(countries[0])
})

function createTemplate(country) {
    const template = document.getElementById('country-template') as HTMLTemplateElement
    const main = document.getElementsByTagName('main')[0]
    const content = template.content.cloneNode(true) 
    const image = content.querySelector('img')
    if (image) {
        image.src = country.flags.png
        image.alt = country.flags.alt
    }

    main.append(content)
}
