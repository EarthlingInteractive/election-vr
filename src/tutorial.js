import 'aframe';

const { AFRAME } = window;

AFRAME.registerComponent('tutorial', {
    schema: {
        currentStep: {
            type: 'number',
            default: -1
        }
    },

    init() {
        this.superHands = document.querySelector('[progressive-controls]');
        this.handleControllerChange = this.handleControllerChange.bind(this);
        this.superHands.addEventListener('controller-progressed', this.handleControllerChange);
        this.tutorialSteps = this.el.querySelectorAll('[tutorial-step]');

        this.handleNextStep = this.handleNextStep.bind(this);
        this.el.addEventListener('next-step', this.handleNextStep);
        this.nextStepButton = document.querySelector('#next-tutorial-step');
        this.nextStepButton.addEventListener('clicked', this.handleNextStep);

        this.handleStartTutorial = this.handleStartTutorial.bind(this);
        this.startTutorialButton = document.querySelector('#start-tutorial');
        this.startTutorialButton.addEventListener('clicked', this.handleStartTutorial);

        this.handleStopTutorial = this.handleStopTutorial.bind(this);
        this.stopTutorialButton = document.querySelector('#stop-tutorial');
        this.stopTutorialButton.addEventListener('clicked', this.handleStopTutorial);

        this.handleControllerChange();
    },

    remove() {
        this.el.sceneEl.removeEventListener('target-selected', this.handleNextStep);
        this.el.removeEventListener('next-step', this.handleNextStep);
        this.nextStepButton.removeEventListener('clicked', this.handleNextStep);
        this.startTutorialButton.removeEventListener('clicked', this.handleStartTutorial);
        this.stopTutorialButton.removeEventListener('clicked', this.handleStopTutorial);
    },

    update(oldData) {
        if (this.data.currentStep !== oldData.currentStep) {
            this.transition(oldData.currentStep, this.data.currentStep);
        }
    },

    transition(prevStep, nextStep) {
        if (this.hasStep(prevStep)) {
            this.getStep(prevStep).hide();
        }
        if (this.hasStep(nextStep)) {
            this.getStep(nextStep).show();
        }
        if (!this.tutorialSteps[nextStep]) {
            this.handleStopTutorial();
        }
    },

    getStep(index) {
        return this.tutorialSteps[index].components['tutorial-step'];
    },

    hasStep(index) {
        return (index !== undefined && index >= 0 && this.tutorialSteps[index]);
    },

    handleStartTutorial() {
        this.startTutorialButton.setAttribute('visible', false);
        this.startTutorialButton.setAttribute('position', '-5 -0.5 -1');
        this.nextStepButton.setAttribute('visible', true);
        this.stopTutorialButton.setAttribute('visible', true);
        this.el.setAttribute('tutorial', 'currentStep', 0);
    },

    handleStopTutorial() {
        this.startTutorialButton.setAttribute('visible', true);
        this.startTutorialButton.setAttribute('position', '0 -1.25 0.01');
        this.nextStepButton.setAttribute('visible', false);
        this.stopTutorialButton.setAttribute('visible', false);
        this.el.setAttribute('tutorial', 'currentStep', -1);
    },

    handleControllerChange() {
        // gaze, desktop, single point, multipointer
        const progressiveControls = this.superHands.components['progressive-controls'];
        const lvl = progressiveControls.currentLevel.get('right');
        const level = progressiveControls.levels[lvl];
        let controllerType = '';
        if (level === 'gaze') {
            if (!AFRAME.utils.device.checkHeadsetConnected()) {
                controllerType = 'desktop';
            } else {
                controllerType = 'gaze';
            }
        } else if (progressiveControls.currentLevel.size === 1) {
            controllerType = 'singlePointer';
        } else {
            controllerType = 'doublePointer';
        }
        this.determineRelevantSteps(controllerType);
    },

    determineRelevantSteps(controllerType) {
        const tutorialSteps = this.el.querySelectorAll('[tutorial-step]');
        this.tutorialSteps = [];
        for (let i = 0; i < tutorialSteps.length; i += 1) {
            const step = tutorialSteps[i];
            const types = step.getAttribute('tutorial-step').controllerTypes;
            if (types.length === 0 || types.includes(controllerType)) {
                this.tutorialSteps.push(step);
            }
        }
    },

    handleNextStep() {
        let nextStep = (this.data.currentStep + 1);
        if (nextStep > this.tutorialSteps.length) {
            nextStep = -1;
        }
        this.el.setAttribute('tutorial', 'currentStep', nextStep);
    }
});
