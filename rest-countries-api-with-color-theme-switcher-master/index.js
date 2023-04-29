import { getAllCountries } from './scripts/apiMethods.js'
import { COUNTRY_NAMES_LOCATION, applyNewCountries, initializeAutocompleteList } from './scripts/domFunctions.js'
import {
    containerScrollListener,
    documentKeypressListener,
    regionChangeListener,
    regionClickListener,
    searchNameChangeListener,
} from './scripts/eventListeners.js'

window.countries = []
window.currentPage = 0
window.currentSearch
window.currentRegion
window.countryContainer = document.getElementsByTagName('main')[0]
window.regionControl = document.getElementById('region-control')
window.regionsDialog = document.getElementById('region-dropdown')

//initial
initializeAutocompleteList()
getAllCountries()
    .then((allCountries) => {
        localStorage.setItem(COUNTRY_NAMES_LOCATION, JSON.stringify(allCountries.map((c) => c.name.common)))
        initializeAutocompleteList()
        return allCountries
    })
    .then(applyNewCountries)

region.addEventListener('change', regionChangeListener)
regionControl.addEventListener('click', regionClickListener)
searchName.addEventListener('change', searchNameChangeListener)
document.addEventListener('keypress', documentKeypressListener)
countryContainer.addEventListener('scroll', containerScrollListener)
