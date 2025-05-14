import { JsonData, CRS, Point, Feature, Solution } from "./classes.js";

/**
 * @param {Point} position
 * @param {Point[]} allUniqueCoords
 * @returns {Point}
 */
function getClosestCoordToPosition(position, allUniqueCoords) {
    if (!(position instanceof Point) || !allUniqueCoords instanceof Array) throw Error();
    let closest = allUniqueCoords[0];
    let closestDistance = getDistance(position, closest);

    for (let i = 1; i < allUniqueCoords.length; i++) {
        const distance = getDistance(position, allUniqueCoords[i]);
        if (distance < closestDistance) {
            closest = allUniqueCoords[i];
            closestDistance = distance;
        }
    }
    return closest;
}
/**
 * @param {Point} p1
 * @param {Point} p2
 * @returns {number}
 */
function getDistance(p1, p2) {
    if (!(p1 instanceof Point) || !(p2 instanceof Point)) throw Error("Input is not a point");

    const { x: x1, y: y1 } = p1;
    const { x: x2, y: y2 } = p2;
    const distance = parseInt(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    const cost = distance;
    return cost;
}

/**
 * @param {[x:number, y:number][]} coordRelations
 * @param {Point} startPosition
 * @param {number} relationsToTakeForNow
 * @returns {Point[]}
 */
function getUniqueCoords(coordRelations, startPosition, relationsToTakeForNow) {
    const uniqueCoords = [];
    if (!(coordRelations instanceof Array)) return uniqueCoords;
    for (const coords of coordRelations) {
        if (!(coords instanceof Array)) continue;

        uniqueCoords.push([new Point(coords[0]), new Point(coords[1])]);
    }

    const uniqueSortedCoords = uniqueCoords
        // This should include the other side of the TL which is closest to us
        .sort((aRel, bRel) =>
            Math.min(getDistance(startPosition, aRel[0]), getDistance(startPosition, aRel[1])) <
            Math.min(getDistance(startPosition, bRel[0]), getDistance(startPosition, bRel[1]))
                ? -1
                : 1,
        )
        .slice(0, relationsToTakeForNow)
        .flatMap((rel) => rel);

    return uniqueSortedCoords;
}
/**
 *
 * @param {Point} coord
 * @param {Point[]} allUniqueCoords
 * @returns {{ [pointAsString:string]: { [pointAsString:string]: number}}}
 */
function getRelativeMapForCoord(coord, allUniqueCoords) {
    const relationCoords = allUniqueCoords.filter((uc) => uc.x !== coord.x && uc.y !== coord.y);
    const map = {};
    relationCoords.forEach((relationCoord) => {
        map[relationCoord] = getDistance(coord, relationCoord);
    });
    return map;
}
/**
 *
 * @param {Point} startCoord
 * @param {{ [pointAsString:string]: { [pointAsString:string]: number}}} graph
 * @param {Point} endPosition
 * @param {Point[]} multiplePoints
 * @returns {number}
 */
function getCostBetweenMultiplePointsAndStartAndFinish(startCoord, graph, endPosition, multiplePoints) {
    if (!(multiplePoints instanceof Array) || !(startCoord instanceof Point) || !(endPosition instanceof Point)) throw Error();

    if (!multiplePoints.length) return getDistance(startCoord, endPosition);

    let sum = getDistance(startCoord, multiplePoints[0]);
    sum += getCostBetweenMultiplePoints(graph, multiplePoints);

    sum += getDistance(multiplePoints[multiplePoints.length - 1], endPosition);
    return sum;
}
/**
 *
 * @param {{ [pointAsString:string]: { [pointAsString:string]: number}}} graph
 * @param {Point[]} multiplePoints
 * @returns {number}
 */
function getCostBetweenMultiplePoints(graph, multiplePoints) {
    if (!(multiplePoints instanceof Array)) throw Error();

    let sum = 0;
    for (let i = 1; i < multiplePoints.length; i++) {
        const previousPoint = new Point(multiplePoints[i - 1]);
        const currentPoint = new Point(multiplePoints[i]);

        const cost = graph[previousPoint.toString()][currentPoint.toString()];
        sum += cost;
    }
    return sum;
}

import("./data.json", { with: { type: "json" } }).then((jsonData) => {
    const startPosition = new Point([-8593, 34157]);
    const data = new JsonData(jsonData.default);
    const allCoordRelations = data.features.map((f) => f.geometry.coordinates);
    const relationsToTakeForNow = 4;
    const allUniqueCoords = getUniqueCoords(allCoordRelations, startPosition, relationsToTakeForNow); // only take the ones closest to my base

    console.log(
        "Unique coords includes tp output",
        allUniqueCoords.some((c) => c.x == -214 && c.y == 16877),
    );
    const graph = allUniqueCoords.reduce((accumulator, current) => {
        accumulator[current] = getRelativeMapForCoord(current, allUniqueCoords);
        return accumulator;
    }, {});
    console.log("🚀 ~ graph ~ graph:", graph);

    const endPosition = new Point([-65, 36450]);
    const shortestPaths = findShortestPaths(graph, startPosition, endPosition, allUniqueCoords);
    console.log("🚀 ~ shortestPaths:", shortestPaths);
});

/**
 * @param {number} nr
 */
function factorial(nr) {
    let output = 1;
    for (let i = 1; i <= nr; i++) {
        output *= i;
    }
    return output;
}

/**
 *
 * @param {{ [pointAsString:string]: { [pointAsString:string]: number}}} graph
 * @param {Point} startPosition
 * @param {Point} endPosition
 * @param {Point[]} allUniqueCoords
 * @returns {{ cost: number; points: Point[] }[]}
 */
function findShortestPaths(graph, startPosition, endPosition, allUniqueCoords) {
    const startCoord = getClosestCoordToPosition(startPosition, allUniqueCoords);

    const uniqueCoordsCopy = allUniqueCoords.slice();
    const maxNestedLevelIfSolutionIsFound = 10;
    const maxSolutions = 3;
    const mostEfficientSolutions = [
        {
            cost: getDistance(startPosition, endPosition),
            points: [],
        },
    ];
    // best first, worst last
    function sortMostEfficientSolutions() {
        mostEfficientSolutions.sort((a, b) => a.cost < b.cost);
    }
    const currentSolution = [];

    let iterationCount = 0;
    let maxIterations = factorial(Math.min(uniqueCoordsCopy.length, maxNestedLevelIfSolutionIsFound));

    function backTrack(nestedLevel) {
        const currentSolutionMinimalCost = getCostBetweenMultiplePoints(graph, currentSolution);
        const thisPathIsAlreadyLonger = mostEfficientSolutions.every((sol) => sol.cost > currentSolutionMinimalCost);
        if (thisPathIsAlreadyLonger) return;

        const currentCost = getCostBetweenMultiplePointsAndStartAndFinish(startCoord, graph, endPosition, currentSolution);

        const existsPreviousSolutionWithHigherCost = mostEfficientSolutions.some((sol) => sol.cost > currentCost);
        if (existsPreviousSolutionWithHigherCost) {
            mostEfficientSolutions.push({
                cost: currentCost,
                points: currentSolution.slice(),
            });

            sortMostEfficientSolutions();
            if (mostEfficientSolutions.length > maxSolutions) mostEfficientSolutions.pop();
        }

        if (nestedLevel >= maxNestedLevelIfSolutionIsFound) return;

        for (let i = 0; i < uniqueCoordsCopy.length; i++) {
            const point = uniqueCoordsCopy[i];
            if (!(point instanceof Point)) continue;

            const isPointAlreadyAdded = currentSolution.some((s) => s == point);
            if (isPointAlreadyAdded) continue;

            currentSolution.push(point);
            delete uniqueCoordsCopy[i];

            backTrack(nestedLevel + 1);

            uniqueCoordsCopy[i] = point;
            currentSolution.pop();
        }
    }

    backTrack(0);
    console.log("🚀 ~ findShortestPaths ~ iterationCount:", iterationCount);
    console.log("🚀 ~ findShortestPaths ~ maxIterations:", maxIterations);
    return mostEfficientSolutions;
}
