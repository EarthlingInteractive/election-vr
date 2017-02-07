import * as d3 from "d3";
import "d3-selection";

// fake data
var data = [10, 20, 30, 15, 25, 35, 40,
    45, 50, 70, 100, 120, 130,
    12, 18, 22, 29, 33, 44, 59, 200]

// we scale the height of our bars using d3's linear scale
var hscale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, 3])

// we select the scene object just like an svg
var scene = d3.select("#jenga");

// we use d3's enter/update/exit pattern to draw and bind our dom elements
var bars = scene.selectAll("a-box").data(data)
bars.enter().append("a-box")
    // we set attributes on our cubes to determine how they are rendered
    .attr("position", function (d, i) {
        // cubes are positioned by their center so we
        // offset for their height
        var y = 1 + hscale(d) / 2;
        // lets place the bars all around our camera
        var radius = 5;
        var theta = i / data.length * 2 * Math.PI - 3 / 4 * Math.PI
        var x = radius * Math.cos(theta)
        var z = radius * Math.sin(theta)
        const position = x + " " + y + " " + z;
        console.log("position", i, ": ", position);
        return position;
    })
    .attr("rotation", function (d, i) {
        var x = 0;
        var z = 0;
        var y = -(i / data.length) * 360 - 45;
        return x + " " + y + " " + z
    })
    .attr("width", 0.5)
    .attr("depth", 0.9)
    .attr("height", function (d) {
        return hscale(d)
    })
    .attr("opacity", function (d, i) {
        return 0.6 + (i / data.length) * 0.4
    })
    .on("click", function (d, i) {
        console.log("click", i, d)
    })
    .on("mouseenter", function (d, i) {
        // this event gets fired continuously as long as the cursor
        // is over the element. we only want trigger our animation the first time
        if (this.hovering) return;
        console.log("hover", i, d)
        this.hovering = true;
        d3.select(this).transition().duration(1000)
            .attr({
                metalness: 0.5,
                width: 2
            })
    })
    .on("mouseleave", function (d, i) {
        console.log("leave", i, d)
        this.hovering = false;
        d3.select(this).transition()
            .attr({
                metalness: 0,
                width: 0.5
            })
    })
