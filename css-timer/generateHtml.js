import { DAY, HOUR, MINUTE, MONTH, SECOND } from "./constants.js";

const counterPropertyName = "--seconds-counter";

let generatedSegments = 0;
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
    <span id="${id}" class="relative">
        <label class="absolute bottom-full right-0">
            ${label}
        </label>
        ${generatedSegments >= 2 ? ":" : ""}
        <style>
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

const maxSignedInt = Math.pow(2, 31);
const timer = document.getElementById("timer");
if (timer) {
    registerProperties();
    const timerLogicCSS =
        /*css */
        `
        #timer  {
            animation: timer-animation  ${maxSignedInt / 6}s infinite linear;
        }

        #timer:has( + label input:checked) {
            animation-play-state: paused;
        }

        @keyframes timer-animation {
            100% {
                ${counterPropertyName}: ${maxSignedInt};
            }
        }
        `;
    timer.insertAdjacentHTML("beforeend", /*html*/ `<style>${timerLogicCSS}</style>`);

    const times = [MONTH, DAY, HOUR, MINUTE, SECOND];
    const labels = ["M", "D", "H", "M", "S"];
    for (let i = 0; i < times.length; i++) {
        const secondsInUnit = times[i];
        const label = labels[i];
        const maxAmountInCurrentUnit = parseInt((times[i - 1] || maxSignedInt) / secondsInUnit);

        timer.insertAdjacentHTML("beforeend", generateCounterSegment(secondsInUnit, maxAmountInCurrentUnit, label));
    }
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
