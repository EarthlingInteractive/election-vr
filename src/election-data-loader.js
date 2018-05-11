/*
 * ElectionVR: A visualization of the popular vote in recent U.S. Presidential elections using WebVR.
 * Copyright (C) 2018 Earthling Interactive
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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
