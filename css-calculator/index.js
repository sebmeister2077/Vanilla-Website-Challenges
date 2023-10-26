function generateTemplates(count) {
    for (let i = 0; i < count; i++) {
        requestIdleCallback(generateTemplate);
    }
}
const cssVariableDisplay = '--display-value';
const cssVariableResult = '--result-value';
const cssVariableLastDisplay = '--last-display';

function generateTemplate() {
    const form = document.getElementsByTagName('form')[0];
    const amountOfFields = form.querySelectorAll('fieldset').length;
    const cssTemplateNumber = amountOfFields + 1;

    const hidePreviousResultLabel = /*css*/ `
    body:has(.calculator:nth-child(${
        cssTemplateNumber - 1
    }) [name^="number"]:checked):has(.calculator:nth-child(${cssTemplateNumber}) [name^="number"]:checked) .output :nth-child(${cssTemplateNumber - 1})::before{
            display:none;
        }
    `;

    const newCalculatorHTML = /*html*/ `
        <fieldset class="calculator">
            <style>
                [data-info]:after {
                    content:' ${cssTemplateNumber}';
                }

                .output :nth-child(${cssTemplateNumber})::before{
                    counter-reset: child${cssTemplateNumber} var(${cssVariableDisplay}${cssTemplateNumber});
                    content: counter(child${cssTemplateNumber});
                }
                
                ${cssTemplateNumber > 1 ? hidePreviousResultLabel : ''}
                body:not(:has(.calculator:nth-child(${cssTemplateNumber}) :checked)) .output :nth-child(${cssTemplateNumber})::before{
                    display:none;
                }

                body:has(.calculator:nth-child(${cssTemplateNumber}) [name^="number"]:checked) .output{
                    /* Pass the previous result forward even if it doesnt exist*/
                    ${cssVariableResult}${cssTemplateNumber}: var(${cssVariableResult}${cssTemplateNumber - 1});
                }

                /* This is for result */
                ${generateOperationCss(cssTemplateNumber, '+')}
                ${generateOperationCss(cssTemplateNumber, '-')}
                ${generateOperationCss(cssTemplateNumber, '/')}
                ${generateOperationCss(cssTemplateNumber, '*')}
                ${generatePotentialResultCss(cssTemplateNumber)}

                /* This is for display */
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
     `;

    //This way form state is preserved
    form.insertAdjacentHTML('beforeend', newCalculatorHTML);
    document.querySelector('.output').append(document.createElement('span'));
}

function generateCssForNumber(cssTemplateNumber, valueNr) {
    return /*css*/ `
        body:has(.calculator:nth-child(${cssTemplateNumber}) [value='${valueNr}']:checked) .output  {
            ${cssVariableDisplay}${cssTemplateNumber}: ${cssTemplateNumber > 1 ? `calc(var(${cssVariableDisplay}${cssTemplateNumber - 1}) * 10 + ${valueNr})` : valueNr};
            ${cssVariableLastDisplay}:var(${cssVariableDisplay}${cssTemplateNumber});
    }
    `;
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
    `;
}

function generateInput(cssTemplateNumber, value) {
    function getInputType() {
        if (cssTemplateNumber === 1 && value === 0) return 'hidden';
        if (value === 'A/C') return 'reset';
        return 'radio';
    }
    function getName() {
        const isNumber = !isNaN(value) && typeof value === 'number';
        if (isNumber) return 'number';
        if (value === 'A/C') return 'A/C';
        return 'operator';
    }
    const inputId = crypto.randomUUID();
    return /*html*/ `
        <label for="${inputId}">
            <span>${value}</span>
            <input type="${getInputType()}" name="${getName()}${cssTemplateNumber}" hidden value="${value}" id="${inputId}" />
        </label>
    `;
}

requestIdleCallback(() => {
    generateTemplates(30);
});

function generatePotentialResultCss(cssTemplateNumber) {
    return /*css*/ `
        body:has(.calculator:nth-child(${cssTemplateNumber}) [value="="]:checked) .output::after{
            counter-reset:final-result var(${cssVariableResult}${cssTemplateNumber - 1});
            content:counter(final-result);
        }
    `;
}
function emulateClick(sequence) {
    if (!sequence || typeof sequence !== 'string') return;
    const chars = sequence.split('');
    let n = 1;
    for (const char of chars) {
        clickEl(char);
    }
    clickEl('=');
    function clickEl(char) {
        const el = document.querySelector(`.calculator:nth-child(${n++}) label:has([value="${char}"])`);
        if (!(el instanceof HTMLElement)) return;
        el.click();
    }
}

setTimeout(() => {
    // if (window.location.hostname === '127.0.0.1') emulateClick('2*55-12');
}, 1200);

function generateOperationCss(cssTemplateNumber, operator) {
    // 9 bilion
    const MAX_DIGITS_LIMIT = 10;
    const operatorDefaultValue = ['+', '-'].includes(operator) ? 0 : 1;

    const operationCanBeMadeSelector = /*css*/ `
            /* We want to check if we can make an operation at cssTemplateNumber
            Note we make use of css newest -> prioritize rule to not override unwanted variables*/
            body:has(.calculator:nth-child(${cssTemplateNumber}) [name^="operator"]:checked):has(.calculator:nth-child(n + ${cssTemplateNumber + 1}) [name^="operator"]:checked)
    `;
    return /*css*/ `
        /* This is any intermediary operation */ 
        ${new Array(MAX_DIGITS_LIMIT)
            .fill(0)
            .map((_, idx) => generateForDigitsCount(idx + 1))
            .join('\n')}
    `;

    //Generate operation for each amount of checked digits
    function generateForDigitsCount(checkedDigits) {
        return /*css*/ `
        /* Use variable display from the last display */
         /* Base is still on body */
             ${operationCanBeMadeSelector}:has(.calculator:nth-child(${cssTemplateNumber}) [value="${operator}"]:checked)${generateSelectedDigitsSelector(checkedDigits)} .output
        {
            ${cssVariableResult}${cssTemplateNumber}: calc(var(${cssVariableResult}${cssTemplateNumber - 1}, var(${cssVariableDisplay}${
            cssTemplateNumber - 1
        }, ${operatorDefaultValue})) ${operator} var(${cssVariableDisplay}${cssTemplateNumber + checkedDigits}));
        }
        `;
    }

    //Number of digits checked after the operation at index cssTemplateNumber
    function generateSelectedDigitsSelector(checkedDigits) {
        return /*css*/ `
            ${new Array(checkedDigits)
                .fill(0)
                .map((_, idx) => /*css*/ `:has(.calculator:nth-child(${cssTemplateNumber + idx + 1}) [name^="number"]:checked)`)
                .join('')}
        `.trim();
    }
}
