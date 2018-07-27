import 'aframe';

const { AFRAME } = window;
const { THREE } = AFRAME;

// For Google Tag Manager custom events
window.dataLayer = window.dataLayer || [];

/**
 * Responds to a selection event on part of the map.
 */
AFRAME.registerComponent('selection-handler', {
    init() {
        this.selectionBox = new THREE.Box3Helper(new THREE.Box3(), 'black');
        this.selectedObjWorldCenter = new THREE.Vector3();
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
        this.handleControllerChange();
    },

    handleControllerChange() {
        const progressiveControls = this.superHands.components['progressive-controls'];
        const lvl = progressiveControls.currentLevel.get('right');
        const level = progressiveControls.levels[lvl];
        if (level === 'gaze') {
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
        this.superHands.removeEventListener('controller-progressed', this.handleControllerChange);
        this.el.sceneEl.removeEventListener('year-changed', this.turnSelectionOff);
    },

    handleSelection(evt) {
        const targetEl = evt.target;
        this.el.emit('target-selected', { targetEl }, true);
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
        if (this.selected) {
            this.turnSelectionOff();
        }
        this.selected = targetEl;
        const selectedObj = this.selected.getObject3D('mesh');
        selectedObj.geometry.computeBoundingBox();
        this.showSelectionBoxFor(selectedObj);
        this.selected.setAttribute('scale', '1.05 1.05 1.01');
        this.selected.setAttribute('material', 'visible', true);
        this.selected.addState('selected');
        this.showInfoPanel(selectedObj);
    },

    showSelectionBoxFor(selectedObj) {
        selectedObj.getWorldPosition(this.selectedObjWorldCenter);
        const boxCenter = this.el.object3D.worldToLocal(this.selectedObjWorldCenter);

        const selectionBox = new THREE.Box3();
        selectionBox.setFromCenterAndSize(boxCenter, selectedObj.geometry.boundingBox.getSize(new THREE.Vector3()));

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

        const { state, candidate } = selectionInfoComp.data;

        window.dataLayer.push({
            event: 'data-selected',
            state,
            candidate
        });
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
        if (this.selected) {
            this.calculateInfoPanelAnchorPosition();
            if (this.needsPositionUpdate()) {
                this.infoPanel.object3D.position.copy(this.infoPanelAnchorPosition);
            }
        }
    },

    turnSelectionOff() {
        this.infoPanel.object3D.visible = false;
        this.selectionBox.visible = false;
        if (this.selected) {
            this.selected.setAttribute('scale', '1 1 1');
            this.selected.setAttribute('material', 'visible', false);
            this.selected.removeState('selected');
            this.selected = null;
        }
    }
});
