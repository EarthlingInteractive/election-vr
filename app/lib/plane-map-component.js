/* Based on https://bl.ocks.org/mbostock/2b85250396c17a79155302f91ec21224 and https://github.com/mattrei/aframe-geojson-component */
import "aframe";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const AFRAME = window.AFRAME;
const THREE = AFRAME.THREE;

if (typeof AFRAME === "undefined") {
    throw new Error("Component attempted to register before AFRAME was available.");
}

const GEOJSON_GENERATED_EVENT = "geojson-loaded";

class ThreeJSRenderContext {
    constructor() {
        this.shapePath = new THREE.ShapePath();
    }
    beginPath() {
        console.log("called beginPath");
    }
    moveTo(x, y) {
        this.shapePath.moveTo(x, y);
    }
    lineTo(x, y) {
        this.shapePath.lineTo(x, y);
    }
    arc(x, y, radius, startAngle, endAngle) {
        this.shapePath.currentPath.arc(x, y, radius, startAngle, endAngle);
    }
    closePath() {
        this.shapePath.currentPath.closePath();
    }
    toShapes() {
        return this.shapePath.toShapes(true);
    }
}

AFRAME.registerComponent("plane-map", {
    dependencies: ["geometry", "material"],
    schema: {
        src: {
            type: "asset"
        },
        lineWidth: {
            default: 1
        },
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
        const geoJsonMesh = JSON.parse(file);

        const geomComponent = this.el.components.geometry;
        const height = geomComponent.data.height;
        const width = geomComponent.data.width;

        // const geoJsonMesh = topojson.mesh(topology, topology.objects.land);
        const x = d3.scaleLinear().domain([0, width]).range([-width / 2, width / 2]);
        const y = d3.scaleLinear().domain([0, height]).range([height / 2, -height / 2]);

        const worldTransform = d3.geoTransform({
            point: function (px, py) {
                this.stream.point(x(px), y(py));
            }
        });
        const projection = d3.geoAlbersUsa().fitSize([width, height], geoJsonMesh);
        const projectionInAFrameCoords = {
            stream: function (s) {
                return projection.stream(worldTransform.stream(s));
            }
        };
        // const projection = d3.geoStereographic().scale(0.5).translate([0, 0]).center([-73.968285, 40.785091]);

        const renderContext = new ThreeJSRenderContext();
        const path = d3.geoPath(projectionInAFrameCoords, renderContext);
        path(geoJsonMesh);

        const shapes = renderContext.toShapes();
        const geometry = new THREE.ShapeGeometry(shapes);
        const material = new THREE.MeshBasicMaterial({ color: "blue", side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        this.el.setObject3D("line", mesh);
        console.log("Ready");
    },
});
