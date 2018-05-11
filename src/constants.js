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
const { AFRAME } = window;
const { THREE } = AFRAME;

export const DARK_GRAY = new THREE.Color(0x56565a);
export const REPUBLICAN_RED = new THREE.Color(0xE91D0E);
export const DEMOCRAT_BLUE = new THREE.Color(0x232066);
export const LIBERTARIAN_GOLD = new THREE.Color(0xE5C601);
export const GREEN_PARTY_GREEN = new THREE.Color(0x00A95C);
export const INDEPENDENT_PURPLE = new THREE.Color(0x9400D3);

export const YEARS = ['2016', '2012', '2008', '2004'];
