import * as d3 from "d3";
import * as topojson from "topojson-client";

const svg = d3.select("svg");

const path = d3.geoPath();

const ready = (error, us) => {
    if (error) throw error;

    const statesContext = svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features);

    statesContext
        .enter()
        .append("path")
        .attr("id", d => `fips-${ d.id }`)
        .attr("d", path)
        .attr("fill", "orange");

    statesContext
        .enter()
        .append("path")
        .attr("id", d => `test-${ d.id }`)
        .attr("d", path)
        .attr("fill", "green")
        .attr("transform", (d) => {
            const [centerX, centerY] = path.centroid(d);
            return `translate(${ centerX * 0.5 }, ${ centerY * 0.5 }) scale(0.5)`;
        });
};

d3.queue()
    .defer(d3.json, "./data/us-10m.v1.json")
    .await(ready);
