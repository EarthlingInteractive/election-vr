import 'aframe';
import { YEARS } from './constants';

const { AFRAME } = window;

/**
 * Displays a selectable button for each year
 */
AFRAME.registerComponent('year-selector', {
    schema: {
        selectedYear: {
            type: 'string'
        },
        selectionColor: {
            type: 'color',
            default: '#E5C601'
        }
    },

    init() {
        this.handleHoverStart = this.handleHoverStart.bind(this);
        this.handleHoverEnd = this.handleHoverEnd.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.createButtons();
    },

    update(oldData) {
        if (this.data.selectedYear !== oldData.selectedYear || this.data.selectionColor !== oldData.selectionColor) {
            YEARS.forEach((year) => {
                const button = this.buttons[year];
                if (year === this.data.selectedYear) {
                    button.setAttribute('material', 'color', this.data.selectionColor);
                } else {
                    button.setAttribute('material', 'color', '#FFFFFF');
                }
            });
        }
        if (this.data.selectedYear !== oldData.selectedYear) {
            this.el.emit('year-changed', { year: this.data.selectedYear }, true);
        }
    },

    remove() {
        YEARS.forEach((year) => {
            const button = this.buttons[year];
            const buttonBorder = button.querySelector('.border');
            buttonBorder.removeEventListener('hover-start', this.handleHoverStart);
            buttonBorder.removeEventListener('hover-end', this.handleHoverEnd);
        });
    },

    handleStateChange(evt) {
        if (evt.detail === 'clicked') {
            YEARS.forEach((year) => {
                const button = this.buttons[year];
                if (button === evt.target) {
                    button.setAttribute('material', 'color', this.data.selectionColor);
                    this.el.setAttribute('year-selector', 'selectedYear', year);
                } else {
                    button.setAttribute('material', 'color', '#FFFFFF');
                }
            });
        }
    },

    handleHoverStart(evt) {
        const buttonBorder = evt.target;
        buttonBorder.setAttribute('material', 'color', this.data.selectionColor);
        evt.detail.hand.components.haptics.pulse(0.2, 10);
    },

    handleHoverEnd(evt) {
        const buttonBorder = evt.target;
        buttonBorder.setAttribute('material', 'color', 'black');
    },

    createButtons() {
        let xPos = 0;
        const buttonWidth = 0.5;
        this.buttons = {};
        YEARS.forEach((year) => {
            const button = document.createElement('a-entity');
            button.setAttribute('geometry', { primitive: 'plane', height: 0.25, width: buttonWidth });
            button.setAttribute('class', 'selectable');
            button.setAttribute('clickable', {});
            button.addEventListener('stateadded', this.handleStateChange);
            button.setAttribute('position', `${xPos} 0 0`);
            button.setAttribute('material', 'shader', 'flat');
            button.setAttribute('material', 'color', '#FFFFFF');
            button.setAttribute('text', 'value', year);
            button.setAttribute('text', 'color', 'black');
            button.setAttribute('text', 'wrapCount', '4');
            button.setAttribute('text', 'align', 'center');
            button.setAttribute('text', 'zOffset', '0.05');

            const buttonBorder = document.createElement('a-plane');
            buttonBorder.setAttribute('class', 'border');
            buttonBorder.setAttribute('hoverable', {});
            buttonBorder.setAttribute('position', '0 0 -0.005');
            buttonBorder.setAttribute('material', 'shader', 'flat');
            buttonBorder.setAttribute('material', 'color', 'black');
            buttonBorder.setAttribute('height', 0.29);
            buttonBorder.setAttribute('width', buttonWidth + 0.04);
            buttonBorder.addEventListener('hover-start', this.handleHoverStart);
            buttonBorder.addEventListener('hover-end', this.handleHoverEnd);

            button.appendChild(buttonBorder);

            this.buttons[year] = button;
            this.el.appendChild(button);
            xPos += (buttonWidth + (buttonWidth * 0.1));
        });
    }
});
