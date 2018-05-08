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
        if (evt.detail.level === 'gaze') {
            this.setupGazeHelp(evt.target);
        } else if (evt.detail.hand === 'right') {
            this.setupRightPointerHelp(evt.target);
        } else {
            this.setupLeftPointerHelp(evt.target);
        }
        this.showHelp();
    },

    createTextPanel(text) {
        const textPanel = document.createElement('a-entity');
        textPanel.setAttribute('geometry', { primitive: 'plane', height: 'auto' });
        textPanel.setAttribute('material', 'shader', 'flat');
        textPanel.setAttribute('material', 'color', 'white');
        textPanel.setAttribute('material', 'opacity', '0.75');
        textPanel.setAttribute('text', 'color', 'black');
        // textPanel.setAttribute('text', 'zOffset', '0.01');
        textPanel.setAttribute('text', 'value', text);
        return textPanel;
    },

    setupGazeHelp(controlsEl) {
        this.clearPointerHelpEls();
        let helpText = 'Gaze at something for 1 second to select it.';
        if (!AFRAME.utils.device.isMobile()) {
            helpText += '\nUse the w-a-s-d keys to move around.';
        }
        const gazeHelp = this.createTextPanel(helpText);
        gazeHelp.setAttribute('text', 'wrapCount', '15');
        gazeHelp.setAttribute('geometry', 'width', '0.5');
        gazeHelp.setAttribute('text', 'align', 'center');
        gazeHelp.setAttribute('position', '0.3 0 -2');
        const gazeEl = controlsEl.components['progressive-controls'].caster;
        gazeEl.parentEl.appendChild(gazeHelp);
        this.helpEls.gazeHelp = gazeHelp;
    },

    setupRightPointerHelp(controlsEl) {
        this.clearGazeHelpEl();
        const helpText = `To select something, point the laser at it and pull the trigger button.\n
        To move the map, point the laser at it, hold down the grip buttons, and move the controller.`;
        const rightPointerHelpEl = this.createTextPanel(helpText);
        rightPointerHelpEl.setAttribute('geometry', 'width', '0.18');
        rightPointerHelpEl.setAttribute('text', 'wrapCount', '20');
        rightPointerHelpEl.setAttribute('text', 'align', 'left');
        rightPointerHelpEl.setAttribute('position', '0.15 0 0.05');
        rightPointerHelpEl.setAttribute('rotation', '-90 0 0');
        const rightPointer = controlsEl.components['progressive-controls'].right;
        rightPointer.appendChild(rightPointerHelpEl);
        this.helpEls.rightPointerHelpEl = rightPointerHelpEl;
    },

    setupLeftPointerHelp(controlsEl) {
        this.clearGazeHelpEl();
        const helpText = `To resize the map, point both the lasers at the map, hold down both triggers, and move the controllers apart or together.\n
        To resize and move the map at the same time, point both the lasers at the map, hold down the grip buttons on both controllers, and move the controllers around.`;
        const leftPointerHelpEl = this.createTextPanel(helpText);
        leftPointerHelpEl.setAttribute('geometry', 'width', '0.18');
        leftPointerHelpEl.setAttribute('text', 'wrapCount', '20');
        leftPointerHelpEl.setAttribute('text', 'align', 'left');
        leftPointerHelpEl.setAttribute('position', '-0.15 0 0.05');
        leftPointerHelpEl.setAttribute('rotation', '-90 0 0');
        const leftPointer = controlsEl.components['progressive-controls'].left;
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

    clearGazeHelpEl() {
        if (this.helpEls.gazeHelp) {
            this.helpEls.gazeHelp.parentEl.removeChild(this.helpEls.gazeHelp);
            delete this.helpEls.gazeHelp;
        }
    },

    clearPointerHelpEls() {
        if (this.helpEls.rightPointerHelpEl) {
            this.helpEls.rightPointerHelpEl.parentEl.removeChild(this.helpEls.rightPointerHelpEl);
            delete this.helpEls.rightPointerHelpEl;
        }
        if (this.helpEls.leftPointerHelpEl) {
            this.helpEls.leftPointerHelpEl.parentEl.removeChild(this.helpEls.leftPointerHelpEl);
            delete this.helpEls.leftPointerHelpEl;
        }
    },

    clearHelpEls() {
        this.clearGazeHelpEl();
        this.clearPointerHelpEls();
    }
});
