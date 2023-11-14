function generateReorder(id = crypto.randomUUID()) {
    const header = document.getElementsByTagName('header')
    return /*html*/ `
        <input type="checkbox" name="selected" id="id" hidden/>
        <label for="${id}">Re Order</label>
    `
}

let indicators = 0
function generateIndicator() {
    const currentIndicatorValue = ++indicators
    return /*html*/ `
        <div class="h-[${100 * currentIndicatorValue}px] w-20 bg-red-500" data-height="${currentIndicatorValue}"></div>
    `
}
