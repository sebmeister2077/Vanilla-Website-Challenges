import autoAnimate from './node_modules/@formkit/auto-animate/index.mjs'
import { getAllCountries } from './src/apiMethods.js'
import { COUNTRY_NAMES_LOCATION, applyNewCountries, initializeAutocompleteList } from './src/domFunctions.js'
import {
    containerScrollListener,
    documentClickListener,
    documentKeypressListener,
    regionChangeListener,
    regionClickListener,
    regionDialogListener,
    searchNameChangeListener,
} from './src/eventListeners.js'

window.countries = []
window.currentPage = 0
window.currentSearch = ''
window.currentRegion = ''
window.mainContainer = document.getElementsByTagName('main')[0]
window.countryContainer = document.querySelector('.countries')
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

// autoAnimate(countryContainer)
region.addEventListener('change', regionChangeListener)
regionControl.addEventListener('click', regionClickListener)
regionsDialog.addEventListener('click', regionDialogListener)
searchName.addEventListener('change', searchNameChangeListener)
document.addEventListener('keypress', documentKeypressListener)
mainContainer.addEventListener('scroll', containerScrollListener)
document.addEventListener('click', documentClickListener)
