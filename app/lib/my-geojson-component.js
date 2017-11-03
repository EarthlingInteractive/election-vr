/* Based on https://github.com/mattrei/aframe-geojson-component */
/* globals SVGPathSegMovetoAbs, SVGPathSegLinetoRel, SVGPathSegLinetoVerticalRel, SVGPathSegLinetoHorizontalRel, SVGPathSegLinetoHorizontalAbs, SVGPathSegLinetoVerticalAbs, SVGPathSegClosePath, SVGPathSegLinetoAbs */
import "aframe";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const AFRAME = window.AFRAME;
const THREE = AFRAME.THREE;

if (typeof AFRAME === "undefined") {
    throw new Error("Component attempted to register before AFRAME was available.");
}

require("pathseg"); // polyfill

const GEOJSON_GENERATED_EVENT = "geojson-loaded";

function memcpy(src, srcOffset, dst, dstOffset, length) {
    let i = 0;
    src = src.subarray || src.slice ? src : src.buffer;
    dst = dst.subarray || dst.slice ? dst : dst.buffer;
    src = srcOffset ? src.subarray ? src.subarray(srcOffset, length && srcOffset + length) : src.slice(srcOffset, length && srcOffset + length) : src;
    if (dst.set) {
        dst.set(src, dstOffset);
    } else {
        for (i = 0; i < src.length; i++) {
            dst[i + dstOffset] = src[i];
        }
    }
    return dst;
}

AFRAME.registerComponent("my-geojson", {
    dependencies: ["geometry", "material"],
    schema: {
        src: {
            type: "asset"
        },
        featureKey: {
            default: "id"
        },
        dataSrc: {
            type: "asset"
        },
        dataType: {
            default: "tsv",
            oneOf: ["csv", "tsv"]
        },
        dataKey: {
            default: "id"
        },
        // for a topojson, else first will be taken
        topologyObject: {
            default: ""
        },
        projection: {
            default: "geoEquirectangular"
        },
        lineWidth: {
            default: 1
        },
        omitBoundingBox: {
            default: false,
            type: "boolean"
        }
    },

    init: function () {
        const self = this;

        this.loader = new THREE.FileLoader();

        this.el.addEventListener("componentchanged", function (evt) {
            if (!self.mesh) return;
            if (evt.detail.name === "material") {
                if (evt.detail.oldData.color !== evt.detail.newData.color) {
                    self.mesh.material.color = new THREE.Color(evt.detail.newData.color);
                }
                if (evt.detail.oldData.opacity !== evt.detail.newData.opacity) {
                    self.mesh.material.opacity = evt.detail.newData.opacity;
                }
            }
        });
    },
    update: function (oldData) {
        const data = this.data;

        // Nothing changed
        if (AFRAME.utils.deepEqual(oldData, data)) {
            return;
        }

        const src = data.src;
        if (src && src !== oldData.src) {
            this.loader.load(src, this.onGeojsonLoaded.bind(this));
        }

        if (this.mesh) {
            if (oldData.lineWidth !== data.lineWidth) {
                this.mesh.material.linewidth = data.lineWidth;
            }
        }
    },
    tick: function (time, delta) {
    },
    getData: function () {
        return this.geometryMap;
    },
    onGeojsonLoaded: function (file) {
        const json = JSON.parse(file);

        const data = this.data;

        this.dataMap = new Map();
        if (data.dataSrc) {
            this.loader.load(data.dataSrc, this.onDataLoaded.bind(this));
        }

        const width = 360; // corresponds to longitude
        const height = 180; // corresponds to positive scaled latitude

        const projection = d3[data.projection]().scale(height / Math.PI)
        // http://bl.ocks.org/mbostock/3757119
            .translate([
                width / 2,
                height / 2
            ]);
        const path = d3.geoPath(projection).pointRadius(0.1);

        const svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

        const isTopojson = json.features === undefined;

        let features;
        if (isTopojson) {
            let topologyObjectName = data.topologyObject;
            if (!data.topologyObject) {
                topologyObjectName = Object.keys(json.objects)[0];
            }
            features = topojson.feature(json, json.objects[topologyObjectName]).features;
        } else {
            features = json.features;
        }

        const paths = svg.append("g").attr("class", "features");
        paths.selectAll("path")
            .data(features)
            .enter()
            .append("path")
            /* .attr("id", d => isTopojson
             ? d.id
             : d.properties[data.featureProperty])*/
            .attr("d", path)
            .attr("fill", "none")
            .style("stroke", "black"); // important for lines!

        this.geometryMap = this.generateLinesMap(svg.selectAll("path"), isTopojson);

        svg.remove();

        this.matComponent = this.el.components.material;

        this._selectedFeature = null;
        this.isSelecting = false;

        this.codes = new Map(); // country color codes for selecting
        this.hitScene = new THREE.Scene();
        this.hitCamera = new THREE.PerspectiveCamera(0.001, 1, 0.01, 3000);
        this.hitTexture = new THREE.WebGLRenderTarget(1, 1);
        this.hitTexture.texture.minFilter = THREE.NearestFilter;
        this.hitTexture.texture.magFilter = THREE.NearestFilter;
        this.hitTexture.generateMipMaps = false;
        this.hitTexture.setSize(100, 100);

        this.shapesMap = new Map();
        const mesh = this.generateLines();

        this.el.setObject3D("mesh", mesh);
        this.mesh = mesh;

        this.el.emit(GEOJSON_GENERATED_EVENT, { data: this.geometryMap });
    },
    onDataLoaded: function (file) {
        const self = this;
        const data = this.data;

        const contents = data.dataType === "tsv" ? d3.tsvParse(file) : d3.csvParse(file);

        contents.forEach(function (e) {
            self.dataMap.set(e[data.dataKey], e);
        });
    },
    generateLinesMap: function (paths, isTopojson) {
        const self = this;
        const map = new Map();

        const pathNodes = paths.nodes();

        pathNodes.forEach(function (p) {
            const key = isTopojson ? p.__data__.id : p.__data__.properties[self.data.featureKey];
            const type = p.__data__.geometry.type; // Point, String, Polygon

            if (type.includes("Point")) return;

            const territory = {
                id: key,
                lines: []
            };
            let line = [];
            // const vertices = line.vertices
            let x;
            let y;

            // origin coorindates when closing the path
            let ox;
            let oy;
            let px;
            let py;

            const segments = p.pathSegList;
            for (let i = 0; i < segments.numberOfItems; i++) {
                const segment = segments.getItem(i);

                // if (((segment.x >= 359.9999 || segment.x <= 0.001) || (segment.y === 180 || segment.y === 0)) && segment instanceof SVGPathSegLinetoAbs) {
                if (self.data.omitBoundingBox &&
                    (
                        (segment.x >= 359.9 || segment.x <= 0.1) ||
                        (segment.y >= 179.9 || segment.y <= 0.1)
                    )
                    && segment instanceof SVGPathSegLinetoAbs) {
                    // some GeoJSON files have a border around them
                    // to avoid having a frame aroudn the plane we omit
                    // the top-, left, right-, bottomost lines
                    // console.log(segment.x + " " + segment.y)
                } else {
                    if (segment instanceof SVGPathSegMovetoAbs) {
                        x = segment.x;
                        y = segment.y;
                        ox = x;
                        oy = y;

                        territory.lines.push(line);
                        line = [];
                        line.push(new THREE.Vector2(x, y));
                    }
                    if (segment instanceof SVGPathSegLinetoRel) {
                        x = px + segment.x;
                        y = py + segment.y;
                        line.push(new THREE.Vector2(x, y));
                    }
                    if (segment instanceof SVGPathSegLinetoAbs) {
                        x = segment.x;
                        y = segment.y;
                        line.push(new THREE.Vector2(x, y));
                    }
                    if (segment instanceof SVGPathSegLinetoVerticalRel) {
                        x = px;
                        y = py + segment.y;
                        line.push(new THREE.Vector2(x, y));
                    }
                    if (segment instanceof SVGPathSegLinetoHorizontalRel) {
                        x = px + segment.x;
                        y = py;
                        line.push(new THREE.Vector2(x, y));
                    }
                    if (segment instanceof SVGPathSegLinetoHorizontalAbs) {
                        x = segment.x;
                        y = py;
                        line.push(new THREE.Vector2(x, y));
                    }
                    if (segment instanceof SVGPathSegLinetoVerticalAbs) {
                        x = px;
                        y = segment.y;
                        line.push(new THREE.Vector2(x, y));
                    }

                    if (segment instanceof SVGPathSegClosePath || i + 1 === segments.numberOfItems) {
                        x = ox;
                        y = oy;
                        if (type.includes("Polygon") && isTopojson) { // do not close line geometries, just polygons
                            // close the segment only if it is a topojson
                            line.push(new THREE.Vector2(x, y));
                        }
                        territory.lines.push(line);
                        line = [];
                    }

                    px = x;
                    py = y;
                }
            }

            territory.lines = territory.lines.filter(function (l) {
                return l.length > 0;
            });
            // countries.push( territory )

            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key).push(territory);
        });

        return map;
    },
    generateLines: function (features) {
        const self = this;
        const data = this.data;

        const mapData = this.geometryMap;

        let min = 10000000;
        let max = -10000000;

        let lines = 0;
        mapData.forEach(function (entry) {
            entry.forEach(function (path) {
                path.lines.forEach(function (line) {
                    lines += line.length;
                });
            });
        });

        const lineGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(lines * 2 * 3);
        let gptr = 0;

        const shapesMaterial = new THREE.LineBasicMaterial({
            transparent: true,
            linewidth: 5,
            opacity: this.matComponent.data.opacity,
            color: 0xff0000,
            side: THREE.DoubleSide
        });

        mapData.forEach(function (entry, id) {
            const parts = [];

            entry.forEach(function (path) {
                path.lines.forEach(function (line) {
                    const partPositions = new Float32Array(line.length * 2 * 3);
                    let ptr = 0;

                    for (let j = 0; j < line.length - 1; j++) {
                        let p = line[j];
                        if (p.y < min) min = p.y;
                        if (p.y > max) max = p.x;

                        let res = self.latLngToVec3(p.y, p.x);

                        partPositions[ptr] = res.x;
                        partPositions[ptr + 1] = res.y;
                        partPositions[ptr + 2] = res.z;

                        ptr += 3;

                        p = line[j + 1];

                        res = self.latLngToVec3(p.y, p.x);

                        partPositions[ptr] = res.x;
                        partPositions[ptr + 1] = res.y;
                        partPositions[ptr + 2] = res.z;

                        ptr += 3;
                    }

                    parts.push(partPositions);

                    memcpy(partPositions, 0, positions, gptr, partPositions.length);
                    gptr += ptr;
                });
            });

            // the positions only of the curent polygon or line
            const partPositions = new Float32Array(parts.reduce(function (a, b) {
                return a + b.length;
            }, 0));

            let tPtr = 0;
            parts.forEach(function (p) {
                memcpy(p, 0, partPositions, tPtr, p.length);
                tPtr += p.length;
            });

            const partGeometry = new THREE.BufferGeometry();
            partGeometry.addAttribute("position", new THREE.BufferAttribute(partPositions, 3));
            partGeometry.computeBoundingSphere();

            const mesh = new THREE.LineSegments(partGeometry, shapesMaterial);
            mesh.fustrumCulled = false;
            mesh.visible = true;

            self.shapesMap.set(entry[0].id, mesh);

            entry.shape = mesh;
        });

        lineGeometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
        lineGeometry.computeBoundingSphere();

        const material = new THREE.LineBasicMaterial({
            transparent: this.matComponent.data.transparent,
            linewidth: data.lineWidth,
            opacity: this.matComponent.data.opacity,
            color: this.matComponent.data.color,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.LineSegments(lineGeometry, material);
        mesh.fustrumCulled = false;

        return mesh;
    },
    latLngToVec3: function (lat, lon) {
        const geomComponent = this.el.components.geometry;
        if (geomComponent.data.primitive === "sphere") {
            return this._sphericalLatLngToVec3(lat, lon);
        } else if (geomComponent.data.primitive === "plane") {
            return this._planarLatLngToVec3(lat, lon);
        }
        return null;
    },
    _planarLatLngToVec3: function (lat, lon) {
        const geomComponent = this.el.components.geometry;

        return new THREE.Vector3(
            (lon / 360) * geomComponent.data.width, (-lat / 180) * geomComponent.data.height,
            0);
    },
    _sphericalLatLngToVec3: function (lat, lon) {
        // lat = Math.max(175, Math.min(5, lat))
        // lat = Math.min(160, lat)

        const geomComponent = this.el.components.geometry;
        const radius = geomComponent.data.radius;

        const phi = (lat * Math.PI) / 180;
        const theta = (lon * Math.PI) / 180;
        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        return new THREE.Vector3(x, y, z);
    }
});