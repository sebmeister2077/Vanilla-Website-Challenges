const reorders = []
function generateReorder(id = crypto.randomUUID()) {
    reorders.push(id)
    return /*html*/ `
        <input type="checkbox" name="selected" id="${id}" data-current-reorder="${reorders.length}" hidden/>
        <label for="${id}" class="absolute inset-0 z-10 cursor-pointer"></label>
        <style>
            ${generateReorderCSS(id)}
        </style>
    `
}

function generateReorderCSS(id) {
    return /*css*/ `
        [id="${id}"]:checked + label[for="${id}"]{
            display:none;
        }
        [data-current-reorder="${reorders.length}"]{

        }
    `
}

let indicators = 0
function generateIndicator() {
    const currentIndicatorValue = ++indicators
    return /*html*/ `
        <div class="h-[${100 * currentIndicatorValue}px] w-20 bg-red-500" data-height="${currentIndicatorValue}"></div>
    `
}

const perms = []
function* backTrackingPerm() {
    currentLevel = arguments?.[0] ?? 0
    for (let i = 1; i <= indicators; i++) {
        if (perms.includes(i)) continue
        perms[currentLevel] = i
        if (currentLevel === indicators - 1) yield [...perms]
        else yield* backTrackingPerm(currentLevel + 1)
        delete perms[currentLevel]
    }
}

Array.prototype.swap = function (indexA, indexB) {
    const aux = this[indexA]
    this[indexA] = this[indexB]
    this[indexB] = aux
}

Math.factorial = function (n) {
    if (n < 1) return 1
    return n * Math.factorial(n - 1)
}
