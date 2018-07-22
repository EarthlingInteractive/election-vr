import 'aframe';

const { AFRAME } = window;
/*
problems to solve:
* Anchor to either the camera or a fixed point
* trigger for a particular controller type, though maybe that's a responsibility of tutorial
* transition when a particular event gets fired, though maybe that's also a tutorial thing
* but all the will make tutorial tightly coupled to tutorial step
* what if a tutorial-step was self-sufficient and knew what its next step was?
* I like being able to declare them all in one spot, though
 */
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
            default: 'a-camera'
        },
        offset: {
            type: 'vec3',
            default: { x: 0, y: 0, z: -1 }
        },
        textvalue: {
            type: 'string'
        }
    },

    init() {
        this.handleAnimationComplete = this.handleAnimationComplete.bind(this);
        this.handleTriggerEvent = this.handleTriggerEvent.bind(this);
        this.stepEl = document.createElement('a-text-panel');
        this.stepEl.object3D.visible = false;
        this.stepEl.setAttribute('opacity', 0);
        this.stepEl.setAttribute('textopacity', 0);
        const fadeinProps = {
            dur: 300,
            easing: 'linear',
            from: 0,
            to: 1,
            startEvents: 'show-step'
        };
        this.stepEl.setAttribute('animation__fadein_panel', { property: 'opacity', ...fadeinProps });
        this.stepEl.setAttribute('animation__fadein_text', { property: 'textopacity', ...fadeinProps });
        const fadeoutProps = {
            dur: 300,
            easing: 'linear',
            from: 1,
            to: 0,
            startEvents: 'hide-step'
        };
        this.stepEl.setAttribute('animation__fadeout_panel', { property: 'opacity', ...fadeoutProps });
        this.stepEl.setAttribute('animation__fadeout_text', { property: 'textopacity', dur: 100, ...fadeoutProps });
        this.stepEl.addEventListener('animationcomplete', this.handleAnimationComplete);
    },

    handleAnimationComplete(e) {
        if (e.detail.name === 'animation__fadeout_panel') {
            this.stepEl.object3D.visible = false;
        }
    },

    handleTriggerEvent(e) {
        console.log('triggerEvent', e);
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
        }
        if (this.data.triggerEvent) {
            this.el.sceneEl.removeEventListener(this.data.triggerEvent, this.handleTriggerEvent);
        }
        this.stepEl.emit('hide-step');
    }
});
