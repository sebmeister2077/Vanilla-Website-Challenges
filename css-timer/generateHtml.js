import { DAY, HOUR, MINUTE, MONTH, SECOND, YEAR } from "./constants.js";

const counterPropertyName = "--seconds-counter";
const firstTimeVisitLocation = "first-time-visit-css-Timer";
let generatedTimers = 0;
let generatedSegments = 0;
const maxSignedInt = Math.pow(2, 31);
const firstTimeVisit = localStorage.getItem(firstTimeVisitLocation);
if (!firstTimeVisit) localStorage.setItem(firstTimeVisitLocation, new Date().toJSON());
const timeElapsedSinceLastVisit = firstTimeVisit ? parseInt((Date.now() - new Date(firstTimeVisit).getTime()) / 1000) : 0;
registerProperties();
addTimers();

/**
 * @param {number} secondsInCurrentUnit Amount of seconds in current unit
 * @param {number} maxAmountInCurrentUnit Max amount number the current unit will display
 * @param {string} label Max amount number the current unit will display
 * @returns {HTMLString}
 */
function generateCounterSegment(secondsInCurrentUnit, maxAmountInCurrentUnit, label) {
    const id = crypto.randomUUID();
    const counterName = `c${++generatedSegments}`;

    return /*html*/ `
    <span id="${id}" >
        <label >
            ${label}
        </label>
        ${generatedSegments >= 2 ? ":" : ""}
        <style>
            [id="${id}"] {
                position: relative;
            }
            [id="${id}"] label {
                position: absolute;
                bottom: 100%;
                right: 0px;
            }
            [id="${id}"]::after {
                counter-set: ${counterName} mod(round(down, calc(var(${counterPropertyName}) /  ${secondsInCurrentUnit}), 1), ${maxAmountInCurrentUnit});
                content: counter(${counterName});

                display: inline-flex;
                justify-content: flex-end;
                width: 2ch;
            }
        </style>
    </span>`;
    /**
     *   --floor: calc(var(--a) / var(--b) - 0.5);
     *   --mod: calc((var(--a) - var(--b)* var(--floor)));
     */
}

function addTimers() {
    const [timer1, reset1] = generateTimerAndResetButton();
    const [timer2, reset2] = generateTimerAndResetButton();
    document.body.prepend(timer1, timer2, reset1, reset2);
}
function generateTimerAndResetButton() {
    const timerCount = `timer${++generatedTimers}`;
    const timer = parseFromHTML(/*html*/ `
        <div class="timer ${timerCount}">
            <style>
                .timer  {
                    font-size: 1.875rem;
                    line-height: 2.25rem;
                    animation: timer-animation  ${maxSignedInt}s infinite linear;
                }

                body:has(#pause input:checked) .timer  {
                    animation-play-state: paused;
                }

                @keyframes timer-animation {
                    from {
                        ${counterPropertyName}: ${timeElapsedSinceLastVisit}
                    }
                    100% {
                        ${counterPropertyName}: ${maxSignedInt};
                    }
                }
            </style>
        </div>`);

    const times = [YEAR, MONTH, DAY, HOUR, MINUTE, SECOND];
    const labels = ["Y", "M", "D", "H", "M", "S"];
    for (let i = 0; i < times.length; i++) {
        const secondsInUnit = times[i];
        const label = labels[i];
        const maxAmountInCurrentUnit = parseInt((times[i - 1] || maxSignedInt) / secondsInUnit);

        timer.insertAdjacentHTML("beforeend", generateCounterSegment(secondsInUnit, maxAmountInCurrentUnit, label));
    }
    generatedSegments = 0;

    const resetId = crypto.randomUUID();
    const reset = parseFromHTML(/*html */ `
        <label id="${resetId}" class="cool-button">
            <style>
                body:has([id="${resetId}"] input:checked)  :is(.${timerCount},[id="${resetId}"]) {
                    display: none;
                }
            </style>
            <span>
                Reset
            </span>
            <input type="radio" name="reset" ${generatedTimers > 1 ? "checked" : ""} hidden />
        </label>`);
    return [timer, reset];
}

function registerProperties() {
    const properties = [counterPropertyName];
    properties.forEach((prop) => {
        window.CSS.registerProperty({
            name: prop,
            inherits: true,
            initialValue: 0,
            syntax: "<integer>",
        });
    });
}

/**
 * @param {HTMLString} html
 * @returns {HTMLElement | null}
 */
function parseFromHTML(html) {
    return new DOMParser().parseFromString(html, "text/html").body.firstChild;
}
