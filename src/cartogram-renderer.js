import 'aframe';
import { scaleLinear } from 'd3-scale';
import * as constants from './constants';

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
        this.ready = false;

        const geoDataLoaderPromise = new Promise(((resolve) => {
            this.el.addEventListener('geo-data-ready', resolve);
        }));
        const electionDataLoaderPromise = new Promise(((resolve) => {
            this.el.addEventListener('election-data-loaded', resolve);
        }));

        // Wait until all files to finish loading to avoid race conditions
        Promise.all([geoDataLoaderPromise, electionDataLoaderPromise]).then((result) => {
            const electionDataLoadEvent = result[1].detail;
            this.votesByFipsCode = electionDataLoadEvent.votesByFipsCode;
            this.maxTotalVoters = electionDataLoadEvent.maxTotalVoters;
            this.ready = true;
            this.render();
        }, (error) => {
            console.error(error);
        });
    },
    update(oldData) {
        if (this.data.maxExtrudeHeight !== oldData.maxExtrudeHeight ||
            this.data.geometryType !== oldData.geometryType) {
            this.render();
        }
    },
    render() {
        if (!this.ready || !this.votesByFipsCode || !this.geoProjectionComponent.geoJson) return;

        // Determine the vertical scale for the entire country using the state with the largest number of total voters
        // as equaling the max extrude height
        const extrudeScale = scaleLinear()
            .domain([0, this.maxTotalVoters])
            .range([0, this.data.maxExtrudeHeight]);

        const candidateLayers = {
            clinton: {
                geometry: new THREE.Geometry(),
                color: constants.DEMOCRAT_BLUE
            },
            trump: {
                geometry: new THREE.Geometry(),
                color: constants.REPUBLICAN_RED
            },
            stein: {
                geometry: new THREE.Geometry(),
                color: constants.GREEN_PARTY_GREEN
            },
            johnson: {
                geometry: new THREE.Geometry(),
                color: constants.LIBERTARIAN_GOLD
            },
            mcmullin: {
                geometry: new THREE.Geometry(),
                color: constants.INDEPENDENT_PURPLE
            }
        };
        // Split the geoJson into features and render each one individually so that we can set a different
        // extrusion height for each based on the population.
        this.geoProjectionComponent.geoJson.features.forEach((feature) => {
            const votingData = this.votesByFipsCode[feature.id];
            const mapRenderContext = this.system.renderToContext(feature, this.geoProjectionComponent.projection);
            const stateShapes = mapRenderContext.toShapes(this.data.isCCW);

            const candidatesOrderedByVoteCount = Object.keys(votingData)
                .filter(key => ['clinton', 'trump', 'johnson', 'stein', 'mcmullin'].indexOf(key) !== -1)
                .sort((a, b) => votingData[a] <= votingData[b]);

            const totalVotes = votingData.totalVoters;
            let zPosition = 0;
            candidatesOrderedByVoteCount.forEach((candidate) => {
                const candidateVotes = votingData[candidate];
                if (!candidateVotes || candidateVotes <= 0) {
                    return;
                }
                const percentage = (candidateVotes / totalVotes);
                const height = extrudeScale(candidateVotes);
                const extrudeGeometry = candidateLayers[candidate].geometry;

                // Hawaii looks better when rendered per shape
                let featureGeometry;
                if (feature.id === '15') {
                    featureGeometry = createExtrudedAndScaledGeometryPerShape(height, stateShapes, percentage, zPosition);
                } else {
                    featureGeometry = createExtrudedAndScaledGeometry(height, stateShapes, percentage, zPosition);
                }
                extrudeGeometry.merge(featureGeometry);
                const attributes = {
                    state: feature.id,
                    candidate,
                    votes: candidateVotes,
                    percentage
                };
                const selectionMask = createSelectionMask(featureGeometry, `${feature.id}-${candidate}`, attributes);
                this.el.appendChild(selectionMask);
                zPosition += height;
            });
        });

        Object.keys(candidateLayers).forEach((candidate) => {
            const layer = candidateLayers[candidate];
            // Convert the extrude geometry into a buffer geometry for better rendering performance
            const extrudeBufferGeometry = new THREE.BufferGeometry();
            extrudeBufferGeometry.fromGeometry(layer.geometry);

            const material = new THREE.MeshLambertMaterial({ color: layer.color });
            const extrudedMap = new THREE.Mesh(extrudeBufferGeometry, material);
            this.el.setObject3D(candidate, extrudedMap);
        });

        const mapRenderContextForOutline = this.system.renderToContext(this.geoProjectionComponent.geoJson, this.geoProjectionComponent.projection);
        const stateOutlineGeometry = new THREE.BufferGeometry();
        const stateOutlineVertices = mapRenderContextForOutline.toVertices();
        stateOutlineGeometry.addAttribute('position', new THREE.Float32BufferAttribute(stateOutlineVertices, 3));
        const stateOutlineMaterial = new THREE.LineBasicMaterial({ color: constants.DARK_GRAY });
        const stateOutlines = new THREE.LineSegments(stateOutlineGeometry, stateOutlineMaterial);
        this.el.setObject3D('lines', stateOutlines);
    }
});
