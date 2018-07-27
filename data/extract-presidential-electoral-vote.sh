#!/usr/bin/env bash
# inspired by https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c
# requires:
# sudo easy_install xlsx2csv
# npm install -g d3-dsv
# npm install -g ndjson-cli

rm temp/federalelections*.electoral.*

# Source data files downloaded from the FEC website: https://transition.fec.gov/pubrec/electionresults.shtml
YEARS=( 2004 2008 2012 2016 )
for YEAR in "${YEARS[@]}"
do
    FILE=federalelections${YEAR}
	echo "Processing Presidential electoral vote data from ${FILE}.xlsx"
    FILE_BASE=${FILE}.electoral

    # Parse the excel file and extract the data sheet with the electoral vote data to a CSV
    SHEET=3
    if [ ${YEAR} -eq 2004 ]
    then
        SHEET=6
    fi
    xlsx2csv -s ${SHEET} -i ${FILE}.xlsx > temp/${FILE_BASE}.csv

    # pull out only the rows and columns with electoral vote data; clean it up a bit
    HEADER_ROW=$(( $( grep -n "AL," temp/${FILE_BASE}.csv | cut -f 1 -d\: ) - 1 ))
    tail -n +${HEADER_ROW} temp/${FILE_BASE}.csv \
        | head -n 52 \
        | cut -f 1-3 -d, \
        | sed -E 's/^,/STATE,/' \
        | sed -E 's/\*//g' \
        | sed -E 's/ \([D,R]\)//g' \
        | sed -E 's/Electoral Vote //g' \
        > temp/${FILE_BASE}.trim.csv

    # convert the CSV file to newline-delimited JSON
    dsv2json temp/${FILE_BASE}.trim.csv -n -o temp/${FILE_BASE}.ndjson

    # pivot data so that columns are: state, name, electoralVotes
    cat temp/${FILE_BASE}.ndjson \
        | ndjson-map 'candidate1 = Object.keys(d)[1], d = {state: d["STATE"], lastName: candidate1, electoralVotes: +d[candidate1]}' \
        > temp/${FILE_BASE}.pivot.ndjson

    # do it once for each candidate because the electoral vote can be split in some states (like ME)
    cat temp/${FILE_BASE}.ndjson \
        | ndjson-map 'candidate2 = Object.keys(d)[2], d = {state: d["STATE"], lastName: candidate2, electoralVotes: +d[candidate2]}' \
        >> temp/${FILE_BASE}.pivot.ndjson
done
