import 'aframe';

const { AFRAME } = window;

/**
 * Scales an object based on a touch and slide gesture on a controller trackpad.
 */
AFRAME.registerComponent('zoom-handler', {
    init() {
        this.mapEl = document.querySelector('#map'); // todo: make this configurable using the schema
        this.handleTrackpadTouchStart = this.handleTrackpadTouchStart.bind(this);
        this.el.addEventListener('trackpadtouchstart', this.handleTrackpadTouchStart);
        this.handleAxisMove = this.handleAxisMove.bind(this);
        this.el.addEventListener('trackpadmoved', this.handleAxisMove);
        this.handleTrackpadTouchEnd = this.handleTrackpadTouchEnd.bind(this);
        this.el.addEventListener('trackpadtouchend', this.handleTrackpadTouchEnd);
    },

    remove() {
        this.el.removeEventListener('trackpadtouchstart', this.handleTrackpadTouchStart);
        this.el.removeEventListener('trackpadmoved', this.handleAxisMove);
        this.el.removeEventListener('trackpadtouchend', this.handleTrackpadTouchEnd);
    },

    handleTrackpadTouchStart(evt) {
        console.log('trackpad touch start', evt);
    },

    handleAxisMove(evt) {
        console.log('handleAxisMove event', evt);
    },

    handleTrackpadTouchEnd(evt) {
        console.log('trackpad touch end', evt);
    }
});
