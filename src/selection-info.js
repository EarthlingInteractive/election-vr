import 'aframe';

const { AFRAME } = window;

AFRAME.registerComponent('selection-info', {
    schema: {
        state: {
            type: 'string'
        },
        candidate: {
            type: 'string'
        },
        votes: {
            type: 'number'
        },
        percentage: {
            type: 'number'
        }
    }
});
