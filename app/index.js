import * as d3 from "d3";
import * as topojson from "topojson-client";
import { map, omit, orderBy, reduce, sumBy, last } from "lodash";

const svg = d3.select("svg");

const path = d3.geoPath();

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

    svg.append("defs")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter()
        .append("path")
        .attr("id", d => `state-template-${ d.id }`)
        .attr("d", path);

    const usContext = svg.append("g")
        .selectAll("use")
        .data(data)
        .enter();

    const stateContext = usContext
        .append("g")
        .attr("id", d => `state-${ d.fips }`);

    stateContext
        .append("use")
        .attr("xlink:href", d => `#state-template-${ d.fips }`)
        .attr("fill", "gray");

    for (let index = 4; index >= 0; index -= 1) {
        stateContext
            .append("use")
            .attr("xlink:href", d => `#state-template-${ d.fips }`)
            .attr("fill", d => colorForCandidate(d.results[ index ].candidate))
            .attr("transform", (d) => {
                const fipsPath = d3.select(`#state-template-${ d.fips }`);
                const [centerX, centerY] = path.centroid(fipsPath.datum());
                const scale = d.results[ index ].cumulativePercentage;
                return `translate(${ centerX * (1 - scale) }, ${ centerY * (1 - scale) }) scale(${ scale })`;
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
    .defer(d3.json, "./data/us-10m.v1.json")
    .defer(d3.csv, "./data/StateElectionResults13Nov2016.csv", transformRow)
    .await(ready);
