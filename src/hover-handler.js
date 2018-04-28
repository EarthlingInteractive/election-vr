import 'aframe';

const { AFRAME } = window;
const { THREE } = AFRAME;

/**
 * Responds to a raycaster event intersecting part of the map.
 */
AFRAME.registerComponent('hover-handler', {
    init() {
        this.hoverBox = new THREE.BoxHelper(undefined, 'darkgrey');
        this.hoverBox.visible = false;
        this.el.sceneEl.setObject3D('hoverbox', this.hoverBox);

        this.handleSelection = this.handleSelection.bind(this);
        this.el.addEventListener('hover-start', this.handleSelection);
        this.handleSelectionEnd = this.handleSelectionEnd.bind(this);
        this.el.addEventListener('hover-end', this.handleSelectionEnd);
    },

    remove() {
        this.el.removeEventListener('hover-start', this.handleSelection);
        this.el.removeEventListener('hover-end', this.handleSelectionEnd);
    },

    handleSelection(evt) {
        this.selected = evt.target;
        const selectedObj = this.selected.getObject3D('mesh');
        this.hoverBox.setFromObject(selectedObj);
        this.hoverBox.visible = true;
    },

    handleSelectionEnd() {
        this.hoverBox.visible = false;
        this.selected = null;
    }
});
