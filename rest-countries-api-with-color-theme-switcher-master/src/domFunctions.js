import { PAGE_SIZE, searchCountriesByCodes } from './apiMethods.js';
import { formatNumber, getRGBValuesWithPercentage, normalizeText, throttleFunction } from './helpers.js';

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
    //image
    const imageFlags = content.querySelectorAll('img');
    imageFlags.forEach((flag) => {
        flag.src = country.flags.png;
        flag.alt = country.flags.alt;
    });

    const anchor = content.querySelector('a');
    anchor.id = normalizeText(country.name.common);
    anchor.href = `${location.origin}${location.pathname}?country=${anchor.id}`;
    anchor.onclick = function (e) {
        this.blur();
        e.preventDefault();
        history.pushState(null, '', this.href);
        createSingleTemplate(country, true);
        const root = document.querySelector('.single-country');
        const cardflag = this.parentElement.querySelector('img[data-role=country-flag]');
        const flag = root.querySelector('img');
        const { top: smallTop, left: smallLeft, width: smallWidth, height: smallHeight } = cardflag.getBoundingClientRect();

        //aprox 10-30 ms
        flag.addEventListener('load', function () {
            const { top: bigTop, left: bigLeft, width: bigWidth, height: bigHeight } = flag.getBoundingClientRect();

            const heightRatio = smallHeight / bigHeight;
            const widthRatio = smallWidth / bigWidth;
            //Yea... MATH...
            const transform = `translate(${smallLeft - (bigLeft + ((1 - widthRatio) * bigWidth) / 2)}px,${
                smallTop - (bigTop + ((1 - heightRatio) * bigHeight) / 2)
            }px) scale(${widthRatio},${heightRatio})`;

            flag.style.transform = transform;
            root.style.opacity = 1;
            flag.style['animation-name'] = 'country-flag-animation';
        });
    };

    //name
    const name = content.querySelector('.country-name');
    name.innerText = country.name.common;

    //population
    setValueForLabel(content, '#population-', country.name.common, formatNumber(country.population));

    //region
    setValueForLabel(content, '#region-', country.name.common, country.region);

    //capital
    if (country.capital?.length) setValueForLabel(content, '#capital-', country.name.common, country.capital.join(', '));

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

export function createSingleTemplate(country, isHidden) {
    const template = document.getElementById('single-country');
    //content is a document fragment, it is not equal to the html dom element
    const content = template.content.cloneNode(true);
    const allCurrentFocuableElements = ' :where(header :where(input,#region-control),.countries :where(a,button))';

    requestIdleCallback(() => {
        main.querySelectorAll(allCurrentFocuableElements).forEach((el) => el.setAttribute('tabindex', '-1'));
    });
    requestIdleCallback(scrollToCard);
    function scrollToCard() {
        const cardElement = document.getElementById(country.name.common);
        if (!cardElement) {
            currentPage++;
            countries.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE).forEach(createCardTemplate);
            requestIdleCallback(scrollToCard);
            return;
        }
        cardElement.scrollIntoViewIfNeeded({ block: 'center' });
    }

    if (isHidden) content.querySelector('.single-country').style.opacity = 0;
    const anchor = content.querySelector('a');
    anchor.href = `${location.origin}${location.pathname}`;
    anchor.onclick = function (e) {
        e.preventDefault();
        main.querySelectorAll(allCurrentFocuableElements).forEach((el) => {
            el.setAttribute('tabindex', el.getAttribute('data-tabindex') ?? '0');
        });
        history.pushState(null, '', this.href);
        appBar.classList.remove('fade');
        const cardElement = document.getElementById(normalizeText(country.name.common));
        cardElement.focus();

        const thisCountry = document.querySelector('.single-country');
        thisCountry.style.opacity = 0;
        thisCountry.style['transition-duration'] = '.6s';
        setTimeout(() => thisCountry.remove(), 800);
    };
    //image
    const imageFlag = content.querySelector('img');
    imageFlag.src = country.flags.svg || country.flags.png;
    imageFlag.alt = country.flags.alt;

    getRGBValuesWithPercentage(imageFlag.src).then(console.log);
    //name
    const name = content.querySelector('.country-name');
    name.innerText = country.name.common;

    const nativeName = country.name.nativeName[Object.keys(country.name.nativeName)[0]].common;
    createSpecific(content, `single-country-${nativeName}`, nativeName, 'Native Name');

    createSpecific(content, `single-country-${country.population}`, formatNumber(country.population), 'Population');
    createSpecific(content, `single-country-${country.region}`, country.region, 'Region');
    createSpecific(content, `single-country-${country.subregion}`, country.subregion, 'Sub Region');
    createSpecific(content, `single-country-${country.capital.join(', ')}`, country.capital.join(', '), 'Capital');
    createSpecific(content, `single-country-${country.tld.join(', ')}`, country.tld.join(', '), 'Top Level Domain');

    const currencies = Object.keys(country.currencies)
        .map((k) => country.currencies[k].name)
        .join(', ');
    createSpecific(content, `single-country-${currencies}`, currencies, 'Currencies');
    const languages = Object.keys(country.languages)
        .map((k) => country.languages[k])
        .join(', ');
    createSpecific(content, `single-country-${languages}`, languages, 'Languages');
    const wikiLink = document.createElement('a');
    wikiLink.target = '_blank';
    wikiLink.classList.add('underline', 'font-semibold');
    wikiLink.href = `https://en.wikipedia.org/wiki/${country.name.common}`;
    wikiLink.textContent = 'Read more';
    createSpecific(content, null, wikiLink);
    const bordersContainer = content.querySelector('.border-countries');
    if (!country.borders.length) bordersContainer.append(createCard('None'));
    else {
        const borderElements = country.borders.map((border) => createCard(border, border));
        bordersContainer.append(...borderElements);
        requestIdleCallback(() => {
            searchCountriesByCodes(country.borders).then((resCountries) => {
                window.borders = resCountries;
                borderElements.forEach((el) => {
                    const elCode = el.getAttribute('data-border-code');
                    const correspondingCountry = resCountries.find((c) => [c.fifa, c.cca2, c.cca3, c.cioc].includes(elCode));
                    if (!correspondingCountry) return;
                    el.title = correspondingCountry.name.common;
                    el.href = `${location.origin}${location.pathname}?country=${correspondingCountry.name.common}`;
                    el.onclick = (e) => {
                        e.preventDefault();
                        history.pushState(undefined, '', el.href);
                        main.querySelector('.single-country').remove();
                        createSingleTemplate(correspondingCountry);
                    };
                });
            });
        });
    }
    const MAP_MODE = 'place';
    const API_KEY = 'AIzaSyBDtyoY1di4Js8auinSrOzSSsmXcOMpMro';
    content.querySelector(
        'iframe'
    ).src = `https://www.google.com/maps/embed/v1/${MAP_MODE}?key=${API_KEY}&q=${country.name.common}&region=${country.cca2}`;
    main.append(content);
}
function createSpecific(content, id, value, label) {
    const countrySpecificsContainer = content.querySelector('.country-specifics');
    const countrySpecificTemplate = content.getElementById('country-specific');
    const specific = countrySpecificTemplate.content.cloneNode(true);
    const specificLabel = specific.querySelector('label');
    if (!(specificLabel instanceof HTMLLabelElement)) return;
    const specifivValue = specific.querySelector('span');
    if (!(specifivValue instanceof HTMLElement)) return;

    if (value instanceof HTMLElement) {
        specificLabel.replaceWith(value);
        specifivValue.remove();
        countrySpecificsContainer.append(specific);
        return;
    }
    specificLabel.setAttribute('for', id);
    specificLabel.innerText = label + ':';
    specifivValue.innerText = value;
    specifivValue.id = id;
    countrySpecificsContainer.append(specific);
}

function createCard(text, code) {
    const card = document.createElement('a');
    card.innerText = text;
    card.classList.add('card', 'border-country');
    if (code) card.setAttribute('data-border-code', code);
    else card.setAttribute('disabled', '');
    return card;
}

const throttledFunction = throttleFunction(alignDialog, 200);
function alignDialog(element) {
    const el = element instanceof HTMLElement ? element : regionControl;
    const { offsetTop, offsetHeight, offsetLeft, offsetWidth } = el;
    regionsDialog.style.top = `${offsetHeight + offsetTop + 4}px`;
    let offset = 0;
    const isParentRetracted = el.classList.contains('retract-width');
    if (isParentRetracted) offset = offsetWidth - 210;
    regionsDialog.style.left = `${offsetLeft + offset}px`;
}

export function openRegionDialog() {
    const expandMoreIcon = regionControl.querySelector(' .expand-more');
    const currentHidden = regionsDialog.querySelector('li[hidden]');
    currentHidden.removeAttribute('hidden');
    currentHidden.setAttribute('tabindex', '-1');
    const newHidden = regionsDialog.querySelector(`li[value='${currentRegion}']`);
    newHidden.setAttribute('hidden', '');
    newHidden.removeAttribute('tabindex');
    alignDialog(this);
    window.addEventListener('resize', throttledFunction);
    regionsDialog.setAttribute('open', '');
    expandMoreIcon.classList.add('rotate180');
}

export function closeRegionDialog() {
    const expandMoreIcon = regionControl.querySelector(' .expand-more');
    regionsDialog.removeAttribute('open');
    expandMoreIcon.classList.remove('rotate180');
    window.removeEventListener('resize', throttledFunction);
}
