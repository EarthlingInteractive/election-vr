#!/usr/bin/env bash
# inspired by https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c
# requires:
# sudo easy_install xlsx2csv
# npm install -g d3-dsv
# npm install -g ndjson-cli

# convert the FIPS code to state mapping file to ndjson for later use
dsv2json statefips.csv -n -o temp/statefips.ndjson

# Source data files downloaded from the FEC website: https://transition.fec.gov/pubrec/electionresults.shtml
./extract-presidential-electoral-vote.sh
./extract-presidential-popular-vote.sh

# find the state with the highest total voters for all years to set a consistent scale
cat temp/federalelections20*.prespop.totals.ndjson \
    | ndjson-top 'a.totalVoters - b.totalVoters' \
    | tail -n 1 \
    > temp/maxvoters.json

# copy all final data files into assets folder
cp temp/federalelections20*.json ../src/assets
cp temp/maxvoters.json ../src/assets
