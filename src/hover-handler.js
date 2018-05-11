/*
 * ElectionVR: A visualization of the popular vote in recent U.S. Presidential elections using WebVR.
 * Copyright (C) 2018 Earthling Interactive
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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

            if (evt.detail.hand.components.haptics) {
                evt.detail.hand.components.haptics.pulse(0.2, 10);
            }
            this.hoverBox.box = selectionBox;
            this.hoverBox.visible = true;
        }
    },

    handleHoverEnd() {
        this.hoverBox.visible = false;
        this.selected = null;
    }
});
