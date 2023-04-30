import { PAGE_SIZE } from './apiMethods.js'
import { normalizeText } from './helpers.js'

export function applyNewCountries(newCountries) {
    countries = newCountries
    currentPage = 0
    document.querySelectorAll('.country-card-border').forEach((el) => el.remove())
    newCountries.slice(currentPage, PAGE_SIZE).forEach(createTemplate)
}

export function createTemplate(country) {
    const template = document.getElementById('country-template')
    const main = document.querySelector('.countries')
    //content is a document fragment, it is not equal to the html dom element
    const content = template.content.cloneNode(true)

    const anchor = content.querySelector('a')
    anchor.id = normalizeText(country.name.common)
    anchor.href = `${location.origin}${location.pathname}?country=${anchor.id}`
    anchor.onclick = function (e) {
        e.preventDefault()
        history.pushState(null, '', this.href)
    }
    //image
    const imageFlags = content.querySelectorAll('img')
    imageFlags.forEach((flag) => {
        flag.src = country.flags.png
        flag.alt = country.flags.alt
    })

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

export const COUNTRY_NAMES_LOCATION = 'country-names'
export function initializeAutocompleteList() {
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
