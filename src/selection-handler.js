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

        this.stateBox = new THREE.Box3();
        this.infoPanelAnchorPosition = new THREE.Vector3();

        this.infoPanel = document.querySelector('#info-panel');
        this.infoPanelText = document.querySelector('#info-panel-text');
        this.infoPanelHighlight = document.querySelector('#info-panel-highlight');

        this.superHands = document.querySelector('[progressive-controls]');
        this.handleControllerChange = this.handleControllerChange.bind(this);
        this.superHands.addEventListener('controller-progressed', this.handleControllerChange);

        this.handleSelection = this.handleSelection.bind(this);
        this.turnSelectionOff = this.turnSelectionOff.bind(this);
        this.el.sceneEl.addEventListener('year-changed', this.turnSelectionOff);
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
        this.el.sceneEl.removeEventListener('year-changed', this.turnSelectionOff);
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

        this.calculateInfoPanelAnchorPosition();
        this.infoPanel.object3D.position.copy(this.infoPanelAnchorPosition);

        this.infoPanelHighlight.setAttribute('color', `#${selectionInfoComp.data.color}`);

        this.infoPanel.object3D.visible = true;
    },

    calculateInfoPanelAnchorPosition() {
        this.stateBox.setFromObject(this.selected.parentEl.object3D);
        this.stateBox.getCenter(this.infoPanelAnchorPosition);
        this.infoPanelAnchorPosition.setY(this.stateBox.max.y + 0.75);
    },

    needsPositionUpdate() {
        return !(this.infoPanel.object3D.position.equals(this.infoPanelAnchorPosition));
    },

    tick() {
        if (this.selected && this.needsPositionUpdate()) {
            this.calculateInfoPanelAnchorPosition();
            this.infoPanel.object3D.position.copy(this.infoPanelAnchorPosition);
        }
    },

    turnSelectionOff() {
        this.infoPanel.object3D.visible = false;
        this.selectionBox.visible = false;
        this.selected = null;
    }
});
