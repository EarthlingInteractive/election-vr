import * as d3 from "d3";
import * as topojson from "topojson-client";
import { map, omit, orderBy, reduce, sumBy, keyBy } from "lodash";

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
    const dataByFipsCode = keyBy(data, "fips");

    const statesContext = svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features);

    statesContext
        .enter()
        .append("path")
        .attr("id", d => `fips-${ d.id }`)
        .attr("d", path)
        .attr("fill", "grey");

    for (let index = 0; index < 5; index += 1) {
        statesContext
            .enter()
            .append("path")
            .attr("id", d => `entry-first-${ d.id }`)
            .attr("d", path)
            .attr("fill", d => colorForCandidate(dataByFipsCode[ d.id ].results[ index ].candidate))
            .attr("transform", (d) => {
                const [centerX, centerY] = path.centroid(d);
                const scale = dataByFipsCode[ d.id ].results[ index ].percentageOfVote;
                return `translate(${ centerX * scale }, ${ centerY * scale }) scale(${ scale })`;
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
        results: orderBy(map(omit(d, ["fips", "state", "electoral_votes"]), (value, key) => {
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
            const calcResult = {
                ...currResult,
                percentageOfVote: (currResult.votes / d.totalVotes),
            };
            return calcResults.concat(calcResult);
        }, []),
    };
};

const transformRow = (d) => {
    return calculatePercentages(calculateTotal(convertToArray(d)));
};

d3.queue()
    .defer(d3.json, "./data/us-10m.v1.json")
    .defer(d3.csv, "./data/StateElectionResults13Nov2016.csv", transformRow)
    .await(ready);
