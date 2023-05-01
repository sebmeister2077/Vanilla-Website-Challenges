import { getAllCountries, searchCountriesByName, searchCountriesByRegion } from './apiMethods.js';
import { COUNTRY_NAMES_LOCATION, applyNewCountries, initializeAutocompleteList } from './domFunctions.js';
import {
    beforeDocumentUnload as beforeWindowUnload,
    containerScrollListener,
    documentClickListener,
    documentKeypressListener,
    regionChangeListener,
    regionClickListener,
    regionDialogListener,
    searchNameChangeListener,
} from './eventListeners.js';
import { getPreviousSessionData } from './helpers.js';

export function initializeHomePage() {
    const autoCompleteCallback = requestIdleCallback(initializeAutocompleteList);
    const previous = getPreviousSessionData();

    window.currentSearch = previous.searchName;
    window.currentRegion = previous.region;

    (() => {
        if (currentRegion) return searchCountriesByRegion(currentRegion);
        if (currentSearch) return searchCountriesByName(currentSearch);
        return getAllCountries().then((allCountries) => {
            localStorage.setItem(COUNTRY_NAMES_LOCATION, JSON.stringify(allCountries.map((c) => c.name.common)));
            cancelIdleCallback(autoCompleteCallback);
            requestIdleCallback(initializeAutocompleteList);
            return allCountries;
        });
    })().then(applyNewCountries);

    region.addEventListener('change', regionChangeListener);
    regionControl.addEventListener('click', regionClickListener);
    regionsDialog.addEventListener('click', regionDialogListener);
    searchName.addEventListener('change', searchNameChangeListener);
    document.addEventListener('keypress', documentKeypressListener);
    mainContainer.addEventListener('scroll', containerScrollListener);
    document.addEventListener('click', documentClickListener);
    window.addEventListener('beforeunload', beforeWindowUnload);
}
