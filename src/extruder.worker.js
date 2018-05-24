import * as THREE from 'three';

const extrudeShapes = (height, shapes, percentage, zPosition) => {
    const extrudeSettings = {
        amount: height,
        bevelEnabled: false
    };

    const extrudedFeatureGeometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
    extrudedFeatureGeometry.computeBoundingBox();
    const center = extrudedFeatureGeometry.boundingBox.getCenter();
    extrudedFeatureGeometry.center();
    extrudedFeatureGeometry.scale(percentage, percentage, 1);
    extrudedFeatureGeometry.translate(center.x, center.y, center.z + zPosition);
    return extrudedFeatureGeometry;
};

onmessage = (e) => {
    const { height, shapes, percentage, zPosition } = e.data;
    const result = extrudeShapes(height, shapes, percentage, zPosition);
    postMessage(result);
};
