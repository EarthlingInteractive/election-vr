import * as d3 from "d3";
import { map, omit, orderBy, reduce, sumBy, last } from "lodash";

const colorForCandidate = (candidate) => {
    switch (candidate) {
    case "trump":
        return "red";
    case "clinton":
        return "blue";
    case "stein":
        return "green";
    case "mcmullin":
        return "purple";
    case "johnson":
        return "yellow";
    default:
        return "white";
    }
};

const ready = (error, us, data) => {
    if (error) throw error;

    const hscale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.totalVotes)])
        .range([0, 10]);

    const rscale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, 2]);

    // we select the scene object just like an svg
    const scene = d3.select("#my-scene");

    const towers = scene
        .selectAll("a-cylinder")
        .data(data);

    const labels = scene
        .selectAll("a-text")
        .data(data);

    for (let index = 4; index >= 0; index -= 1) {
        towers.enter()
            .append("a-cylinder")
            .attr("color", d => colorForCandidate(d.results[ index ].candidate))
            .attr("position", (d, i) => {
                const x = i * 2.5;
                // cylinders are positioned by their center so we offset for their height
                const y = 1 + hscale(d.results[ index ].votes) / 2;
                const z = 0;
                return `${ x } ${ y } ${ z }`;
            })
            .attr("height", (d) => {
                return hscale(d.results[ index ].votes);
            })
            .attr("radius", d => {
                console.log("d.results[ index ].cumulativePercentage", d.results[ index ].cumulativePercentage);
                console.log("rscale(d.results[ index ].cumulativePercentage)", rscale(d.results[ index ].cumulativePercentage));
                return rscale(d.results[ index ].cumulativePercentage);
            });
    }

    labels.enter()
        .append("a-text")
        .attr("value", d => d.state)
        .attr("color", "black")
        .attr("scale", "1.5 1.5 1.5")
        .attr("align", "center")
        .attr("position", (d, i) => {
            const x = i * 2.5;
            const y = 9;
            const z = 0;
            return `${ x } ${ y } ${ z }`;
        });
};

const stringToNum = (str) => {
    if (str) {
        return Number.parseInt(str.replace(/,/g, ""), 10);
    }
    return 0;
};

const convertToArray = (d) => {
    return {
        fips: d.fips,
        state: d.state,
        eligiblePopulation: stringToNum(d.eligible_population),
        results: orderBy(map(omit(d, ["fips", "state", "electoral_votes", "eligible_population"]), (value, key) => {
            return {
                candidate: key,
                votes: stringToNum(value),
            };
        }), ["votes"], ["desc"]),
    };
};

const calculateTotal = (d) => {
    return {
        ...d,
        totalVotes: sumBy(d.results, result => result.votes),
    };
};

const calculatePercentages = (d) => {
    return {
        fips: d.fips,
        state: d.state,
        totalVotes: d.totalVotes,
        results: reduce(d.results, (calcResults, currResult) => {
            const percentageOfVote = (currResult.votes / d.eligiblePopulation);

            const prevResults = last(calcResults);
            const prevPercentage = prevResults ? prevResults.cumulativePercentage : 0;
            const cumulativePercentage = prevPercentage + percentageOfVote;

            const calcResult = {
                ...currResult,
                percentageOfVote,
                cumulativePercentage,
            };
            return calcResults.concat(calcResult);
        }, []),
    };
};

const transformRow = d => calculatePercentages(calculateTotal(convertToArray(d)));

d3.queue()
    .defer(d3.json, "us-10m.v1.json")
    .defer(d3.csv, "StateElectionResults13Nov2016.csv", transformRow)
    .await(ready);
