const API_ENDPOINT = 'https://restcountries.com/v3.1/'
const FIELDS = '?fields=name,capital,region,flags,population'
const PAGE_SIZE = calculatePageSize()
const COUNTRY_NAMES_LOCATION = 'country-names'

let countries = []
let currentPage = 0
const countryContainer = document.getElementsByTagName('main')[0]
//initial
initializeAutocompleteList()
const { state } = history
if ((!state?.region || state?.region === 'global') && !state?.name)
    getAllCountries()
        .then((allCountries) => {
            localStorage.setItem(COUNTRY_NAMES_LOCATION, JSON.stringify(allCountries.map((c) => c.name.common)))
            initializeAutocompleteList()
            return allCountries
        })
        .then(applyNewCountries)
if (state?.region && state?.region !== 'global') {
    region.value = state.region
    searchCountriesByRegion(state.region).then(applyNewCountries)
}
if (state?.name) {
    searchName.value = state.name
    searchCountriesByName(state.name).then(applyNewCountries)
}
region.addEventListener('change', function () {
    const newRegion = this.value
    searchName.value = ''
    history.replaceState({ name: null, region: newRegion }, '')
    searchCountriesByRegion(newRegion).then(applyNewCountries)
})

var searchNameTimeout
var searchNameAbort
searchName.addEventListener('change', function () {
    const newName = this.value.trim()
    if (searchNameTimeout) clearTimeout(searchNameTimeout)
    searchNameAbort?.abort()
    searchNameAbort = new AbortController()
    searchNameTimeout = setTimeout(() => {
        region.value = 'global'
        history.replaceState({ region: null, name: newName }, '')
        if (newName) searchCountriesByName(newName, searchNameAbort.signal).then(applyNewCountries)
        else getAllCountries().then(applyNewCountries)
        searchNameTimeout = null
        searchNameAbort = null
    }, 1000)
})

countryContainer.addEventListener('scroll', function (e) {
    const OFFSET = 300 //pixels
    const { scrollHeight, scrollTop, clientHeight } = this
    if (scrollTop >= clientHeight) document.querySelector('.go-to-top').classList.add('show')
    else document.querySelector('.go-to-top').classList.remove('show')

    const isScrolledToBottom = scrollHeight - scrollTop <= clientHeight + OFFSET
    if (!isScrolledToBottom) return

    const noMoreCountries = countries.length / PAGE_SIZE <= currentPage + 1
    if (noMoreCountries) {
        console.log('No more countries')
        return
    }
    currentPage++
    countries.slice(currentPage, currentPage * PAGE_SIZE).forEach(createTemplate)
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
    countries = newCountries
    currentPage = 0
    document.querySelectorAll('.country').forEach((el) => el.remove())
    newCountries.slice(currentPage, PAGE_SIZE).forEach(createTemplate)
}

function createTemplate(country) {
    const template = document.getElementById('country-template')
    const main = document.querySelector('.countries')
    //content is a document fragment, it is not equal to the html dom element
    const content = template.content.cloneNode(true)

    const anchor = content.querySelector('a')
    anchor.id = normalizeText(country.name.common)
    anchor.href = `#${anchor.id}`
    anchor.onclick = (e) => {
        e.preventDefault()
        history.pushState({ searchName: searchName.value, region: region.value }, '', anchor.href)
    }
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

function initializeAutocompleteList() {
    if (countryNamesList.children.length) return
    const countryNames = localStorage.getItem(COUNTRY_NAMES_LOCATION)
    if (!countryNames) return
    let parsedNames
    try {
        parsedNames = JSON.parse(countryNames)
    } catch {
        return
    }
    parsedNames.forEach((name) => {
        const option = document.createElement('option')
        //copied from chatgpt but works
        option.value = normalizeText(name)
        countryNamesList.append(option)
    })
}

function normalizeText(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function calculatePageSize() {
    const { innerHeight, innerWidth } = window
    const APPROXIMATE_COUNTRY_WIDTH = 300,
        APPROXIMATE_COUNTRY_HEIGHT = 300
    return Math.round((innerWidth * innerHeight) / (APPROXIMATE_COUNTRY_WIDTH * APPROXIMATE_COUNTRY_HEIGHT) + 2)
}
