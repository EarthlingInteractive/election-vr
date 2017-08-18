import * as d3 from "d3";
import { map, omit, orderBy, reduce, sumBy, last, startCase } from "lodash";
import numeral from "numeral";

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

const orderByTotalVotes = d => orderBy(d, ["totalVotes"], ["desc"]);

/*
data = [
    {
        "fips": "01",
        "state": "Alabama",
        "totalVotes": 2078165,
        "results": [{
            "candidate": "trump",
            "votes": 1306925,
            "percentageOfVote": 0.36242031910902156,
            "cumulativePercentage": 0.36242031910902156
        }, {
            "candidate": "clinton",
            "votes": 718084,
            "percentageOfVote": 0.19913019678029165,
            "cumulativePercentage": 0.5615505158893133
        }, {
            "candidate": "johnson",
            "votes": 43869,
            "percentageOfVote": 0.012165209923288381,
            "cumulativePercentage": 0.5737157258126017
        }, {
            "candidate": "stein",
            "votes": 9287,
            "percentageOfVote": 0.0025753562779543457,
            "cumulativePercentage": 0.576291082090556
        }, {
            "candidate": "mcmullin",
            "votes": 0,
            "percentageOfVote": 0,
            "cumulativePercentage": 0.576291082090556
        }]
    },
    ...
]
*/

const ready = (error, us, data) => {
    if (error) throw error;

    const sortedData = orderByTotalVotes(data);

    // find the state with the most total votes and scale all other cylinders proportionally
    const hscale = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.totalVotes)])
        .range([0, 6]);

    // scale the radius of the cylinders to be based on the percentage of the vote
    const rscale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, 0.75]);

    // we select the container object just like an svg
    const container = d3.select("#tower-container");

    const states = container
        .selectAll("a-entity.state")
        .data(sortedData);

    const stateContainer = states.enter()
        .append("a-entity")
        .attr("class", "state")
        .attr("id", d => `fips-${ d.fips }`)
        .attr("position", (d, i) => {
            const y = 0;
            // place states in a circle around the viewer
            const radius = 10;
            const theta = (i / sortedData.length) * (2 * Math.PI);
            const x = radius * Math.cos(theta);
            const z = radius * Math.sin(theta);
            return `${ x } ${ y } ${ z }`;
        });

    stateContainer
        .append("a-text")
        .attr("value", d => d.state)
        .attr("color", "black")
        .attr("scale", "0.8 0.8 0.8")
        .attr("align", "center")
        .attr("position", (d) => {
            const x = 0;
            const y = 7;
            const z = 0;
            return `${ x } ${ y } ${ z }`;
        })
        .attr("rotation", (d, i) => {
            const x = 0;
            const z = 0;
            const y = -((i / sortedData.length) * 360) - 90;
            return `${ x } ${ y } ${ z }`;
        })
    ;

    for (let index = 0; index < 5; index += 1) {
        stateContainer
            .append("a-cylinder")
            .attr("color", d => colorForCandidate(d.results[ index ].candidate))
            .attr("position", (d, i) => {
                // cylinders are positioned by their center so we offset for their height
                const cylHeight = hscale(d.results[ index ].votes);
                // find the top of the previously placed cylinder so that we can stack this one on top
                const prevCylTop = hscale(sumBy(d.results.slice(0, index), result => result.votes));
                const y = prevCylTop + (cylHeight / 2);
                const x = 0;
                const z = 0;
                return `${ x } ${ y } ${ z }`;
            })
            .attr("event-set__1", (d) => {
                const result = d.results[ index ];
                const votes = numeral(result.votes).format("0,0");
                const percentage = numeral(result.percentageOfVote).format("0.00%");
                const candidate = startCase(result.candidate);
                const infoText = `${ d.state }\n${ candidate } - ${ votes } votes / ${ percentage }`;
                return `_event: mouseenter; _target: #infoText; visible: true; text.value: ${ infoText }`;
            })
            .attr("event-set__2", "_event: mouseleave; _target: #infoText; visible: false; text.value: ")
            .attr("height", (d) => {
                return hscale(d.results[ index ].votes);
            })
            .attr("radius", d => {
                return rscale(d.results[ index ].percentageOfVote);
            });
    }
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
            const percentageOfVote = (currResult.votes / d.totalVotes);

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
