import { PAGE_SIZE, getAllCountries, searchCountriesByName, searchCountriesByRegion } from './apiMethods.js'
import { applyNewCountries, createTemplate } from './domFunctions.js'
import { throttleFunction } from './helpers.js'

export function regionChangeListener() {
    const newRegion = this.value
    if (newRegion === currentRegion) return
    searchName.value = ''
    currentRegion = newRegion

    regionsDialog.querySelector('li[hidden]').removeAttribute('hidden')
    regionsDialog.querySelector(`li[value='${newRegion}']`).setAttribute('hidden', '')
    if (!newRegion) {
        this.classList.remove('appear')
        getAllCountries().then(applyNewCountries)
        return
    }
    this.classList.add('appear')
    searchCountriesByRegion(newRegion).then(applyNewCountries)
}

const throttledFunction = throttleFunction(alignDialog, 200)
function alignDialog(element) {
    const el = element instanceof HTMLElement ? element : regionControl
    const { offsetTop, offsetHeight, offsetLeft, offsetWidth } = el
    regionsDialog.style.top = `${offsetHeight + offsetTop + 4}px`
    let offset = 0
    const isParentRetracted = el.classList.contains('retract-width')
    if (isParentRetracted) offset = offsetWidth - 210
    regionsDialog.style.left = `${offsetLeft + offset}px`
}
export function regionClickListener(e) {
    e.stopPropagation()
    if (this.classList.contains('retract-width')) this.style.width = '210px'
    const expandMoreIcon = regionControl.querySelector(' .expand-more')

    if (regionsDialog.open) {
        regionsDialog.removeAttribute('open')
        expandMoreIcon.classList.remove('rotate180')
        window.removeEventListener('resize', throttledFunction)
        return
    }

    alignDialog(this)
    window.addEventListener('resize', throttledFunction)
    regionsDialog.setAttribute('open', '')
    expandMoreIcon.classList.add('rotate180')
}
export function regionDialogListener(e) {
    const expandMoreIcon = regionControl.querySelector(' .expand-more')
    regionsDialog.removeAttribute('open')
    const value = e.target.getAttribute('value')
    region.value = value
    region.dispatchEvent(new Event('change'))
    expandMoreIcon.classList.remove('rotate180')
}
export function documentClickListener(e) {
    if (e.target === regionControl) return
    regionsDialog.removeAttribute('open')
    if (regionControl.classList.contains('retract-width')) regionControl.style.width = ''
}
var searchNameTimeout
var searchNameAbort
export function searchNameChangeListener() {
    const newName = this.value.trim()
    if (searchNameTimeout) clearTimeout(searchNameTimeout)
    searchNameAbort?.abort()
    searchNameAbort = new AbortController()
    searchNameTimeout = setTimeout(() => {
        region.value = ''
        region.dispatchEvent(new Event('change'))
        if (newName) searchCountriesByName(newName, searchNameAbort.signal).then(applyNewCountries)
        else getAllCountries().then(applyNewCountries)
        searchNameTimeout = null
        searchNameAbort = null
    }, 1000)
}

export function documentKeypressListener(e) {
    if (document.activeElement === searchName) return
    if (e.code == 'Slash' || (e.code == 'KeyK' && e.ctrlKey)) {
        setTimeout(() => {
            searchName.focus()
        }, 0)
        e.stopPropagation()
    }
}
export function containerScrollListener(e) {
    const OFFSET = 300 //pixels
    const { scrollHeight, scrollTop, clientHeight } = this
    const searchContainer = document.querySelector('.search')
    const faButton = document.querySelector('.go-to-top')
    if (scrollTop >= clientHeight) {
        faButton.classList.add('show')
        appBar.style['flex-wrap'] = 'nowrap'
        searchContainer.classList.add('retract-width')
        regionControl.classList.add('retract-width')
        regionsDialog.removeAttribute('open')
    } else {
        appBar.style['flex-wrap'] = 'wrap'
        searchContainer.classList.remove('retract-width')
        regionControl.classList.remove('retract-width')
        faButton.classList.remove('show')
    }
    const isScrolledToBottom = scrollHeight - scrollTop <= clientHeight + OFFSET
    if (!isScrolledToBottom) return

    const noMoreCountries = countries.length / PAGE_SIZE <= currentPage + 1
    if (noMoreCountries) {
        console.log('No more countries')
        return
    }
    currentPage++
    countries.slice(currentPage, currentPage * PAGE_SIZE).forEach(createTemplate)
}
