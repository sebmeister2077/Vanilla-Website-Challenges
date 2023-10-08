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
    form.innerHTML += /*html*/ `
        <fieldset class="calculator">
            <style>
                .output :nth-child(${cssChildNumber})::before{
                    counter-reset: child${cssChildNumber} var(${cssVariableBaseName}${cssChildNumber});
                    content: counter(child${cssChildNumber});
                }
                body:not(:has(.calculator:nth-child(${cssChildNumber}) :checked)) .output :nth-child(${cssChildNumber})::before{
                    display:none;
                }
                ${new Array(10)
                    .fill(2)
                    .map((_, idx) => generateCssForNumber(cssChildNumber, idx))
                    //IMPORTANT, dont remove this join
                    .join('\n')}
            </style>
            <label>
                <span>7</span>
                <input type="radio" name="number" hidden value="7" />
            </label>
            <label>
                <span>8</span>
                <input type="radio" name="number" hidden value="8" />
            </label>
            <label>
                <span> 9 </span>
                <input type="radio" name="number" hidden value="9" />
            </label>
            <label>
                <span>/</span>
                <input type="radio" name="operator" hidden value="/" />
            </label>
            <label>
                <span>4</span>
                <input type="radio" name="number" hidden value="4" />
            </label>
            <label>
                <span>5</span>
                <input type="radio" name="number" hidden value="5" />
            </label>
            <label>
                <span>6</span>
                <input type="radio" name="number" hidden value="6" />
            </label>
            <label>
                <span>x</span>
                <input type="radio" name="operator" hidden value="x" />
            </label>
            <label>
                <span>1</span>
                <input type="radio" name="number" hidden value="1" />
            </label>
            <label>
                <span>2</span>
                <input type="radio" name="number" hidden value="2" />
            </label>
            <label>
                <span>3</span>
                <input type="radio" name="number" hidden value="3" />
            </label>
            <label>
                <span>-</span>
                <input type="radio" name="operator" hidden value="-" />
            </label>
            <label data-big-span>
                <span>0</span>
                <input type="radio" name="number" hidden value="0" />
            </label>
            <label>
                <span>A/C</span>
                <input type="reset" hidden value="ac" />
            </label>
            <label>
                <span>+</span>
                <input type="radio" name="operator" hidden value="+" />
            </label>
        </fieldset>
     `
    document.querySelector('.output').append(document.createElement('span'))
}

function generateCssForNumber(childNumber, valueNr) {
    return /*css*/ `
    body:has(.calculator:nth-child(${childNumber}) [value='${valueNr}']:checked) .output :nth-child(${childNumber}) {
        ${cssVariableBaseName}${childNumber}: ${
        childNumber > 1 ? `calc(var(${cssVariableBaseName}${childNumber - 1}) * 10 + ${valueNr})` : valueNr
    };
    }
    `
}

generateTemplates(12)
