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
        console.log(this.selected);
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
            const { x, z } = this.selected.object3D.getWorldPosition();
            this.infoPanel.setAttribute('position', { x, y: 1, z });
        }
    },

    handleSelectionEnd() {
        this.selectionBox.visible = false;
        this.selected = null;
    }
});
