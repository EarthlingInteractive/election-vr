import * as AFRAME from 'aframe';
import * as constants from './constants';

const { THREE } = AFRAME;

const createCylinders = (height, stateShapes, percentage, zPosition, geometry) => {
    const shapeGeometry = new THREE.ShapeGeometry(stateShapes);
    shapeGeometry.computeBoundingBox();
    const size = shapeGeometry.boundingBox.getSize();
    const center = shapeGeometry.boundingBox.getCenter();
    const radius = (d3.min([size.x, size.y]) / 3) * percentage;
    const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, 24);
    cylinderGeometry.rotateX(Math.PI / 2);
    cylinderGeometry.translate(center.x, center.y, zPosition + height / 2);
    geometry.merge(cylinderGeometry);
};
const createExtrudedAndScaledGeometry = (height, stateShapes, percentage, zPosition, extrudeGeometry) => {
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
    extrudeGeometry.merge(extrudedFeatureGeometry);
};
const createExtrudedAndScaledGeometryPerShape = (height, stateShapes, percentage, zPosition, extrudeGeometry) => {
    const extrudeSettings = {
        amount: height,
        bevelEnabled: false
    };
    stateShapes.forEach((stateShape) => {
        const extrudedFeatureGeometry = new THREE.ExtrudeGeometry(stateShape, extrudeSettings);
        extrudedFeatureGeometry.computeBoundingBox();
        const center = extrudedFeatureGeometry.boundingBox.getCenter();
        extrudedFeatureGeometry.center();
        extrudedFeatureGeometry.scale(percentage, percentage, 1);
        extrudedFeatureGeometry.translate(center.x, center.y, center.z + zPosition);

        // if the scaled-down shape is too small, then don't render it
        // const size = extrudedFeatureGeometry.boundingBox.getSize();
        // if (size.x < 0.02 || size.y < 0.02) {
        //   return;
        // }

        extrudeGeometry.merge(extrudedFeatureGeometry);
    });
};

AFRAME.registerComponent('data-for-map', {
    dependencies: ['geo-projection'],
    schema: {
        maxExtrudeHeight: {
            default: 4
        },
        geometryType: {
            oneOf: ['shapePerState', 'manyShapesPerState', 'cylinder'],
            default: 'cylinder'
        }
    },
    init() {
        this.geoProjectionComponent = this.el.components['geo-projection'];

        // Wait for geoJson to finish loading to avoid race conditions
        this.el.addEventListener('geo-src-loaded', this.geoJsonReady.bind(this));
    },
    update(oldData) {
        if (this.data.maxExtrudeHeight !== oldData.maxExtrudeHeight ||
            this.data.geometryType !== oldData.geometryType) {
            this.geoJsonReady();
        }
    },
    geoJsonReady() {
        // Override the render method of geoProjectionComponent with the custom one on this component
        // this allows us to push the data that needs to be visualized into the rendering pipeline
        this.geoProjectionComponent.render = this.render;

        // Now kick off loading the data
        d3.queue()
            .defer(d3.csv, '../data/us-presidential-election-CNN-16Feb2017.csv', (d) => {
                return {
                    fips: d.fips,
                    state: d.state,
                    clinton: +d.clinton,
                    trump: +d.trump,
                    johnson: +d.johnson,
                    stein: +d.stein,
                    mcmullin: +d.mcmullin,
                    totalVoters: (+d.clinton + +d.trump + +d.johnson + +d.stein + +d.mcmullin),
                    nonVoters: (+d.eligible_population - +d.clinton - +d.trump - +d.johnson - +d.stein - +d.mcmullin),
                    electoralVotes: +d.electoral_votes,
                    eligiblePopulation: +d.eligible_population
                };
            })
            .await(this.onDataLoaded.bind(this));
    },
    onDataLoaded(error, votingData) {
        if (error) throw error;
        const votesByFipsCode = votingData.reduce((accum, d) => {
            accum[d.fips] = d;
            return accum;
        }, {});

        // Determine the vertical scale for the entire country using the state with the largest number of total voters
        // as equaling the max extrude height
        const maxTotalVoters = d3.max(votingData, d => d.totalVoters);
        const extrudeScale = d3.scaleLinear()
            .domain([0, maxTotalVoters])
            .range([0, this.data.maxExtrudeHeight]);

        this.geoProjectionComponent.render(votesByFipsCode, extrudeScale, this.data.geometryType);
    },
    // Custom rendering function that does all the work
    // Note that the `this` for this function is the geoProjectionComponent instead of this data-for-map component
    // So that we can use all the functions and data of the geoProjectionComponent to help with rendering
    render(votesByFipsCode, extrudeScale, geometryType) {
        if (!votesByFipsCode || !this.geoJson) return;
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
        this.geoJson.features.forEach((feature) => {
            const votingData = votesByFipsCode[feature.id];
            const mapRenderContext = this.renderer.renderToContext(feature, this.projection);
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
                switch (geometryType) {
                case 'shapePerState':
                    createExtrudedAndScaledGeometry(height, stateShapes, percentage, zPosition, extrudeGeometry);
                    break;
                case 'manyShapesPerState':
                    createExtrudedAndScaledGeometryPerShape(height, stateShapes, percentage, zPosition, extrudeGeometry);
                    break;
                case 'cylinder':
                    createCylinders(height, stateShapes, percentage, zPosition, extrudeGeometry);
                    break;
                }
                zPosition += height;
            });
        });

        Object.keys(candidateLayers).forEach((candidate) => {
            const layer = candidateLayers[candidate];
            // Convert the extrude geometry into a buffer geometry for better rendering performance
            const extrudeBufferGeometry = new THREE.BufferGeometry();
            extrudeBufferGeometry.fromGeometry(layer.geometry);

            const topMaterial = new THREE.MeshBasicMaterial({ color: layer.color });
            const sideMaterial = new THREE.MeshStandardMaterial({ color: layer.color });
            const extrudedMap = new THREE.Mesh(extrudeBufferGeometry, [topMaterial, sideMaterial]);
            this.el.setObject3D(candidate, extrudedMap);
        });

        const mapRenderContextForOutline = this.renderer.renderToContext(this.geoJson, this.projection);
        const stateOutlineGeometry = new THREE.BufferGeometry();
        const stateOutlineVertices = mapRenderContextForOutline.toVertices();
        stateOutlineGeometry.addAttribute('position', new THREE.Float32BufferAttribute(stateOutlineVertices, 3));
        const stateOutlineMaterial = new THREE.LineBasicMaterial({ color: constants.DARK_GRAY });
        const stateOutlines = new THREE.LineSegments(stateOutlineGeometry, stateOutlineMaterial);
        this.el.setObject3D('lines', stateOutlines);
    }
});
