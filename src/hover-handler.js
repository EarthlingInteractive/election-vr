import 'aframe';

const { AFRAME } = window;
const { THREE } = AFRAME;

/**
 * Responds to the pointer hovering over a 'hoverable' part of the map.
 */
AFRAME.registerComponent('hover-handler', {
    init() {
        this.hoverBox = new THREE.Box3Helper(new THREE.Box3(), 'darkgrey');
        this.hoverBox.visible = false;
        this.el.setObject3D('hoverBox', this.hoverBox);

        this.handleHoverStart = this.handleHoverStart.bind(this);
        this.el.addEventListener('hover-start', this.handleHoverStart);
        this.handleHoverEnd = this.handleHoverEnd.bind(this);
        this.el.addEventListener('hover-end', this.handleHoverEnd);
        this.el.sceneEl.addEventListener('year-changed', this.handleHoverEnd);
    },

    remove() {
        this.el.removeEventListener('hover-start', this.handleHoverStart);
        this.el.removeEventListener('hover-end', this.handleHoverEnd);
        this.el.sceneEl.removeEventListener('year-changed', this.handleHoverEnd);
    },

    handleHoverStart(evt) {
        this.selected = evt.target;
        if (this.selected.components.hoverable) {
            const selectedObj = this.selected.getObject3D('mesh');
            const selectedObjWorldCenter = selectedObj.getWorldPosition();
            const boxCenter = this.el.object3D.worldToLocal(selectedObjWorldCenter);

            selectedObj.geometry.computeBoundingBox();
            const selectionBox = new THREE.Box3();
            selectionBox.setFromCenterAndSize(boxCenter, selectedObj.geometry.boundingBox.getSize());

            this.hoverBox.box = selectionBox;
            this.hoverBox.visible = true;
        }
    },

    handleHoverEnd() {
        this.hoverBox.visible = false;
        this.selected = null;
    }
});
