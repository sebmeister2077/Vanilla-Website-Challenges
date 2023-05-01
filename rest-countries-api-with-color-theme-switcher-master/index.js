import { searchCountriesByName } from './src/apiMethods.js';
import { createSingleTemplate } from './src/domFunctions.js';
import { getUrlParams } from './src/helpers.js';
import { initializeHomePage } from './src/initializers.js';

window.countries = [];
window.currentPage = 0;
window.currentSearch = '';
window.currentRegion = '';
window.appBar = document.querySelector('.appbar');
window.mainContainer = document.getElementsByTagName('main')[0];
window.countryContainer = document.querySelector('.countries');
window.regionControl = document.getElementById('region-control');
window.regionsDialog = document.getElementById('region-dropdown');

//initial

const urlParams = getUrlParams();
const isHomePage = !urlParams.has('country');

if (isHomePage) {
    initializeHomePage();
} else {
    requestIdleCallback(initializeHomePage);
    searchCountriesByName(urlParams.get('country')).then((res) => {
        if (!res.length) {
            console.log('no country found!');
            return;
        }
        createSingleTemplate(res[0]);
    });
}
