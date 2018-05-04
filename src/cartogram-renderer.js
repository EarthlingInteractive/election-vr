import 'aframe';
import { scaleLinear } from 'd3-scale';
import * as constants from './constants';
import candidateInfo from './candidate-info';

const { AFRAME } = window;
const { THREE } = AFRAME;

const invisibleMaterial = new THREE.MeshBasicMaterial({ visible: false });

const createExtrudedAndScaledGeometry = (height, stateShapes, percentage, zPosition) => {
    const extrudeSettings = {
        amount: height,
        bevelEnabled: false
    };

    const extrudedFeatureGeometry = new THREE.ExtrudeGeometry(stateShapes, extrudeSettings);
    extrudedFeatureGeometry.computeBoundingBox();
    const center = extrudedFeatureGeometry.boundingBox.getCenter();
    extrudedFeatureGeometry.center();
    extrudedFeatureGeometry.scale(percentage, percentage, 1);
    extrudedFeatureGeometry.translate(center.x, center.y, center.z + zPosition);
    return extrudedFeatureGeometry;
};
const createExtrudedAndScaledGeometryPerShape = (height, stateShapes, percentage, zPosition) => {
    const extrudeSettings = {
        amount: height,
        bevelEnabled: false
    };
    const extrudeGeometry = new THREE.Geometry();
    stateShapes.forEach((stateShape) => {
        const extrudedFeatureGeometry = new THREE.ExtrudeGeometry(stateShape, extrudeSettings);
        extrudedFeatureGeometry.computeBoundingBox();
        const center = extrudedFeatureGeometry.boundingBox.getCenter();
        extrudedFeatureGeometry.center();
        extrudedFeatureGeometry.scale(percentage, percentage, 1);
        extrudedFeatureGeometry.translate(center.x, center.y, center.z + zPosition);

        extrudeGeometry.merge(extrudedFeatureGeometry);
    });
    return extrudeGeometry;
};

const createSelectionMask = (inputGeometry, name, attributes) => {
    const selectionMaskGeometry = new THREE.BufferGeometry();
    selectionMaskGeometry.fromGeometry(inputGeometry);
    selectionMaskGeometry.computeBoundingBox();
    const center = selectionMaskGeometry.boundingBox.getCenter();
    selectionMaskGeometry.translate(-center.x, -center.y, -center.z);

    const mesh = new THREE.Mesh(selectionMaskGeometry, invisibleMaterial);
    mesh.name = name;
    const selectionMaskEntity = document.createElement('a-entity');
    selectionMaskEntity.setAttribute('id', name);
    selectionMaskEntity.setAttribute('position', center);
    selectionMaskEntity.setAttribute('class', 'selectable');
    selectionMaskEntity.setAttribute('selection-info', attributes);
    selectionMaskEntity.setAttribute('hoverable', '');
    selectionMaskEntity.setObject3D('mesh', mesh);
    return selectionMaskEntity;
};

AFRAME.registerComponent('cartogram-renderer', {
    dependencies: ['geo-projection'],
    schema: {
        maxExtrudeHeight: {
            default: 1.6
        }
    },
    init() {
        this.geoProjectionComponent = this.el.components['geo-projection'];
        this.system = this.el.sceneEl.systems['geo-projection'];
        this.handleGeoDataReady = this.handleGeoDataReady.bind(this);
        this.handleElectionDataReady = this.handleElectionDataReady.bind(this);
        this.el.addEventListener('geo-data-ready', this.handleGeoDataReady);
        this.el.addEventListener('election-data-loaded', this.handleElectionDataReady);
    },
    remove() {
        this.el.removeEventListener('geo-data-ready', this.handleGeoDataReady);
        this.el.removeEventListener('election-data-loaded', this.handleElectionDataReady);
        this.clearMap(true);
    },
    update(oldData) {
        if (this.data.maxExtrudeHeight !== oldData.maxExtrudeHeight) {
            this.render();
        }
    },
    handleGeoDataReady() {
        this.render();
    },
    handleElectionDataReady(evt) {
        const electionDataLoadEvent = evt.detail;
        this.votesByFipsCode = electionDataLoadEvent.votesByFipsCode;
        this.maxTotalVoters = electionDataLoadEvent.maxTotalVoters;
        this.render();
    },
    isReady() {
        return !!(this.votesByFipsCode && this.geoProjectionComponent.geoJson);
    },
    render() {
        this.clearMap();
        if (!this.isReady()) return;

        // Determine the vertical scale for the entire country using the state with the largest number of total voters
        // as equaling the max extrude height
        const extrudeScale = scaleLinear()
            .domain([0, this.maxTotalVoters])
            .range([0, this.data.maxExtrudeHeight]);

        const candidateMetadata = {};

        this.geoProjectionComponent.geoJson.features.forEach((feature) => {
            const votingData = this.votesByFipsCode[feature.id];
            const mapRenderContext = this.system.renderToContext(feature, this.geoProjectionComponent.projection);
            const stateShapes = mapRenderContext.toShapes();

            let zPosition = 0;

            const stateSelectionEntity = document.createElement('a-entity');
            stateSelectionEntity.setAttribute('id', `state-${feature.id}`);

            votingData.forEach((candidateData) => {
                const percentage = (candidateData.votes / candidateData.totalVoters);
                const height = extrudeScale(candidateData.votes);

                if (!candidateMetadata[candidateData.name]) {
                    const info = candidateInfo[candidateData.name];
                    candidateMetadata[candidateData.name] = {
                        geometry: new THREE.Geometry(),
                        ...info
                    };
                }
                const candidateMetadatum = candidateMetadata[candidateData.name];
                const extrudeGeometry = candidateMetadatum.geometry;

                // Hawaii looks better when rendered per shape
                let featureGeometry;
                if (feature.id === '15') {
                    featureGeometry = createExtrudedAndScaledGeometryPerShape(height, stateShapes, percentage, zPosition);
                } else {
                    featureGeometry = createExtrudedAndScaledGeometry(height, stateShapes, percentage, zPosition);
                }
                extrudeGeometry.merge(featureGeometry);

                const candidateName = `${candidateMetadatum.firstName} ${candidateMetadatum.lastName}`;
                const attributes = {
                    state: feature.properties.name,
                    candidate: candidateName,
                    votes: candidateData.votes,
                    percentage,
                    totalVotes: candidateData.totalVoters,
                    color: candidateMetadatum.color.getHexString()
                };
                const selectionMask = createSelectionMask(featureGeometry, `${feature.id}-${candidateMetadatum.lastName}`, attributes);
                stateSelectionEntity.appendChild(selectionMask);
                zPosition += height;
            });
            this.el.appendChild(stateSelectionEntity);
        });

        Object.keys(candidateMetadata).forEach((candidateName) => {
            const candidateMetadatum = candidateMetadata[candidateName];
            // Convert the extrude geometry into a buffer geometry for better rendering performance
            const extrudeBufferGeometry = new THREE.BufferGeometry();
            extrudeBufferGeometry.fromGeometry(candidateMetadatum.geometry);

            const material = new THREE.MeshLambertMaterial({ color: candidateMetadatum.color });
            const extrudedMap = new THREE.Mesh(extrudeBufferGeometry, material);
            this.el.setObject3D(candidateName, extrudedMap);
        });

        const mapRenderContextForOutline = this.system.renderToContext(this.geoProjectionComponent.geoJson, this.geoProjectionComponent.projection);
        const stateOutlineGeometry = new THREE.BufferGeometry();
        const stateOutlineVertices = mapRenderContextForOutline.toVertices();
        stateOutlineGeometry.addAttribute('position', new THREE.Float32BufferAttribute(stateOutlineVertices, 3));
        const stateOutlineMaterial = new THREE.LineBasicMaterial({ color: constants.DARK_GRAY });
        const stateOutlines = new THREE.LineSegments(stateOutlineGeometry, stateOutlineMaterial);
        this.el.setObject3D('lines', stateOutlines);
    },
    clearMap(clearAll = false) {
        Object.keys(this.el.object3DMap).forEach((key) => {
            if (clearAll || !['hoverBox', 'selectionBox', 'outlineMap'].includes(key)) {
                this.el.removeObject3D(key);
            }
        });
    }
});
