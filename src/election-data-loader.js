import 'aframe';
import { max } from 'd3-array';
import { csv } from 'd3-fetch';

const { AFRAME } = window;

const processData = (d) => {
    return {
        fips: d.fips,
        state: d.state,
        Clinton: +d.clinton,
        Trump: +d.trump,
        Johnson: +d.johnson,
        Stein: +d.stein,
        McMullin: +d.mcmullin,
        totalVoters: (+d.clinton + +d.trump + +d.johnson + +d.stein + +d.mcmullin),
        nonVoters: (+d.eligible_population - +d.clinton - +d.trump - +d.johnson - +d.stein - +d.mcmullin),
        electoralVotes: +d.electoral_votes,
        eligiblePopulation: +d.eligible_population
    };
};

AFRAME.registerComponent('election-data-loader', {
    init() {
        this.handleDataLoaded = this.handleDataLoaded.bind(this);
        csv('assets/us-presidential-election-CNN-16Feb2017.csv', processData)
            .then(this.handleDataLoaded, (error) => { console.error(error); });
    },

    handleDataLoaded(votingData) {
        const votesByFipsCode = votingData.reduce((accum, d) => {
            accum[d.fips] = d;
            return accum;
        }, {});
        const maxTotalVoters = max(votingData, d => d.totalVoters);
        this.el.emit('election-data-loaded', { votesByFipsCode, maxTotalVoters });
    }
});
