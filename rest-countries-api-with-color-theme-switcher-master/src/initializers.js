import { getAllCountries } from './apiMethods.js';
import { COUNTRY_NAMES_LOCATION, applyNewCountries, initializeAutocompleteList } from './domFunctions.js';
import {
    containerScrollListener,
    documentClickListener,
    documentKeypressListener,
    regionChangeListener,
    regionClickListener,
    regionDialogListener,
    searchNameChangeListener,
} from './eventListeners.js';

export function initializeHomePage(isHomePage) {
    const autoCompleteCallback = requestIdleCallback(initializeAutocompleteList);
    getAllCountries().then((allCountries) => {
        localStorage.setItem(COUNTRY_NAMES_LOCATION, JSON.stringify(allCountries.map((c) => c.name.common)));
        cancelIdleCallback(autoCompleteCallback);
        requestIdleCallback(initializeAutocompleteList);
        applyNewCountries(allCountries);
    });

    region.addEventListener('change', regionChangeListener);
    regionControl.addEventListener('click', regionClickListener);
    regionsDialog.addEventListener('click', regionDialogListener);
    searchName.addEventListener('change', searchNameChangeListener);
    document.addEventListener('keypress', documentKeypressListener);
    mainContainer.addEventListener('scroll', containerScrollListener);
    document.addEventListener('click', documentClickListener);
}
