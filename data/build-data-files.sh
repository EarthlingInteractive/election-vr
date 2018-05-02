#!/usr/bin/env bash
# inspired by https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c
# requires:
# npm install -g shapefile
# npm install -g d3-geo-projection
# npm install -g ndjson-cli
# npm install -g d3-dsv
# npm install -g topojson

rm temp/*.*

# download the state shape file from census.gov
if [ ! -e cb_2017_us_state_20m.zip ]; then
    curl 'https://www2.census.gov/geo/tiger/GENZ2017/shp/cb_2017_us_state_20m.zip' -o cb_2017_us_state_20m.zip
fi
unzip -o cb_2017_us_state_20m.zip -d temp

# convert the shape file to geojson
shp2json temp/cb_2017_us_state_20m.shp -o temp/cb_2017_us_state_20m.geo.json

# pre-project the geojson using geoAlbersUsa for better rendering performance
geoproject 'd3.geoAlbersUsa()' < temp/cb_2017_us_state_20m.geo.json > temp/cb_2017_us_state_20m-albers.geo.json

# use ndjson to set an id property on each state
ndjson-split 'd.features' \
  < temp/cb_2017_us_state_20m-albers.geo.json \
  > temp/cb_2017_us_state_20m-albers.geo.ndjson
ndjson-map 'd.id = d.properties.GEOID, d' \
  < temp/cb_2017_us_state_20m-albers.geo.ndjson \
  > temp/cb_2017_us_state_20m-albers.id.geo.ndjson

# trim the properties for each county into a single properties object
ndjson-map 'd.properties = {name: d.properties.NAME, abbrev: d.properties.STUSPS}, d' \
  < temp/cb_2017_us_state_20m-albers.id.geo.ndjson \
  > temp/cb_2017_us_state_20m-albers-trim.ndjson

# convert the ndjson back to geojson
ndjson-reduce 'p.features.push(d), p' '{type: "FeatureCollection", features: []}' \
  < temp/cb_2017_us_state_20m-albers-trim.ndjson \
  > temp/cb_2017_us_state_20m-albers-trim.geo.json

geo2topo -n \
  states=temp/cb_2017_us_state_20m-albers-trim.ndjson \
  > temp/cb_2017_us_state_20m-albers-trim.topo.json

toposimplify -p 1 -f \
  < temp/cb_2017_us_state_20m-albers-trim.topo.json \
  > temp/cb_2017_us_state_20m-albers-simple.topo.json

topoquantize 1e5 \
  < temp/cb_2017_us_state_20m-albers-simple.topo.json \
  > temp/cb_2017_us_state_20m-albers-quantized.topo.json

# copy the topojson data into the assets folder so that it can be visualized
cp temp/cb_2017_us_state_20m-albers-quantized.topo.json ../src/assets
