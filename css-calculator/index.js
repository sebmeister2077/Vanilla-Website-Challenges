function generateTemplates(count) {
    for (let i = 0; i < count; i++) {
        generateTemplate()
    }
}
const cssVariableDisplay = '--display-value'
const cssVariableResult = '--result-value'

function generateTemplate() {
    const form = document.getElementsByTagName('form')[0]
    const amountOfFields = form.querySelectorAll('fieldset').length
    const cssTemplateNumber = amountOfFields + 1

    const hidePreviousResultLabel = /*css*/ `
    body:has(.calculator:nth-child(${
        cssTemplateNumber - 1
    }) [name^="number"]:checked):has(.calculator:nth-child(${cssTemplateNumber}) [name^="number"]:checked) .output :nth-child(${
        cssTemplateNumber - 1
    })::before{
            display:none;
        }
    `
    form.innerHTML += /*html*/ `
        <fieldset class="calculator">
            <style>
                .output :nth-child(${cssTemplateNumber})::before{
                    counter-reset: child${cssTemplateNumber} var(${cssVariableDisplay}${cssTemplateNumber});
                    content: counter(child${cssTemplateNumber});
                }
                
                ${cssTemplateNumber > 1 ? hidePreviousResultLabel : ''}
                body:not(:has(.calculator:nth-child(${cssTemplateNumber}) :checked)) .output :nth-child(${cssTemplateNumber})::before{
                    display:none;
                }

                

                ${new Array(10)
                    .fill(null)
                    .map((_, idx) => generateCssForNumber(cssTemplateNumber, idx))
                    //IMPORTANT, dont remove this join
                    .join('\n')}
                    ${generateCssForOperator(cssTemplateNumber, '/')}
                    ${generateCssForOperator(cssTemplateNumber, '*')}
                    ${generateCssForOperator(cssTemplateNumber, '-')}
                    ${generateCssForOperator(cssTemplateNumber, '+')}
                    ${generateCssForOperator(cssTemplateNumber, '=')}
            </style>
            ${generateInput(cssTemplateNumber, 7)}
            ${generateInput(cssTemplateNumber, 8)}
            ${generateInput(cssTemplateNumber, 9)}
            ${generateInput(cssTemplateNumber, '/')}
            ${generateInput(cssTemplateNumber, 4)}
            ${generateInput(cssTemplateNumber, 5)}
            ${generateInput(cssTemplateNumber, 6)}
            ${generateInput(cssTemplateNumber, '*')}
            ${generateInput(cssTemplateNumber, 1)}
            ${generateInput(cssTemplateNumber, 2)}
            ${generateInput(cssTemplateNumber, 3)}
            ${generateInput(cssTemplateNumber, '-')}
            ${generateInput(cssTemplateNumber, 'A/C')}
            ${generateInput(cssTemplateNumber, 0)}
            ${generateInput(cssTemplateNumber, '=')}
            ${generateInput(cssTemplateNumber, '+')}
        </fieldset>
     `
    document.querySelector('.output').append(document.createElement('span'))
}

function generateCssForNumber(cssTemplateNumber, valueNr) {
    return /*css*/ `
        body:has(.calculator:nth-child(${cssTemplateNumber}) [value='${valueNr}']:checked) .output  {
            ${cssVariableDisplay}${cssTemplateNumber}: ${
        cssTemplateNumber > 1 ? `calc(var(${cssVariableDisplay}${cssTemplateNumber - 1}) * 10 + ${valueNr})` : valueNr
    };
    }
    `
}

function generateCssForOperator(cssTemplateNumber, operator) {
    return /*css*/ `
        body:has(.calculator:nth-child(${cssTemplateNumber}) [value='${operator}']:checked) .output  {
            /* Reset value  */
            ${cssVariableDisplay}${cssTemplateNumber}: 0;
        }

        body:has(.calculator:nth-child(${cssTemplateNumber}) [value='${operator}']:checked) .output :nth-child(${cssTemplateNumber})::before{
            content: '${operator}';
        }
    `
}

function generateInput(cssTemplateNumber, value) {
    function getInputType() {
        if (cssTemplateNumber === 1 && value === 0) return 'hidden'
        if (value === 'A/C') return 'reset'
        return 'radio'
    }
    function getName() {
        const isNumber = !isNaN(value) && typeof value === 'number'
        if (isNumber) return 'number'
        if (value === 'A/C') return 'A/C'
        return 'operator'
    }
    return /*html*/ `
        <label>
            <span>${value}</span>
            <input type="${getInputType()}" name="${getName()}${cssTemplateNumber}" hidden value="${value}" />
        </label>
    `
}

generateTemplates(50)
