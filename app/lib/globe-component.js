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

// Converts a point [longitude, latitude] in degrees to a THREE.Vector3.
const vertex = (radius) => (point) => {
    const lambda = (point[0] * Math.PI) / 180;
    const phi = (point[1] * Math.PI) / 180;
    const cosPhi = Math.cos(phi);
    return new THREE.Vector3(
        radius * cosPhi * Math.cos(lambda),
        radius * cosPhi * Math.sin(lambda),
        radius * Math.sin(phi)
    );
};

// Converts a GeoJSON MultiLineString in spherical coordinates to a THREE.LineSegments.
function wireframe(multilinestring, material, radius) {
    const geometry = new THREE.Geometry();
    multilinestring.coordinates.forEach((line) => {
        d3.pairs(line.map(vertex(radius)), (a, b) => {
            geometry.vertices.push(a, b);
        });
    });
    return new THREE.LineSegments(geometry, material);
}

function wireframeGeometry(multilinestring, radius) {
    const geometry = new THREE.Geometry();
    multilinestring.coordinates.forEach((line) => {
        d3.pairs(line.map(vertex(radius)), (a, b) => {
            geometry.vertices.push(a, b);
        });
    });
    return geometry;
}

// See https://github.com/d3/d3-geo/issues/95
function graticule10() {
    const epsilon = 1e-6;

    function graticuleX(y0, y1, dy) {
        const yVals = d3.range(y0, y1 - epsilon, dy).concat(y1);
        return (x) => yVals.map((y) => [x, y]);
    }

    function graticuleY(x0, x1, dx) {
        const xVals = d3.range(x0, x1 - epsilon, dx).concat(x1);
        return (y) => xVals.map((x) => [x, y]);
    }

    // eslint-disable-next-line
    const x1 = 180, x0 = -x1, y1 = 80, y0 = -y1, dx = 10, dy = 10;
    // eslint-disable-next-line
    const X1 = 180, X0 = -X1, Y1 = 90, Y0 = -Y1, DX = 90, DY = 360;
    const x = graticuleX(y0, y1, 2.5);
    const y = graticuleY(x0, x1, 2.5);
    const X = graticuleX(Y0, Y1, 2.5);
    const Y = graticuleY(X0, X1, 2.5);

    return {
        type: "MultiLineString",
        coordinates: d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X)
            .concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y))
            .concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter((val) => (Math.abs(val % DX) > epsilon)).map(x))
            .concat(d3.range(Math.ceil(y0 / dy) * dy, y1 + epsilon, dy).filter((val) => (Math.abs(val % DY) > epsilon)).map(y))
    };
}

AFRAME.registerComponent("globe", {
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
        const topology = JSON.parse(file);

        // this.matComponent = this.el.components.material;
        // const geomComponent = this.el.components.geometry;
        const radius = 0.5;
        this.material = new THREE.LineBasicMaterial({
            linewidth: this.data.lineWidth,
            color: "blue",
            side: THREE.DoubleSide
        });
        this.geometry = wireframeGeometry(topojson.mesh(topology, topology.objects.land), radius);
        // this.geometry = wireframeGeometry(graticule10(), radius);
        /*
        this.geometry.computeBoundingSphere();
        this.lineMesh = new THREE.LineSegments(this.geometry, this.material);
        // // const mesh = wireframe(topojson.mesh(topology, topology.objects.land), new THREE.LineBasicMaterial({ color: 0xff0000 }), radius);
        // this.el.removeObject3D("mesh");
        this.lineMesh.fustrumCulled = false;
        this.el.setObject3D("mesh", this.lineMesh);
*/
        // this.geometry = new THREE.Geometry();
        // this.geometry.vertices.push(
        //     new THREE.Vector3(-1, 0, 0),
        //     new THREE.Vector3(0, 1, 0),
        //     new THREE.Vector3(1, 0, 0),
        //     new THREE.Vector3(0, 1, 0)
        // );
        this.line = new THREE.LineSegments(this.geometry, this.material);
        // this.el.removeObject3D("mesh");
        this.el.setObject3D("line", this.line);
        this.geometry.computeBoundingSphere();

        // const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        // // this.material = new THREE.MeshStandardMaterial({ color: "blue" });
        // this.mesh = new THREE.Mesh(geometry, this.material);
        // this.el.setObject3D("mesh", this.mesh);
        // this.geometry.attributes.position.needsUpdate = true;

        this.el.emit(GEOJSON_GENERATED_EVENT, { data: topology });
    },
});
