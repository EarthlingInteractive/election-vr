import 'aframe';

const { AFRAME } = window;

AFRAME.registerComponent('tutorial-step', {
    schema: {
        dur: {
            type: 'number'
        },
        controllerTypes: {
            type: 'array'
        },
        triggerEvent: {
            type: 'string'
        },
        anchor: {
            type: 'selector',
            default: '[tutorial]'
        },
        offset: {
            type: 'vec3',
            default: { x: 0, y: 0, z: 0 }
        },
        textvalue: {
            type: 'string'
        }
    },

    init() {
        this.handleTriggerEvent = this.handleTriggerEvent.bind(this);
        this.stepEl = document.createElement('a-text-panel');
        this.stepEl.object3D.visible = false;
        this.stepEl.setAttribute('opacity', 0);
        this.stepEl.setAttribute('textopacity', 0);
        this.stepEl.setAttribute('height', 2);
        this.stepEl.setAttribute('width', 4);
        const fadeinProps = {
            dur: 400,
            easing: 'linear',
            from: 0,
            to: 1,
            startEvents: 'show-step'
        };
        this.stepEl.setAttribute('animation__fadein_panel', { property: 'opacity', ...fadeinProps });
        this.stepEl.setAttribute('animation__fadein_text', { property: 'textopacity', ...fadeinProps });
    },

    handleTriggerEvent() {
        this.el.emit('next-step');
    },

    update(oldData) {
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
        }
        this.stepEl.setAttribute('textvalue', this.data.textvalue);
        this.stepEl.setAttribute('position', this.data.offset);
        if (this.data.anchor !== oldData.anchor) {
            if (oldData.anchor) {
                oldData.anchor.removeChild(this.stepEl);
            }
            this.data.anchor.appendChild(this.stepEl);
        }
    },

    remove() {
        this.data.anchor.removeChild(this.stepEl);
        this.stepEl.removeEventListener('animationcomplete', this.handleAnimationComplete);
    },

    show() {
        this.stepEl.object3D.visible = true;
        this.stepEl.setAttribute('opacity', 0);
        this.stepEl.setAttribute('textopacity', 0);
        if (this.data.triggerEvent) {
            this.el.sceneEl.addEventListener(this.data.triggerEvent, this.handleTriggerEvent);
        }

        this.stepEl.emit('show-step');
        if (this.data.dur && !this.timeoutId) {
            this.timeoutId = window.setTimeout(() => {
                this.timeoutId = null;
                this.el.emit('next-step');
            }, this.data.dur);
        }
    },

    hide() {
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        if (this.data.triggerEvent) {
            this.el.sceneEl.removeEventListener(this.data.triggerEvent, this.handleTriggerEvent);
        }
        this.stepEl.object3D.visible = false;
    }
});
