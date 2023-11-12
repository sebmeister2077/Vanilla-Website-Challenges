//This javascript file is used to generate all the necessary css and html

function generateTemplates(count) {
    for (let i = 0; i < count; i++) {
        requestIdleCallback(generateTemplate);
    }
}
const cssVariableDisplay = '--display-value';
const cssVariableResult = '--result-value';
const cssVariableLastDisplay = '--last-display';

function supports(funcName) {
    return CSS.supports(`opacity: ${funcName}(1,1)`) ? 'true' : '';
}
function generateTemplate() {
    const form = document.getElementsByTagName('form')[0];
    const amountOfFields = form.querySelectorAll('fieldset').length;
    const cssTemplateNumber = amountOfFields + 1;

    const hidePreviousResultLabel = /*css*/ `
    body:has(.calculator:nth-child(${
        cssTemplateNumber - 1
    }) [data-name^="number"]:checked):has(.calculator:nth-child(${cssTemplateNumber}) [data-name^="number"]:checked) .output :nth-child(${cssTemplateNumber - 1})::before{
        display:none;
    }
    `;

    const supportsMod = supports('mod');
    const supportsPow = supports('pow');
    const supportsLog = supports('log');
    const supportsHypot = supports('hypot');

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
                body:not(:has(.calculator:nth-child(${cssTemplateNumber}) :checked:not([value="back"]))) .output :nth-child(${cssTemplateNumber})::before{
                    display:none;
                }

                body:has(.calculator:nth-child(${cssTemplateNumber}) [data-name^="number"]:checked) .output{
                    /* Pass the previous result forward even if it doesnt exist*/
                    ${cssVariableResult}${cssTemplateNumber}: var(${cssVariableResult}${cssTemplateNumber - 1});
                }

                /* This is for result */
                ${generateOperationCss(cssTemplateNumber, '+')}
                ${generateOperationCss(cssTemplateNumber, '-')}
                ${generateOperationCss(cssTemplateNumber, '/')}
                ${generateOperationCss(cssTemplateNumber, '*')}
                ${generateOperationCss(cssTemplateNumber, '%', 'rem')}
                ${generateOperationCss(cssTemplateNumber, '^', 'pow')}
                ${generateOperationCss(cssTemplateNumber, 'log', 'log')}
                ${generateOperationCss(cssTemplateNumber, 'hypot', 'hypot')}
                ${generatePotentialResultCss(cssTemplateNumber)}

                /* This is for DISPLAY */
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
                ${generateCssForOperator(cssTemplateNumber, '%')}
                ${generateCssForOperator(cssTemplateNumber, '^')}
                ${generateCssForOperator(cssTemplateNumber, 'log')}
                ${generateCssForOperator(cssTemplateNumber, 'hypot')}
            </style>
            ${supportsHypot && '' && generateInput(cssTemplateNumber, 'hypot', 'Hypot')}
            ${supportsMod && generateInput(cssTemplateNumber, '%', 'Mod')}
            ${supportsPow && generateInput(cssTemplateNumber, '^', 'Exp')}
            ${supportsLog && generateInput(cssTemplateNumber, 'log', 'Log')}
            ${generateInput(cssTemplateNumber, 'A/C')}
            ${generateInput(cssTemplateNumber - 1, 'back', '←')}
            ${generateInput(cssTemplateNumber, '+')}
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
            ${generateInput(cssTemplateNumber, 0)}
            ${generateInput(cssTemplateNumber, '=')}
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
        body:has(.calculator:nth-child(${cssTemplateNumber}) [value='${operator}']:checked:not([value="back"])) .output  {
            /* Reset value  */
            ${cssVariableDisplay}${cssTemplateNumber}: 0;
        }

        body:has(.calculator:nth-child(${cssTemplateNumber}) [value='${operator}']:checked:not([value="back"])) .output :nth-child(${cssTemplateNumber})::before{
            content: '${operator}';
        }
    `;
}

function generateInput(cssTemplateNumber, value, label = value) {
    function getInputType() {
        if (cssTemplateNumber === 1 && value === 0) return 'hidden';
        if (value === 'A/C') return 'reset';
        return 'radio';
    }
    function getName() {
        const isNumber = !isNaN(value) && typeof value === 'number';
        if (isNumber) return 'number';
        if (value === 'A/C') return 'A/C';
        if (value === 'back') return 'back';
        return 'operator';
    }
    const inputId = crypto.randomUUID();
    return /*html*/ `
        <label for="${inputId}">
            <span>${label}</span>
            <input type="${getInputType()}" data-name="${getName()}${cssTemplateNumber}" name="input-${cssTemplateNumber}" hidden value="${value}" id="${inputId}" />
        </label>
    `;
}

requestIdleCallback(() => {
    generateTemplates(20);
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

function generateOperationCss(cssTemplateNumber, operator, specialFunction) {
    // 9 bilion, since the max display value is 2 bilion...
    const MAX_DIGITS_LIMIT = 10;
    const operatorDefaultValue = ['+', '-'].includes(operator) ? 0 : 1;
    const firstOperand = /*css*/ `var(${cssVariableResult}${cssTemplateNumber - 1}, var(${cssVariableDisplay}${cssTemplateNumber - 1}, ${operatorDefaultValue}))`;
    const secondOperand = (checkedDigits) => /*css*/ `var(${cssVariableDisplay}${cssTemplateNumber + checkedDigits})`;
    function getVariableContent(checkedDigits) {
        if (specialFunction) {
            return /*css*/ `calc(${specialFunction}(${firstOperand} , ${secondOperand(checkedDigits)}));`;
        }
        return /*css*/ `calc(${firstOperand} ${operator} ${secondOperand(checkedDigits)});`;
    }

    //Generate operation for each amount of checked digits
    function generateForDigitsCount(checkedDigits) {
        return /*css*/ `
        /* Use variable display from the last display */
         /* Base is still on body */
             ${operationCanBeMadeSelector}:has(.calculator:nth-child(${cssTemplateNumber}) [value="${operator}"]:checked)${generateSelectedDigitsSelector(checkedDigits)} .output
        {
            ${cssVariableResult}${cssTemplateNumber}: ${getVariableContent(checkedDigits)}
        }
        `;
    }

    //Number of digits checked after the operation at index cssTemplateNumber
    function generateSelectedDigitsSelector(checkedDigits) {
        return /*css*/ `
            ${new Array(checkedDigits)
                .fill(0)
                .map((_, idx) => /*css*/ `:has(.calculator:nth-child(${cssTemplateNumber + idx + 1}) [data-name^="number"]:checked)`)
                .join('')}
        `.trim();
    }
    const operationCanBeMadeSelector = /*css*/ `
            /* We want to check if we can make an operation at cssTemplateNumber
            Note we make use of css newest -> prioritize rule to not override unwanted variables*/
            body:has(.calculator:nth-child(${cssTemplateNumber}) [data-name^="operator"]:checked):has(.calculator:nth-child(n + ${
        cssTemplateNumber + 1
    }) [data-name^="operator"]:checked)
    `;

    return /*css*/ `
        /* This is any intermediary operation */ 
        ${new Array(MAX_DIGITS_LIMIT)
            .fill(0)
            .map((_, idx) => generateForDigitsCount(idx + 1))
            .join('\n')}
    `;
}
