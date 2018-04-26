import 'aframe';
import { format } from 'd3-format';

const { AFRAME } = window;
const { THREE } = AFRAME;

/**
 * Responds to a raycaster event intersecting part of the map.
 */
AFRAME.registerComponent('selection', {
    dependencies: ['geo-projection'],
    schema: {
        selectionStartEvent: {
            default: 'mouseenter'
        },
        selectionEndEvent: {
            default: 'mouseleave'
        }
    },

    init() {
        this.selectionBox = new THREE.BoxHelper(undefined, 'black');
        this.selectionBox.visible = false;
        this.el.sceneEl.setObject3D('box', this.selectionBox);

        this.infoPanel = document.querySelector('#info-panel');
        this.viewer = document.querySelector('#viewer');

        this.voteFormatter = format(',');
        this.percentageFormatter = format('.3p');

        this.handleSelection = this.handleSelection.bind(this);
        this.el.addEventListener(this.data.selectionStartEvent, this.handleSelection);
        this.handleSelectionEnd = this.handleSelectionEnd.bind(this);
        this.el.addEventListener(this.data.selectionEndEvent, this.handleSelectionEnd);
    },

    update(oldData) {
    },

    remove() {
        this.el.removeEventListener(this.data.selectionStartEvent, this.handleSelection);
        this.el.removeEventListener(this.data.selectionEndEvent, this.handleSelectionEnd);
    },

    handleSelection(evt) {
        this.selected = evt.target;
        const selectedObj = this.selected.getObject3D('mesh');
        this.selectionBox.setFromObject(selectedObj);
        this.selectionBox.visible = true;

        // find point opposite the camera
        selectedObj.geometry.computeBoundingSphere();
        selectedObj.geometry.computeBoundingBox();
        const { boundingSphere, boundingBox } = selectedObj.geometry;
        const viewerPos = this.viewer.object3D.getWorldPosition();
        const viewerWorldPos = new THREE.Vector3().copy(viewerPos);
        viewerWorldPos.setY(0);
        const localViewerPos = selectedObj.worldToLocal(viewerWorldPos);
        const pointOnSphere = boundingSphere.clampPoint(localViewerPos);
        pointOnSphere.negate();
        const targetPoint = selectedObj.localToWorld(pointOnSphere);

        const selectionInfoComp = this.selected.components['selection-info'];
        if (selectionInfoComp) {
            const infoText = `State: ${selectionInfoComp.data.state}
            Candidate: ${selectionInfoComp.data.candidate}
            Votes: ${this.voteFormatter(selectionInfoComp.data.votes)}
            Percentage: ${this.percentageFormatter(selectionInfoComp.data.percentage)}`;
            this.infoPanel.setAttribute('text', 'value', infoText);

            const { x, z } = targetPoint;
            const topOfBox = selectedObj.localToWorld(new THREE.Vector3().copy(boundingBox.max));
            const yPos = (topOfBox.y + 0.5);
            this.infoPanel.setAttribute('position', { x, y: yPos, z });
        }
    },

    handleSelectionEnd() {
        this.selectionBox.visible = false;
        this.selected = null;
    }
});
