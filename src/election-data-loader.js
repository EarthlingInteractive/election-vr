import 'aframe';
import maxVoters from './assets/maxvoters.json';

const { AFRAME } = window;

AFRAME.registerComponent('election-data-loader', {
    schema: {
        year: {
            type: 'string'
        }
    },

    init() {
        this.handleDataLoaded = this.handleDataLoaded.bind(this);
        this.handleYearChanged = this.handleYearChanged.bind(this);
        this.el.sceneEl.addEventListener('year-changed', this.handleYearChanged);
        this.yearText = document.querySelector('#year');
    },

    remove() {
        this.el.sceneEl.removeEventListener('year-changed', this.handleYearChanged);
    },

    update(oldData) {
        if (this.data.year && this.data.year !== oldData.year) {
            fetch(`assets/federalelections${this.data.year}.json`)
                .then(response => response.json())
                .then(this.handleDataLoaded)
                .then(() => { this.yearText.setAttribute('value', this.data.year); })
                .catch((error) => { console.error(error); });
        }
    },

    handleYearChanged(evt) {
        this.el.setAttribute('election-data-loader', 'year', evt.detail.year);
    },

    handleDataLoaded(votingData) {
        const votesByFipsCode = votingData.reduce((accum, d) => {
            if (!accum[d.fips]) {
                accum[d.fips] = [];
            }
            accum[d.fips].push(d);
            return accum;
        }, {});
        const maxTotalVoters = maxVoters.totalVoters;
        this.el.emit('election-data-loaded', { votesByFipsCode, maxTotalVoters });
    }
});
