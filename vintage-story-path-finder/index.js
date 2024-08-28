import { JsonData, CRS, Point, Feature } from "./classes.js";

function getClosestCoordToPosition(position, allUniqueCoords) {
    if (!(position instanceof Array) || !allUniqueCoords instanceof Array) throw 0;
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
function getDistance(p1, p2) {
    const [x1, y1] = p1;

    const [x2, y2] = p2;
    const distance = parseInt(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    const cost = distance;
    return cost;
}

function getUniqueCoords(coordRelations, startPosition) {
    const uniqueCoords = [];
    if (!(coordRelations instanceof Array)) uniqueCoords;
    for (const coords of coordRelations) {
        if (!(coords instanceof Array)) continue;
        for (const c of coords) {
            if (!(c instanceof Array)) continue;

            if (uniqueCoords.some((uc) => uc[0] === c[0] && uc[1] === c[1])) continue;
            uniqueCoords.push(Object.freeze(c));
        }
    }
    return uniqueCoords.sort((a, b) => (getDistance(startPosition, a) < getDistance(startPosition, b) ? -1 : 1));
}
function getRelativeMapForCoord(coord, allUniqueCoords) {
    const relationCoords = allUniqueCoords.filter((uc) => uc[0] !== coord[0] && uc[1] !== coord[1]);
    const map = {};
    relationCoords.forEach((relationCoord) => {
        map[relationCoord] = getDistance(coord, relationCoord);
    });
    return map;
}

import("./data.json", { with: { type: "json" } }).then((jsonData) => {
    const startPosition = [515, 18779];
    const data = new JsonData(jsonData.default);
    const allCoordRelations = data.features.map((f) => f.geometry.coordinates);
    const allUniqueCoords = getUniqueCoords(allCoordRelations, startPosition).slice(0, 10); // only take the ones closest to my base

    const graph = allUniqueCoords.reduce((accumulator, current) => {
        accumulator[current] = getRelativeMapForCoord(current, allUniqueCoords);
        return accumulator;
    }, {});
    console.log("🚀 ~ graph ~ graph:", graph);

    const endPosition = [1000, 16000];
    const shortestPaths = findShortestPaths(graph, startPosition, endPosition, allUniqueCoords);
    console.log("🚀 ~ shortestPaths:", shortestPaths);
});

function findShortestPaths(graph, startPosition, endPosition, allUniqueCoords) {
    const startCoord = getClosestCoordToPosition(startPosition, allUniqueCoords);

    //practic facem backtracking, ez
}
