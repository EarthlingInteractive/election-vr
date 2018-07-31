import 'aframe';

const { AFRAME } = window;

AFRAME.registerPrimitive('a-text-panel', {
    defaultComponents: {
        geometry: {
            primitive: 'plane',
            width: 0.5,
            height: 'auto'
        },
        material: {
            shader: 'flat',
            color: 'black',
            opacity: 1
        },
        text: {
            color: 'white',
            align: 'center',
            wrapCount: 32,
            zOffset: 0.005
        }
    },

    mappings: {
        primitive: 'geometry.primitive',
        width: 'geometry.width',
        height: 'geometry.height',
        textcolor: 'text.color',
        textalign: 'text.align',
        textwrapcount: 'text.wrapCount',
        textvalue: 'text.value',
        panelcolor: 'material.color',
        opacity: 'material.opacity',
        textopacity: 'text.opacity'
    }
});
