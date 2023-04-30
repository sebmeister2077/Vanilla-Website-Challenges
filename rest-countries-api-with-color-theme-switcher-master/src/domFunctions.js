import { PAGE_SIZE } from './apiMethods.js';
import { normalizeText } from './helpers.js';

export function applyNewCountries(newCountries) {
    countries = newCountries;
    currentPage = 0;
    document.querySelectorAll('.country-card-border').forEach((el) => el.remove());
    newCountries.slice(currentPage, PAGE_SIZE).forEach(createCardTemplate);
}

export function createCardTemplate(country) {
    const template = document.getElementById('country-template');
    const main = document.querySelector('.countries');
    //content is a document fragment, it is not equal to the html dom element
    const content = template.content.cloneNode(true);

    const anchor = content.querySelector('a');
    anchor.id = normalizeText(country.name.common);
    anchor.href = `${location.origin}${location.pathname}?country=${anchor.id}`;
    anchor.onclick = function (e) {
        e.preventDefault();
        history.pushState(null, '', this.href);
        createSingleTemplate(country);
    };
    //image
    const imageFlags = content.querySelectorAll('img');
    imageFlags.forEach((flag) => {
        flag.src = country.flags.png;
        flag.alt = country.flags.alt;
    });

    //name
    const name = content.querySelector('.country-name');
    name.innerText = country.name.common;

    //population
    setValueForLabel(content, '#population-', country.name.common, country.population);

    //region
    setValueForLabel(content, '#region-', country.name.common, country.population);

    //capital
    setValueForLabel(content, '#capital-', country.name.common, country.capital[0]);

    main.append(content);
}

function setValueForLabel(content, id, idSuffix, givenValue) {
    const value = content.querySelector(id);
    const label = value.previousElementSibling;
    const newId = value.id + idSuffix;
    label.htmlFor = newId;
    value.id = newId;
    value.innerText = givenValue;
}

export const COUNTRY_NAMES_LOCATION = 'country-names';
export function initializeAutocompleteList() {
    if (countryNamesList.children.length) return;
    const countryNames = localStorage.getItem(COUNTRY_NAMES_LOCATION);
    if (!countryNames) return;
    let parsedNames;
    try {
        parsedNames = JSON.parse(countryNames);
    } catch {
        return;
    }
    parsedNames.forEach((name) => {
        const option = document.createElement('option');
        //copied from chatgpt but works
        option.value = normalizeText(name);
        countryNamesList.append(option);
    });
}

export function createSingleTemplate(country) {
    const template = document.getElementById('single-country');
    //content is a document fragment, it is not equal to the html dom element
    const content = template.content.cloneNode(true);

    const anchor = content.querySelector('a');
    anchor.href = `${location.origin}${location.pathname}`;
    anchor.onclick = function (e) {
        e.preventDefault();
        history.pushState(null, '', this.href);
        appBar.classList.remove('fade');
        document.querySelector('.single-country').remove();
    };
    //image
    const imageFlags = content.querySelectorAll('img');
    imageFlags.forEach((flag) => {
        flag.src = country.flags.png;
        flag.alt = country.flags.alt;
    });

    //name
    const name = content.querySelector('.country-name');
    name.innerText = country.name.common;

    const nativeName = country.name.nativeName[Object.keys(country.name.nativeName)[0]].common;
    createSpecific(content, `single-country-${nativeName}`, nativeName, 'Native Name');

    createSpecific(
        content,
        `single-country-${country.population}`,
        new Intl.NumberFormat(undefined, { notation: 'compact' }).format(country.population),
        'Population'
    );
    createSpecific(content, `single-country-${country.region}`, country.region, 'Region');
    createSpecific(content, `single-country-${country.subregion}`, country.subregion, 'Sub Region');
    createSpecific(content, `single-country-${country.capital.join(', ')}`, country.capital.join(','), 'Capital');
    createSpecific(content, `single-country-${country.tld.join(', ')}`, country.tld.join(','), 'Top Level Domain');

    const currencies = Object.keys(country.currencies)
        .map((k) => country.currencies[k].name)
        .join(', ');
    createSpecific(content, `single-country-${currencies}`, currencies, 'Currencies');
    const languages = Object.keys(country.languages)
        .map((k) => country.languages[k])
        .join(', ');
    createSpecific(content, `single-country-${languages}`, languages, 'Languages');

    const bordersContainer = content.querySelector('.border-countries');
    if (!country.borders.length) bordersContainer.append(createCard('None'));
    country.borders.forEach((border) => {
        bordersContainer.append(createCard(border));
    });
    main.append(content);
}
function createSpecific(content, id, value, label) {
    const countrySpecificsContainer = content.querySelector('.country-specifics');
    const countrySpecificTemplate = content.getElementById('country-specific');
    const specific = countrySpecificTemplate.content.cloneNode(true);
    const specificLabel = specific.querySelector('label');
    specificLabel.for = id;
    specificLabel.innerText = label + ':';
    const specifivValue = specific.querySelector('span');
    specifivValue.innerText = value;
    specifivValue.id = id;
    countrySpecificsContainer.append(specific);
}

function createCard(text) {
    const span = document.createElement('span');
    span.innerText = text;
    span.classList.add('card');
    return span;
}
