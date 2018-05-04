import 'aframe';

const { AFRAME } = window;
const { THREE } = AFRAME;

/**
 * Responds to a selection event on part of the map.
 */
AFRAME.registerComponent('selection-handler', {
    init() {
        this.selectionBox = new THREE.Box3Helper(new THREE.Box3(), 'black');
        this.selectionBox.visible = false;
        this.el.setObject3D('selectionBox', this.selectionBox);

        this.infoPanel = document.querySelector('#info-panel');
        this.infoPanelText = document.querySelector('#info-panel-text');
        this.infoPanelHighlight = document.querySelector('#info-panel-highlight');
        this.viewer = document.querySelector('a-camera');

        this.superHands = document.querySelector('[progressive-controls]');
        this.handleControllerChange = this.handleControllerChange.bind(this);
        this.superHands.addEventListener('controller-progressed', this.handleControllerChange);

        this.handleSelection = this.handleSelection.bind(this);
    },

    handleControllerChange(evt) {
        if (evt.detail.level === 'gaze') {
            this.el.removeEventListener('grab-end', this.handleSelection);
            this.el.addEventListener('click', this.handleSelection);
        } else {
            this.el.removeEventListener('click', this.handleSelection);
            this.el.addEventListener('grab-end', this.handleSelection);
        }
    },

    remove() {
        this.el.removeEventListener('click', this.handleSelection);
        this.el.removeEventListener('grab-end', this.handleSelection);
        this.el.removeEventListener('controller-progressed', this.handleControllerChange);
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

    showInfoPanel() {
        const selectionInfoComp = this.selected.components['selection-info'];
        this.infoPanelText.setAttribute('value', selectionInfoComp.getInfoText());

        const stateBox = new THREE.Box3();
        stateBox.setFromObject(this.selected.parentEl.object3D);
        const { y } = stateBox.max;// + 0.75);
        const { x, z } = stateBox.getCenter();

        const worldPosition = new THREE.Vector3(x, y, z);
        const position = this.el.object3D.worldToLocal(worldPosition);
        this.infoPanel.object3D.position.set(position.x, position.y, position.z + 0.75);

        this.infoPanelHighlight.setAttribute('color', `#${selectionInfoComp.data.color}`);

        this.infoPanel.object3D.visible = true;
    },

    tick() {
        if (this.selected) {
            const infoPanelPositon = this.infoPanel.object3D.position;
            const viewerLocalPosition = this.el.object3D.worldToLocal(new THREE.Vector3().copy(this.viewer.object3D.position));
            const rotationMatrix = new THREE.Matrix4();
            const up = new THREE.Vector3(0, 0, 1);
            rotationMatrix.lookAt(viewerLocalPosition, infoPanelPositon, up);
            this.infoPanel.object3D.quaternion.setFromRotationMatrix(rotationMatrix);
        }
    },

    turnSelectionOff() {
        this.infoPanel.object3D.visible = false;
        this.selectionBox.visible = false;
        this.selected = null;
    }
});
