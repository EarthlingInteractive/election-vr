#!/usr/bin/env bash
# inspired by https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c
# requires:
# sudo easy_install xlsx2csv
# npm install -g d3-dsv
# npm install -g ndjson-cli

rm temp/*.*

# Source data files downloaded from the FEC website: https://transition.fec.gov/pubrec/electionresults.shtml

# Parse the excel file and extract the data sheet we want to a CSV
xlsx2csv -s 9 -i federalelections2016.xlsx > temp/federalelections2016.csv

# Convert the CSV file to newline-delimited JSON
dsv2json temp/federalelections2016.csv -n -o temp/federalelections2016.ndjson

cat temp/federalelections2016.ndjson \
    | ndjson-filter 'd["TOTAL VOTES"] !== "Total State Votes:"' \
    | ndjson-filter '+d["GENERAL RESULTS"] > 0 || +d["TOTAL VOTES #"] > 0' \
    | ndjson-map 'd = {state: d["STATE ABBREVIATION"], name: d["LAST NAME,  FIRST"].trim(), party: d["PARTY"], votes: (+d["GENERAL RESULTS"] || +d["TOTAL VOTES #"]), winner: (d["WINNER INDICATOR"]==="W")}' \
    > temp/federalelections2016.candidates.ndjson

# find all the "Combined Parties:" special cases
cat temp/federalelections2016.candidates.ndjson \
    | ndjson-filter 'd.party === "Combined Parties:"' \
    > temp/federalelections2016.combined.ndjson

ndjson-join --left 'd.state + d.name' temp/federalelections2016.candidates.ndjson temp/federalelections2016.combined.ndjson \
    | ndjson-filter 'd[1] === null || d[0].party === d[1].party' \
    | ndjson-map 'd[0]' \
    > temp/federalelections2016.clean.ndjson

cat temp/federalelections2016.ndjson \
    | ndjson-filter 'd["TOTAL VOTES"] === "Total State Votes:"' \
    | ndjson-map 'd = {state: d["STATE ABBREVIATION"], totalVoters: +d["TOTAL VOTES #"]}' \
    > temp/federalelections2016.totals.ndjson

ndjson-join 'd.state' temp/federalelections2016.clean.ndjson temp/federalelections2016.totals.ndjson \
    | ndjson-map 'Object.assign(d[0], {totalVoters: d[1].totalVoters})' \
    | ndjson-filter '["Trump, Donald J.", "Clinton, Hillary", "Johnson, Gary", "Stein, Jill", "McMullin, Evan"].includes(d.name)' \
    > temp/federalelections2016.final.ndjson

cat temp/federalelections2016.final.ndjson \
    | ndjson-reduce \
    > temp/federalelections2016.json
