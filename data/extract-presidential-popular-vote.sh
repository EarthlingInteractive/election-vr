#!/usr/bin/env bash
# inspired by https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c
# requires:
# sudo easy_install xlsx2csv
# npm install -g d3-dsv
# npm install -g ndjson-cli

rm temp/federalelections*.prespop.*

# Source data files downloaded from the FEC website: https://transition.fec.gov/pubrec/electionresults.shtml
YEARS=( 2004 2008 2012 2016 )
for YEAR in "${YEARS[@]}"
do
    FILE=federalelections${YEAR}
    FILE_BASE=${FILE}.prespop
	echo "Processing Presidential popular vote from ${FILE}.xlsx"

    # Parse the excel file and extract the data sheet we want to a CSV
    SHEET=9
    if [ ${YEAR} -eq 2004 ]
    then
        SHEET=2
    fi
    xlsx2csv -s ${SHEET} -i ${FILE}.xlsx > temp/${FILE_BASE}.csv

    # convert the CSV file to newline-delimited JSON
    dsv2json temp/${FILE_BASE}.csv -n -o temp/${FILE_BASE}.ndjson

    # clean out the junk and fix up the headers
    cat temp/${FILE_BASE}.ndjson \
        | ndjson-filter 'd["TOTAL VOTES"] !== "Total State Votes:"' \
        | ndjson-filter '+d["GENERAL RESULTS"] > 0 || +d["TOTAL VOTES #"] > 0' \
        | ndjson-map 'd = {state: d["STATE ABBREVIATION"], name: d["LAST NAME,  FIRST"].trim(), lastName: d["LAST NAME"].trim(), party: d["PARTY"], votes: (+d["GENERAL RESULTS"] || +d["TOTAL VOTES #"]), winner: (d["WINNER INDICATOR"]==="W")}' \
        | sed -f data-clean.sed \
        > temp/${FILE_BASE}.candidates.ndjson

    # find all the "Combined Parties:" special cases
    cat temp/${FILE_BASE}.candidates.ndjson \
        | ndjson-filter 'd.party === "Combined Parties:"' \
        > temp/${FILE_BASE}.combined.ndjson

    # and then filter them out
    ndjson-join --left 'd.state + d.name' temp/${FILE_BASE}.candidates.ndjson temp/${FILE_BASE}.combined.ndjson \
        | ndjson-filter 'd[1] === null || d[0].party === d[1].party' \
        | ndjson-map 'd[0]' \
        > temp/${FILE_BASE}.clean.ndjson

    # add in the FIPS code for each state
    ndjson-join 'd.state' temp/${FILE_BASE}.clean.ndjson temp/statefips.ndjson \
        | ndjson-map 'Object.assign({fips: d[1].fips}, d[0])' \
        > temp/${FILE_BASE}.fips.ndjson

    # get the total votes for each state
    cat temp/${FILE_BASE}.ndjson \
        | ndjson-filter 'd["TOTAL VOTES"].trim() === "Total State Votes:"' \
        | ndjson-map 'd = {state: d["STATE ABBREVIATION"], totalVoters: +d["TOTAL VOTES #"]}' \
        > temp/${FILE_BASE}.totals.ndjson

    # add the state totals and filter out the minor candidates
    ndjson-join 'd.state' temp/${FILE_BASE}.fips.ndjson temp/${FILE_BASE}.totals.ndjson \
        | ndjson-map 'Object.assign(d[0], {totalVoters: d[1].totalVoters})' \
        | ndjson-filter '["Trump, Donald J.", "Clinton, Hillary", "Johnson, Gary", "Stein, Jill", "McMullin, Evan", "Obama, Barack", "Romney, Mitt", "McCain, John", "Nader, Ralph", "Barr, Bob", "Bush, George W.", "Kerry, John F.", "Badnarik, Michael"].includes(d.name)' \
        > temp/${FILE_BASE}.focused.ndjson

    ndjson-join --left 'd.state + d.lastName' ./temp/${FILE_BASE}.focused.ndjson ./temp/${FILE}.electoral.pivot.ndjson \
        | ndjson-map 'Object.assign(d[0], {electoralVotes: d[1] ? d[1].electoralVotes : 0})' \
        > temp/${FILE_BASE}.final.ndjson

    # convert the ndjson files into json
    cat temp/${FILE_BASE}.final.ndjson \
        | ndjson-reduce \
        > temp/${FILE}.json
done
