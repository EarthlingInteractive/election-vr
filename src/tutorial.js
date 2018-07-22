import 'aframe';

const { AFRAME } = window;

AFRAME.registerComponent('tutorial', {
    schema: {
        currentStep: {
            type: 'number',
            default: 0
        }
    },

    init() {
        this.tutorialSteps = this.el.querySelectorAll('[tutorial-step]');
        this.handleNextStep = this.handleNextStep.bind(this);
        this.el.addEventListener('next-step', this.handleNextStep);
    },

    remove() {
        this.el.sceneEl.removeEventListener('target-selected', this.handleNextStep);
        this.el.removeEventListener('next-step', this.handleNextStep);
    },

    update(oldData) {
        if (this.data.currentStep !== oldData.currentStep) {
            this.transition(oldData.currentStep, this.data.currentStep);
        }
    },

    transition(prevStep, nextStep) {
        if (prevStep !== undefined && prevStep >= 0) {
            this.tutorialSteps[prevStep].components['tutorial-step'].hide();
        }
        window.setTimeout(() => {
            this.tutorialSteps[nextStep].components['tutorial-step'].show();
        }, 300);
    },

    handleNextStep() {
        const stepCount = this.tutorialSteps.length;
        const nextStep = (this.data.currentStep + 1) % stepCount;
        this.el.setAttribute('tutorial', 'currentStep', nextStep);
    }
});
