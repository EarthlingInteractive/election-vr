import 'aframe';
import { format } from 'd3-format';

const { AFRAME } = window;
const { THREE } = AFRAME;

const findPointOppositeViewer = (selectedObj, viewer) => {
    selectedObj.geometry.computeBoundingSphere();
    const { boundingSphere } = selectedObj.geometry;
    const viewerPos = viewer.object3D.getWorldPosition();
    const viewerWorldPos = new THREE.Vector3().copy(viewerPos);
    viewerWorldPos.setY(0);
    const localViewerPos = selectedObj.worldToLocal(viewerWorldPos);
    const pointOnSphere = boundingSphere.clampPoint(localViewerPos);
    pointOnSphere.negate();
    return selectedObj.localToWorld(pointOnSphere);
};

/**
 * Responds to a click event on part of the map.
 */
AFRAME.registerComponent('selection', {
    init() {
        this.selectionBox = new THREE.BoxHelper(undefined, 'black');
        this.selectionBox.visible = false;
        this.el.sceneEl.setObject3D('selectionBox', this.selectionBox);

        this.infoPanel = document.querySelector('#info-panel');
        this.viewer = document.querySelector('a-camera');

        this.voteFormatter = format(',');
        this.percentageFormatter = format('.3p');

        this.handleSelection = this.handleSelection.bind(this);
        this.el.addEventListener('click', this.handleSelection);
        this.el.addEventListener('grab-end', this.handleSelection);
    },

    remove() {
        this.el.removeEventListener('click', this.handleSelection);
        this.el.removeEventListener('grab-end', this.handleSelection);
    },

    handleSelection(evt) {
        if (this.isAlreadySelected(evt.target)) {
            this.turnSelectionOff();
        } else {
            this.setSelectionTo(evt.target);
        }
    },

    isAlreadySelected(targetEl) {
        return (targetEl === this.selected);
    },

    setSelectionTo(targetEl) {
        this.selected = targetEl;
        const selectedObj = this.selected.getObject3D('mesh');
        this.selectionBox.setFromObject(selectedObj);
        this.selectionBox.visible = true;

        const selectionInfoComp = this.selected.components['selection-info'];
        if (selectionInfoComp) {
            const infoText = `State: ${selectionInfoComp.data.state}
            Candidate: ${selectionInfoComp.data.candidate}
            Votes: ${this.voteFormatter(selectionInfoComp.data.votes)}
            Percentage: ${this.percentageFormatter(selectionInfoComp.data.percentage)}`;
            this.infoPanel.setAttribute('text', 'value', infoText);

            const { x, z } = findPointOppositeViewer(selectedObj, this.viewer);

            selectedObj.geometry.computeBoundingBox();
            const { boundingBox } = selectedObj.geometry;
            const topOfBox = selectedObj.localToWorld(new THREE.Vector3().copy(boundingBox.max));
            const yPos = (topOfBox.y + 0.5);

            this.infoPanel.setAttribute('position', { x, y: yPos, z });
            this.infoPanel.object3D.visible = true;
        }
    },

    turnSelectionOff() {
        this.infoPanel.object3D.visible = false;
        this.selectionBox.visible = false;
        this.selected = null;
    }
});
