import { getAllCountries, searchCountriesByName, searchCountriesByRegion } from './apiMethods.js';
import { COUNTRY_NAMES_LOCATION, applyNewCountries, initializeAutocompleteList } from './domFunctions.js';
import {
    beforeDocumentUnload as beforeWindowUnload,
    containerScrollListener,
    documentRegionClickListener,
    documentKeypressListener,
    keydownRegionDialogLiElement,
    regionChangeListener,
    regionClickListener,
    regionDialogListener,
    regionKeyboardOpenListener,
    searchNameChangeListener,
} from './eventListeners.js';
import { getPreviousSessionData } from './helpers.js';

export function initializeHomePage() {
    const autoCompleteCallback = requestIdleCallback(initializeAutocompleteList);
    const previous = getPreviousSessionData();

    window.currentSearch = previous.searchName;
    window.currentRegion = previous.region;
    region.value = currentRegion;
    if (region.value) region.classList.add('appear');
    searchName.value = currentSearch;

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
    regionControl.addEventListener('keypress', regionKeyboardOpenListener);
    regionsDialog.addEventListener('click', regionDialogListener);
    regionControl.addEventListener('keydown', (e) => keydownRegionDialogLiElement(e, -1));
    regionsDialog
        .querySelectorAll('li')
        .forEach((el, index) => el.addEventListener('keydown', (e) => keydownRegionDialogLiElement(e, index)));
    searchName.addEventListener('change', searchNameChangeListener);
    document.addEventListener('keypress', documentKeypressListener);
    mainContainer.addEventListener('scroll', containerScrollListener);
    document.addEventListener('click', documentRegionClickListener, { capture: true });
    window.addEventListener('beforeunload', beforeWindowUnload);
}
