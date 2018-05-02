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
AFRAME.registerComponent('selection-handler', {
    init() {
        this.selectionBox = new THREE.Box3Helper(new THREE.Box3(), 'black');
        this.selectionBox.visible = false;
        this.el.setObject3D('selectionBox', this.selectionBox);

        this.infoPanel = document.querySelector('#info-panel');
        this.infoPanelText = document.querySelector('#info-panel-text');
        this.viewer = document.querySelector('a-camera');

        this.voteFormatter = format(',');
        this.percentageFormatter = format('.3p');

        this.gazeCursor = document.querySelector('#gaze-cursor');
        this.handleSelection = this.handleSelection.bind(this);
        if (this.gazeCursor) {
            this.el.addEventListener('click', this.handleSelection);
        } else {
            this.el.addEventListener('grab-end', this.handleSelection);
        }
    },

    remove() {
        if (this.gazeCursor) {
            this.el.removeEventListener('click', this.handleSelection);
        } else {
            this.el.removeEventListener('grab-end', this.handleSelection);
        }
    },

    handleSelection(evt) {
        const targetEl = evt.target;
        if (this.isAlreadySelected(targetEl)) {
            this.turnSelectionOff();
        } else if (this.isSelectable(targetEl)) {
            this.setSelectionTo(targetEl);
        }
    },

    isAlreadySelected(targetEl) {
        return (targetEl === this.selected);
    },

    isSelectable(targetEl) {
        return !!(targetEl.components['selection-info']);
    },

    setSelectionTo(targetEl) {
        this.selected = targetEl;
        const selectedObj = this.selected.getObject3D('mesh');
        selectedObj.geometry.computeBoundingBox();
        this.showSelectionBoxFor(selectedObj);
        this.showInfoPanel(selectedObj);
    },

    showSelectionBoxFor(selectedObj) {
        const selectedObjWorldCenter = selectedObj.getWorldPosition();
        const boxCenter = this.el.object3D.worldToLocal(selectedObjWorldCenter);

        const selectionBox = new THREE.Box3();
        selectionBox.setFromCenterAndSize(boxCenter, selectedObj.geometry.boundingBox.getSize());

        this.selectionBox.box = selectionBox;
        this.selectionBox.visible = true;
    },

    showInfoPanel(selectedObj) {
        const selectionInfoComp = this.selected.components['selection-info'];
        const infoText = `State: ${selectionInfoComp.data.state}
            ${selectionInfoComp.data.candidate}
            ${this.voteFormatter(selectionInfoComp.data.votes)} votes
            ${this.percentageFormatter(selectionInfoComp.data.percentage)} of total`;
        this.infoPanelText.setAttribute('value', infoText);

        const { x, z } = findPointOppositeViewer(selectedObj, this.viewer);

        const { boundingBox } = selectedObj.geometry;
        const topOfBox = selectedObj.localToWorld(new THREE.Vector3().copy(boundingBox.max));
        const yPos = (topOfBox.y + 0.5);

        this.infoPanel.setAttribute('position', { x, y: yPos, z });
        this.infoPanel.object3D.visible = true;
    },

    turnSelectionOff() {
        this.infoPanel.object3D.visible = false;
        this.selectionBox.visible = false;
        this.selected = null;
    }
});
