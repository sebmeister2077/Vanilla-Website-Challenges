

let generatedSegments = 0;
function generateCounterSegment(secondsInCurrentUnit) {
    const id = crypto.randomUUID();
    const counterName = `c${++generatedSegments}`
    return /*html*/`
    <span id="${id}">
        ${generatedSegments >= 2 ? ":" : ""}
        <style>
            [id="${id}"]::after {
                counter-set: ${counterName} calc(var(--counter) % ${secondsInCurrentUnit});
                content: counter(${counterName});
            }
        </style>
    </span>`
}


const timer = document.getElementById("timer")
if (timer) {
    [60, 1].forEach(secondsInUnit => {
        timer.insertAdjacentHTML("beforeend", generateCounterSegment(secondsInUnit));
    });
}