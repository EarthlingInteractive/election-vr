import "aframe";
import svgMesh3d from "svg-mesh-3d";
import threeSimplicialComplex from "three-simplicial-complex";

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
