import { PAGE_SIZE, getAllCountries, searchCountriesByName, searchCountriesByRegion } from './apiMethods.js';
import { applyNewCountries, closeRegionDialog, createCardTemplate, openRegionDialog } from './domFunctions.js';
import { debounceFunction, throttleFunction } from './helpers.js';

export function regionChangeListener() {
    const newRegion = this.value;
    if (newRegion === currentRegion) return;
    main.scrollTo({ top: 0 });
    searchName.value = '';
    currentRegion = newRegion;

    if (!newRegion) {
        this.classList.remove('appear');
        getAllCountries().then(applyNewCountries);
        return;
    }
    this.classList.add('appear');
    searchCountriesByRegion(newRegion).then(applyNewCountries);
}

export function regionKeyboardOpenListener(e) {
    const isOpen = regionsDialog.open;
    if (e.code === 'Enter' && !isOpen) openRegionDialog();
    if (e.code === 'Enter' && isOpen) closeRegionDialog();
}
export function regionClickListener(e) {
    e.stopPropagation();
    if (this.classList.contains('retract-width')) this.style.width = '210px';

    if (regionsDialog.open) {
        closeRegionDialog();
        return;
    }

    openRegionDialog();
}
export function regionDialogListener(e) {
    const expandMoreIcon = regionControl.querySelector(' .expand-more');
    regionsDialog.removeAttribute('open');
    const value = e.target.getAttribute('value');
    region.value = value;
    region.dispatchEvent(new Event('change'));
    expandMoreIcon.classList.remove('rotate180');
}
export function documentRegionClickListener(e) {
    if (e.target === regionControl) return;
    regionsDialog.removeAttribute('open');
    if (regionControl.classList.contains('retract-width')) regionControl.style.width = '';
    regionControl.querySelector('.expand-more').classList.remove('rotate180');
}
var searchNameTimeout;
var searchNameAbort;
const debouncedApiCall = debounceFunction((newName, searchNameAbort) => {
    region.value = '';
    region.dispatchEvent(new Event('change'));
    if (newName) searchCountriesByName(newName, searchNameAbort.signal).then(applyNewCountries);
    else getAllCountries().then(applyNewCountries);
    searchNameTimeout = null;
    searchNameAbort = null;
}, 1500);
const debouncedScroll = debounceFunction(() => main.scrollTo({ top: 0 }), 1000);
export function searchNameChangeListener(e) {
    e.stopPropagation();
    const newName = this.value.trim();
    if (searchNameTimeout) clearTimeout(searchNameTimeout);
    searchNameAbort?.abort();
    searchNameAbort = new AbortController();
    debouncedScroll();
    debouncedApiCall(newName, searchNameAbort);
}

export function documentKeypressListener(e) {
    const allShortcutElements = document.querySelectorAll('[data-shortcut]');
    allShortcutElements.forEach((el) => {
        if (e.target === el) return;
        const operationRegex = /=[\w]+$/;
        const codes = el.getAttribute('data-shortcut');
        const allElementShortcuts = codes.replace(operationRegex, '').split('/');
        let doesShortcutApply = false;
        const specialKeys = ['altKey', 'ctrlKey', 'shiftKey'];
        allElementShortcuts.forEach((s) => {
            const groupedShortcuts = s.split('&');
            let localCondition = true;
            groupedShortcuts.forEach((gs) => {
                if (specialKeys.includes(gs)) localCondition = localCondition && e[gs];
                else localCondition = localCondition && e.code === gs;
            });
            doesShortcutApply = doesShortcutApply || localCondition;
        });
        if (doesShortcutApply) {
            const operation = operationRegex.exec(codes)?.[0]?.replace('=', '');
            if (!operation) throw new Error('This shortcut operation is invalid');
            setTimeout(() => {
                el[operation]();
            }, 0);
            e.stopPropagation();
        }
    });
}
export function containerScrollListener(e) {
    const PAGE_OFFSET = 300; //pixels
    const HEADER_OFFSET = 50; //pixels
    const { scrollHeight, scrollTop, clientHeight } = this;
    const searchContainer = document.querySelector('.search');
    const faButton = document.querySelector('.go-to-top');
    if (scrollTop >= clientHeight + HEADER_OFFSET) {
        faButton.classList.add('show');
        appBar.style['flex-wrap'] = 'nowrap';
        searchContainer.classList.add('retract-width');
        regionControl.classList.add('retract-width');
        regionsDialog.removeAttribute('open');
    }

    if (scrollTop < clientHeight - HEADER_OFFSET) {
        appBar.style['flex-wrap'] = 'wrap';
        searchContainer.classList.remove('retract-width');
        regionControl.classList.remove('retract-width');
        faButton.classList.remove('show');
    }
    const isScrolledToBottom = scrollHeight - scrollTop <= clientHeight + PAGE_OFFSET;
    if (!isScrolledToBottom) return;

    const noMoreCountries = countries.length / PAGE_SIZE <= currentPage + 1;
    if (noMoreCountries) {
        console.log('No more countries');
        return;
    }
    currentPage++;
    countries.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE).forEach(createCardTemplate);
}

export function beforeDocumentUnload() {
    localStorage.setItem('currentSearch', currentSearch);
    localStorage.setItem('currentRegion', currentRegion);
}

//navigation for the li element
export function keydownRegionDialogLiElement(e, index) {
    const listItems = regionsDialog.querySelectorAll('li');
    if (e.key === 'ArrowUp' && index > 0) {
        if (!listItems[index - 1].hasAttribute('hidden')) {
            listItems[index - 1].focus();
            return;
        }
        if (index > 1) listItems[index - 2].focus();

        return;
    }
    if (e.key === 'ArrowDown' && index < listItems.length - 1) {
        if (!listItems[index + 1].hasAttribute('hidden')) {
            listItems[index + 1].focus();
            return;
        }
        if (index < listItems.length - 2) listItems[index + 2].focus();
        return;
    }
    if (e.code === 'Enter' && index >= 0) {
        region.value = listItems[index].getAttribute('value');
        region.dispatchEvent(new Event('change'));
        closeRegionDialog();
    }
}
