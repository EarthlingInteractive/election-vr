import "aframe";
import svgMesh3d from "svg-mesh-3d";
import threeSimplicialComplex from "three-simplicial-complex";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const AFRAME = window.AFRAME;
const THREE = AFRAME.THREE;

const createGeometry = threeSimplicialComplex(THREE);

AFRAME.registerComponent("svgpath", {
    schema: {
        color: { type: "color", default: "#c23d3e" },
        svgPath: { type: "string", default: "M 15,1 29,37 H 15 L 1,1 Z" },
    },
    multiple: false,
    init: function () {
        const data = this.data;
        const el = this.el;
        const meshData = svgMesh3d(data.svgPath, {
            delaunay: true,
            clean: true,
            exterior: false,
            randomization: 0,
            simplify: 0,
            scale: 1,
        });
        this.geometry = createGeometry(meshData);
        this.material = new THREE.MeshStandardMaterial({ color: data.color });// Create material.
        this.mesh = new THREE.Mesh(this.geometry, this.material);// Create mesh.
        el.setObject3D("mesh", this.mesh);// Set mesh on entity.
    },
    update: function () {
    },
    remove: function () {
    },
    pause: function () {
    },
    play: function () {
    },
});


const path = d3.geoPath();

const ready = (error, us) => {
    if (error) throw error;

    const scene = d3.select("a-scene");

    const states = scene.selectAll("a-entity.state").data(topojson.feature(us, us.objects.nation).features);
    states.enter().append("a-entity").classed('state', true);

    states.attr({
        position: "1 1 3",
        // svgpath: `svgPath: M 15,1 29,37 H 15 L 1,1 Z`,
    });
};

d3.queue()
    .defer(d3.json, "us-10m.v1.json")
    .await(ready);
