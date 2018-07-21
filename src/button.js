import 'aframe';

const { AFRAME } = window;

/**
 * Displays a selectable button for each year
 */
AFRAME.registerComponent('button', {
    schema: {
        value: {
            type: 'string'
        },
        textColor: {
            type: 'color',
            default: '#000000'
        },
        textWrapCount: {
            default: 4
        },
        buttonColor: {
            type: 'color',
            default: '#FFFFFF'
        },
        borderColor: {
            type: 'color',
            default: '#000000'
        },
        selectionColor: {
            type: 'color',
            default: '#E5C601'
        },
        buttonHeight: {
            default: 0.25
        },
        buttonWidth: {
            default: 0.5
        }
    },

    init() {
        this.handleHoverStart = this.handleHoverStart.bind(this);
        this.handleHoverEnd = this.handleHoverEnd.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.renderLayout();
    },

    update(oldData) {
        if (!AFRAME.utils.deepEqual(oldData, this.data)) {
            this.renderLayout();
        }
    },

    remove() {
        this.buttonBorder.removeEventListener('hover-start', this.handleHoverStart);
        this.buttonBorder.removeEventListener('hover-end', this.handleHoverEnd);
        this.button.removeEventListener('stateadded', this.handleStateChange);
    },

    handleStateChange(evt) {
        if (evt.detail === 'clicked') {
            this.button.setAttribute('material', 'color', this.data.selectionColor);
            window.setTimeout(() => {
                this.button.setAttribute('material', 'color', this.data.buttonColor);
            }, 500);
        }
    },

    handleHoverStart(evt) {
        this.buttonBorder.setAttribute('material', 'color', this.data.selectionColor);
        if (evt.detail.hand.components.haptics) {
            evt.detail.hand.components.haptics.pulse(0.2, 10);
        }
    },

    handleHoverEnd() {
        this.buttonBorder.setAttribute('material', 'color', this.data.borderColor);
    },

    renderLayout() {
        if (!this.button) {
            this.button = document.createElement('a-entity');
            this.button.setAttribute('class', 'selectable button');
            this.button.setAttribute('clickable', {});
            this.button.setAttribute('onclick', 'this.emit("grab-start", {}); this.emit("grab-end", {});');
            this.button.addEventListener('stateadded', this.handleStateChange);
            this.button.setAttribute('material', 'shader', 'flat');
            this.button.setAttribute('text', 'align', 'center');
            this.el.appendChild(this.button);
        }
        this.button.setAttribute('geometry', { primitive: 'plane', height: this.data.buttonHeight, width: this.data.buttonWidth });
        this.button.setAttribute('material', 'color', this.data.buttonColor);
        this.button.setAttribute('text', 'value', this.data.value);
        this.button.setAttribute('text', 'color', this.data.textColor);
        this.button.setAttribute('text', 'wrapCount', this.data.textWrapCount);

        if (!this.buttonBorder) {
            this.buttonBorder = document.createElement('a-plane');
            this.buttonBorder.setAttribute('class', 'border');
            this.buttonBorder.setAttribute('hoverable', {});
            this.buttonBorder.setAttribute('position', '0 0 -0.005');
            this.buttonBorder.setAttribute('material', 'shader', 'flat');
            this.buttonBorder.addEventListener('hover-start', this.handleHoverStart);
            this.buttonBorder.addEventListener('hover-end', this.handleHoverEnd);
            this.button.appendChild(this.buttonBorder);
        }
        const scaleFactor = 1.16;
        this.buttonBorder.setAttribute('height', this.data.buttonHeight * scaleFactor);
        this.buttonBorder.setAttribute('width', this.data.buttonWidth * scaleFactor);
        this.buttonBorder.setAttribute('material', 'color', this.data.borderColor);
    }
});
