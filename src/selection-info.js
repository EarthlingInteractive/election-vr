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
import { format } from 'd3-format';

const { AFRAME } = window;

AFRAME.registerComponent('selection-info', {
    schema: {
        state: {
            type: 'string'
        },
        candidate: {
            type: 'string'
        },
        party: {
            type: 'string'
        },
        votes: {
            type: 'number'
        },
        totalVotes: {
            type: 'number'
        },
        percentage: {
            type: 'number'
        },
        color: {
            type: 'color'
        }
    },

    init() {
        this.voteFormatter = format(',');
        this.totalVoteFormatter = format('.3s');
        this.percentageFormatter = format('.3p');
    },

    getInfoText() {
        return `${this.data.state}
            ${this.data.candidate} (${this.data.party})
            ${this.voteFormatter(this.data.votes)} votes
            ${this.percentageFormatter(this.data.percentage)} of ${this.totalVoteFormatter(this.data.totalVotes)} total`;
    }
});
