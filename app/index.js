import * as d3 from "d3";
import * as topojson from "topojson-client";

const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const path = d3.geoPath();

const ready = (error, us) => {
    if (error) throw error;

    svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter()
        .append("path")
        .attr("d", path);
};

d3.queue()
    .defer(d3.json, "./data/us-10m.v1.json")
    .await(ready);
