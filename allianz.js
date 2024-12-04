function getAverageInflationBetweenDates(firstValue, lastValue, years) {
    const firstRoot = Math.pow(firstValue, 1 / years);
    const lastRoot = Math.pow(lastValue, 1 / years);
    return (lastRoot / firstRoot - 1) * 100;
}
//@ts-ignore
function calculatePortfolio(yearlySum, years, anualPortfolioValueIncrease) {
    //@ts-ignore
    function calculatePortfolioValue(yearlySum, years, anualPortfolioValueIncrease) {
        if (years == 1) return yearlySum;
        return (1 + anualPortfolioValueIncrease / 100) * calculatePortfolioValue(yearlySum, years - 1, anualPortfolioValueIncrease) + yearlySum;
    }

    const value = calculatePortfolioValue(yearlySum, years, anualPortfolioValueIncrease);
    const totalSpent = years * yearlySum;
    return {
        value: value.toFixed(2),
        totalSpent: totalSpent.toFixed(2),
        profit: (value - totalSpent).toFixed(2),
    };
}

const worldEquityAnualValue = [9.89, 10.2, 13.2, 13.1, 14.3, 13.2, 14.5, 13.9, 15.2, 17.4, 16.9, 17.7];
const europeEquityAnualValue = [9.2, 10.9, 13.7, 13.0, 14.4, 14.2, 14.5, 13.5, 20.0, 19.5, 19.2, 21.7];

const worlEquityInterests = [];
for (let i = 1; i < worldEquityAnualValue.length; i++) {
    worlEquityInterests.push(getAverageInflationBetweenDates(worldEquityAnualValue[i - 1], worldEquityAnualValue[i], 1));
}
const worldEquityAverage = (worlEquityInterests.reduce((curr, acc) => curr + acc, 0) / worlEquityInterests.length).toFixed(2);

const europeEquityInterests = [];
for (let i = 1; i < europeEquityAnualValue.length; i++) {
    europeEquityInterests.push(getAverageInflationBetweenDates(europeEquityAnualValue[i - 1], europeEquityAnualValue[i], 1));
}

// raportul intre europe si world este de 50/50 in acest calcul
const medianInterests = [];
for (let i = 1; i < europeEquityAnualValue.length; i++) {
    medianInterests.push(
        getAverageInflationBetweenDates(
            (europeEquityAnualValue[i - 1] + worldEquityAnualValue[i - 1]) / 2,
            (europeEquityAnualValue[i] + worldEquityAnualValue[i]) / 2,
            1,
        ),
    );
}
const europeEquityAverage = (europeEquityInterests.reduce((curr, acc) => curr + acc, 0) / europeEquityInterests.length).toFixed(2);
const medianAverage = (medianInterests.reduce((curr, acc) => curr + acc, 0) / medianInterests.length).toFixed(2);

console.log(
    "worldEquity:",
    worlEquityInterests.map((v) => v.toFixed(2) + "%"),
);
console.log("worldEquityAverage:", worldEquityAverage);
console.log(
    "europeEquity:",
    europeEquityInterests.map((v) => v.toFixed(2) + "%"),
);
console.log("europeEquityAverage:", europeEquityAverage);

const years = new Array(20).fill(1).map((_, i) => i + 1);

const yearlySum = 1820 + 600;
const europePortfolioValues = years.map((y) => calculatePortfolio(yearlySum, y, europeEquityAverage));
const worldPortfolioValues = years.map((y) => calculatePortfolio(yearlySum, y, worldEquityAverage));
const medianPortfolioValues = years.map((y) => calculatePortfolio(yearlySum, y, medianAverage));

console.log("europePortfolioValues:", europePortfolioValues);
console.log("worldPortfolioValues:", worldPortfolioValues);
console.log("medianPortfolioValues (50/50):", medianPortfolioValues);
/**
 * Taxa de asigurare- 36 EUR/an
Taxa administrare fond - 1.29%/an din activul total
Taxa Top-Up - 5% depunere
                       - 1% retragere
Taxa de alocare primă de bază:
EUR/USD
sub 2.000 (5%)
2.000-3.500  ( 4.5%)
3.500- 5.000 (4.0 %)
5.000 - 10.000 (3.5 %)
10.000 - 30.000 (3.0 %) 
Peste 30.000  (2.5%)
 */
