import 'aframe';

const { AFRAME } = window;

AFRAME.registerComponent('help', {
    init() {
        this.superHands = document.querySelector('[progressive-controls]');
        this.handleControllerChange = this.handleControllerChange.bind(this);
        this.superHands.addEventListener('controller-progressed', this.handleControllerChange);
        this.hideHelp = this.hideHelp.bind(this);
        this.el.sceneEl.addEventListener('year-changed', this.hideHelp);
        this.helpEls = {};
    },

    remove() {
        this.superHands.removeEventListener('controller-progressed', this.handleControllerChange);
        this.el.sceneEl.removeEventListener('year-changed', this.hideHelp);
        this.clearHelpEls();
    },

    handleControllerChange(evt) {
        this.clearHelpEls();
        if (evt.detail.level === 'gaze') {
            this.setupGazeHelp();
        } else if (evt.detail.hand === 'right') {
            this.setupRightPointerHelp();
        } else {
            this.setupLeftPointerHelp();
        }
        this.showHelp();
    },

    createTextPanel(text) {
        const textPanel = document.createElement('a-entity');
        textPanel.setAttribute('geometry', { primitive: 'plane', height: 'auto', width: 'auto' });
        textPanel.setAttribute('material', 'shader', 'flat');
        textPanel.setAttribute('material', 'color', 'white');
        textPanel.setAttribute('material', 'opacity', '0.75');
        textPanel.setAttribute('text', 'color', 'black');
        textPanel.setAttribute('text', 'zOffset', '0.05');
        textPanel.setAttribute('text', 'value', text);
        return textPanel;
    },

    setupGazeHelp() {
        const gazeHelp = this.createTextPanel('Gaze at something for 1 second to select it');
        gazeHelp.setAttribute('text', 'wrapCount', '24');
        gazeHelp.setAttribute('text', 'align', 'center');
        gazeHelp.setAttribute('position', '0.6 0 -2');
        const gazeEl = document.querySelector('a-camera');
        gazeEl.appendChild(gazeHelp);
        this.helpEls.gazeEl = gazeEl;
    },

    setupRightPointerHelp() {
        const helpText = `To select something, point the laser at it and pull the trigger button.\n
        To move the map, hold down the grip buttons and move the controller.`;
        const rightPointerHelpEl = this.createTextPanel(helpText);
        rightPointerHelpEl.setAttribute('text', 'wrapCount', '22');
        rightPointerHelpEl.setAttribute('text', 'align', 'left');
        rightPointerHelpEl.setAttribute('position', '0.6 0 -2');
        const rightPointer = document.querySelector('.right-controller');
        rightPointer.appendChild(rightPointerHelpEl);
        this.helpEls.rightPointerHelpEl = rightPointerHelpEl;
    },

    setupLeftPointerHelp() {
        const helpText = 'To resize the map, hold down both triggers or grip buttons and move the controllers apart or together.';
        const leftPointerHelpEl = this.createTextPanel(helpText);
        leftPointerHelpEl.setAttribute('text', 'wrapCount', '22');
        leftPointerHelpEl.setAttribute('text', 'align', 'left');
        leftPointerHelpEl.setAttribute('position', '-0.6 0 -2');
        const leftPointer = document.querySelector('.left-controller');
        leftPointer.appendChild(leftPointerHelpEl);
        this.helpEls.leftPointerHelpEl = leftPointerHelpEl;
    },

    showHelp() {
        Object.keys(this.helpEls).forEach((key) => {
            const helpEl = this.helpEls[key];
            helpEl.setAttribute('visible', true);
        });
    },

    hideHelp() {
        Object.keys(this.helpEls).forEach((key) => {
            const helpEl = this.helpEls[key];
            helpEl.setAttribute('visible', false);
        });
    },

    clearHelpEls() {
        Object.keys(this.helpEls).forEach((key) => {
            const helpEl = this.helpEls[key];
            helpEl.parentEl.removeChild(helpEl);
            delete this.helpEls[key];
        });
    }
});
