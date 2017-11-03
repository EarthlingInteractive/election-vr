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

const ready = (error, data) => {
    console.log("Start d3");
    if (error) throw error;

    const sortedData = orderByTotalVotes(data);

    // find the state with the most total votes and scale all other cylinders proportionally
    const hscale = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.totalVotes)])
        .range([0, 4]);

    // scale the radius of the cylinders to be based on the percentage of the vote
    // but set the range for each state based on the dimensions of that state
    const rscale = d3.scaleLinear()
        .domain([0, 1]);

    // we select the container object just like an svg
    const container = d3.select("#plane-map");

    console.log("sortedData", sortedData);

    // const states = container
    //     .selectAll("a-entity");

    for (let dataIndex = 0; dataIndex < sortedData.length; dataIndex += 1) {
        const datum = sortedData[dataIndex];
        const stateContainer = container
            .select(`#fips-${numeral(datum.fips).format("00")}`);

        const width = +stateContainer.attr("width");
        const height = +stateContainer.attr("height");
        const maxRadius = (d3.min([width, height]) / 2);
        rscale.range([0, maxRadius]);

        let prevCylTop = 0;
        stateContainer
            .selectAll("a-cylinder")
            .data(datum.results)
            .enter()
            .append("a-cylinder")
            .attr("color", d => colorForCandidate(d.candidate))
            .attr("rotation", "90 0 0")
            .attr("position", (d) => {
                // cylinders are positioned by their center so we offset for their height
                const cylHeight = hscale(d.votes);
                // find the top of the previously placed cylinder so that we can stack this one on top
                const z = prevCylTop + (cylHeight / 2);
                prevCylTop += cylHeight;
                const x = 0;
                const y = 0;
                return `${ x } ${ y } ${ z }`;
            })
            .attr("height", (d) => {
                return hscale(d.votes);
            })
            .attr("radius", d => {
                return rscale(d.percentageOfVote);
            });
    }
    console.log("Finish d3");
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

const states = document.getElementById("plane-map");
console.log("Found states map", states);
states.addEventListener("geojson-loaded", () => {
    d3.queue()
        .defer(d3.csv, "StateElectionResultsCNN16Feb2017.csv", transformRow)
        .await(ready);
});
