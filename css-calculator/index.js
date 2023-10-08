function generateTemplates(count) {
    for (let i = 0; i < count; i++) {
        generateTemplate()
    }
}
const cssVariableBaseName = '--value'

function generateTemplate() {
    const form = document.getElementsByTagName('form')[0]
    const amountOfFields = form.querySelectorAll('fieldset').length
    const cssChildNumber = amountOfFields + 1

    const hidePreviousResultLabel = /*css*/ `
    body:has(.calculator:nth-child(${
        cssChildNumber - 1
    }) [name^="number"]:checked):has(.calculator:nth-child(${cssChildNumber}) [name^="number"]:checked) .output :nth-child(${
        cssChildNumber - 1
    })::before{
            display:none;
        }
    `
    form.innerHTML += /*html*/ `
        <fieldset class="calculator">
            <style>
                .output :nth-child(${cssChildNumber})::before{
                    counter-reset: child${cssChildNumber} var(${cssVariableBaseName}${cssChildNumber});
                    content: counter(child${cssChildNumber});
                }
                
                ${cssChildNumber > 1 ? hidePreviousResultLabel : ''}
                body:not(:has(.calculator:nth-child(${cssChildNumber}) :checked)) .output :nth-child(${cssChildNumber})::before{
                    display:none;
                }
                ${new Array(10)
                    .fill(2)
                    .map((_, idx) => generateCssForNumber(cssChildNumber, idx))
                    //IMPORTANT, dont remove this join
                    .join('\n')}
            </style>
            ${generateInput(cssChildNumber, 7)}
            ${generateInput(cssChildNumber, 8)}
            ${generateInput(cssChildNumber, 9)}
            ${generateInput(cssChildNumber, '/')}
            ${generateInput(cssChildNumber, 4)}
            ${generateInput(cssChildNumber, 5)}
            ${generateInput(cssChildNumber, 6)}
            ${generateInput(cssChildNumber, 'x')}
            ${generateInput(cssChildNumber, 1)}
            ${generateInput(cssChildNumber, 2)}
            ${generateInput(cssChildNumber, 3)}
            ${generateInput(cssChildNumber, '-')}
            ${generateInput(cssChildNumber, 0)}
            ${generateInput(cssChildNumber, 'A/C')}
            ${generateInput(cssChildNumber, '+')}
        </fieldset>
     `
    document.querySelector('.output').append(document.createElement('span'))
}

function generateCssForNumber(childNumber, valueNr) {
    return /*css*/ `
        body:has(.calculator:nth-child(${childNumber}) [value='${valueNr}']:checked) .output  {
            ${cssVariableBaseName}${childNumber}: ${
        childNumber > 1 ? `calc(var(${cssVariableBaseName}${childNumber - 1}) * 10 + ${valueNr})` : valueNr
    };
    }
    `
}

function generateInput(childNumber, value) {
    function getInputType() {
        if (childNumber === 1 && value === 0) return 'hidden'
        if (value === 'A/C') return 'reset'
        return 'radio'
    }
    const isNumber = !isNaN(value) && typeof value === 'number'
    return /*html*/ `
        <label>
            <span>${value}</span>
            <input type="${getInputType()}" name="${isNumber ? 'number' : 'operand'}${childNumber}" hidden value="${value}" />
        </label>
    `
}

generateTemplates(12)
