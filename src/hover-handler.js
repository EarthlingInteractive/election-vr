import 'aframe';

const { AFRAME } = window;

/**
 * Responds to the pointer hovering over a 'hoverable' part of the map.
 */
AFRAME.registerComponent('hover-handler', {
    init() {
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
            this.selected.setAttribute('scale', '1.05 1.05 1.01');
            this.selected.setAttribute('material', 'visible', true);
            if (evt.detail.hand.components.haptics) {
                evt.detail.hand.components.haptics.pulse(0.2, 10);
            }
        }
    },

    handleHoverEnd() {
        if (this.selected && !this.selected.is('selected')) {
            this.selected.setAttribute('scale', '1 1 1');
            this.selected.setAttribute('material', 'visible', false);
        }
    }
});
