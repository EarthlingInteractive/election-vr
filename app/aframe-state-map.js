import * as d3 from "d3";
import "d3-selection";
import * as topojson from "topojson-client";

var path = d3.geoPath();

var ready = (error, us) => {
    if (error) throw error;

    d3.select("a-scene")
        .selectAll(".state")
        .data(topojson.feature(us, us.objects.states).features)
        .enter()
        .append("a-entity")
        .classed("state", true)
        .attr("position", function (d) {
            var centroid = path.centroid(d);
            return (centroid[ 0 ] / 100) + " -" + (centroid[ 1 ] / 100) + " 1";
        })
        //            .attr("scale", "0.5 0.5 1")
        .attr("rotation", "0 0 0")
        .attr("svgpath", function (d) {
            return "svgPath: " + path(d) + "; color: red";
        });
};

d3.queue()
    .defer(d3.json, "us-10m.v1.json")
    .await(ready);
