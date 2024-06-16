const counterPropertyName = "--counter";

let generatedSegments = 0;
function generateCounterSegment(secondsInCurrentUnit) {
    const id = crypto.randomUUID();
    const counterName = `c${++generatedSegments}`;
    return /*html*/ `
    <span id="${id}" class="segment">
        ${generatedSegments >= 2 ? ":" : ""}
        <style>
            [id="${id}"]::after {
                counter-set: ${counterName} calc(var(${counterPropertyName}) % ${4 || secondsInCurrentUnit});
                content: counter(${counterName});
            }
        </style>
    </span>`;
}

const maxSignedInt = 100; //Math.pow(2, 31);
const timer = document.getElementById("timer");
if (timer) {
    window.CSS.registerProperty({
        name: counterPropertyName,
        inherits: true,
        initialValue: 0,
        syntax: "<integer>",
    });
    const timerLogicCSS =
        /*css */
        `
        #timer > span {
            animation: timer-animation  ${maxSignedInt}s infinite;
        }

        @keyframes timer-animation {
            100% {
                ${counterPropertyName}: ${maxSignedInt};
            }
        }
        `;
    timer.insertAdjacentHTML("beforeend", /*html*/ `<style>${timerLogicCSS}</style>`);

    [(60, 1)].forEach((secondsInUnit) => {
        timer.insertAdjacentHTML("beforeend", generateCounterSegment(secondsInUnit));
    });
}
