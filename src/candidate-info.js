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
import * as constants from './constants';

const candidateInfo = {
    'Trump, Donald J.': {
        firstName: 'Donald J.',
        lastName: 'Trump',
        party: 'R',
        color: constants.REPUBLICAN_RED
    },
    'Clinton, Hillary': {
        firstName: 'Hillary',
        lastName: 'Clinton',
        party: 'D',
        color: constants.DEMOCRAT_BLUE
    },
    'Johnson, Gary': {
        firstName: 'Gary',
        lastName: 'Johnson',
        party: 'LIB',
        color: constants.LIBERTARIAN_GOLD
    },
    'Stein, Jill': {
        firstName: 'Jill',
        lastName: 'Stein',
        party: 'GRE',
        color: constants.GREEN_PARTY_GREEN
    },
    'McMullin, Evan': {
        firstName: 'Evan',
        lastName: 'McMullin',
        party: 'IND',
        color: constants.INDEPENDENT_PURPLE
    },
    'Obama, Barack': {
        firstName: 'Barak',
        lastName: 'Obama',
        party: 'D',
        color: constants.DEMOCRAT_BLUE
    },
    'Romney, Mitt': {
        firstName: 'Mitt',
        lastName: 'Romney',
        party: 'R',
        color: constants.REPUBLICAN_RED
    },
    'McCain, John': {
        firstName: 'John',
        lastName: 'McCain',
        party: 'R',
        color: constants.REPUBLICAN_RED
    },
    'Nader, Ralph': {
        firstName: 'Ralph',
        lastName: 'Nader',
        party: 'IND',
        color: constants.INDEPENDENT_PURPLE
    },
    'Barr, Bob': {
        firstName: 'Bob',
        lastName: 'Barr',
        party: 'LIB',
        color: constants.LIBERTARIAN_GOLD
    },
    'Bush, George W.': {
        firstName: 'George W.',
        lastName: 'Bush',
        party: 'R',
        color: constants.REPUBLICAN_RED
    },
    'Kerry, John F.': {
        firstName: 'John F.',
        lastName: 'Kerry',
        party: 'D',
        color: constants.DEMOCRAT_BLUE
    },
    'Badnarik, Michael': {
        firstName: 'Michael',
        lastName: 'Badnarik',
        party: 'LIB',
        color: constants.LIBERTARIAN_GOLD
    }
};

export default candidateInfo;
