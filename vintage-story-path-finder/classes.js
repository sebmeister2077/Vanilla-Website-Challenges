export class JsonData {
    constructor(data) {
        this.name = `${data.name}`;
        this.type = `${data.type}`;
        this.crs = new CRS(data.crs);
        this.features = [...data.features].map((f) => new Feature(f));
    }
}

export class CRS {
    constructor(data) {
        this.Name = `${data.Name}`;
        this.type = `${data.type}`;
        this.properties = { name: `${data.properties.name}` };
    }
}
export class Feature {
    constructor(feature) {
        this.type = `${feature.type}`;
        this.properties = {
            depth1: parseInt(feature.properties.depth1),
            depth2: parseInt(feature.properties.depth2),
            label: `${feature.properties.label}`,
            tag: `${feature.properties.tag}`,
        };
        const c = feature.geometry.coordinates;
        this.geometry = {
            type: `${feature.geometry.type}`,
            coordinates: [
                [parseInt(c[0][0]), -parseInt(c[0][1])],
                [parseInt(c[1][0]), -parseInt(c[1][1])],
            ],
        };
    }
}
export class Point {
    constructor(coord) {
        this.x = coord[0];
        this.y = coord[1];
    }
}
