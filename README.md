# ElectionVR: Mapping the popular vote for US President in VR

ElectionVR is an experiment in using virtual reality to give people a more intuitive and nuanced view of election data.  It allows you to walk around a map of the United States and explore the data for the last four presidential elections, showing the number and percentage of votes that each of the major candidates received in each state.  You’ll be able to see that in 2016 more 1 million people in the democratic stronghold of Massachusetts voted for Donald Trump and that almost 4 million people in Texas voted for Hillary Clinton, a state which no Democrat has won since 1976.  You’ll also see the surprisingly strong showing of third-party candidates, such as Gary Johnson and Evan McMullin, especially as compared to previous elections.  

To explore these stories and more, go to: https://electionvr.earthlinglabs.com/

[![Election VR](./src/assets/preview.png)](https://electionvr.earthlinglabs.com/)

The visualization is built in WebVR so it can be viewed using the HTC Vive, Oculus Rift, Google Cardboard, or a Desktop browser.  The Vive and the Rift support controller-based interactions to move and scale the map.

## About the data

The `data` subdirectory contains the source data files used in the visualization.  

The election data were downloaded from the [Federal Election Commission website](https://transition.fec.gov/pubrec/electionresults.shtml)
and processed using the `data/build-election-data-files.sh` script.

The map data were downloaded from [census.gov](https://census.gov) and processed using the `data/build-map-files.sh` script.

The FIPS code to state data is also from census.gov: http://www2.census.gov/geo/docs/reference/state.txt

These scripts provide a reproducible way to download and process the data files into the versions in `src/assets` that are used
directly in the visualization.  Note that the scripts must be run from within the `data` subdirectory.  They also
require several globally installed npm packages.  See the header of each file for details.

Finally, per the instructions on census.gov, I must state that "This product uses the Census Bureau Data API but is not endorsed or certified by the Census Bureau."

## Developing

### Pre-requisites

* [Node.js v8+](https://nodejs.org/en/)

### Running the project locally

When making changes to this project, it's easiest to run it locally using the webpack dev server:

```bash
npm install
npm start
```

## Releasing

This project follows a Git Flow style convention with changes being merged from a feature branch through to the master branch.

```
[feature branch] --> test --> stage --> master
```

The stage and master branches use Docker and the Earthling deployment pipeline.  You can test the Docker deploy locally by running:
```
docker-compose up --build
```
and then navigating to http://localhost:8080/

### Test environment

The test branch gets deployed to GitHub pages: https://earthlinginteractive.github.io/election-vr/

To release new changes:
```bash
npm run deploy
```

### Stage environment

The stage branch gets deployed to https://electionvr.ei-app.com/

To release new changes, use the GitLab Pipeline bot in HipChat:
```
/pipeline deploy --name=election-vr --env=stage
```

### Production environment

The master (production) branch gets deployed to https://electionvr.earthlinglabs.com/

To release new changes, use the GitLab Pipeline bot in HipChat:
```
/pipeline deploy --name=election-vr --env=master
```


# Thanks
* To John Samuelson, Adam Simcock, Don Smith, Jared Chapiewsky, AJ Wortley, Linda Brudz, and Jake Brudz for their feedback, testing, and support
* To Earthling Interactive for their sponsorship
* To Kevin Ngo, Diego Marcos, Don McCurdy and many others at Mozilla and the community for creating the [A-Frame WebVR framework](https://aframe.io/)
* To Matthias Treitler for his [aframe-geojson-component](https://github.com/mattrei/aframe-geojson-component) which provided inspiration
and a starting point for how to display maps in VR
* To Will Murphy for his [super hands component](https://github.com/wmurphyrd/aframe-super-hands-component) which provides progressive support
and gestures for different types of controllers
* To Mike Bostock for creating d3.js and for his excellent series of articles on [command line cartography](https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c)

## Credits

Created by Steve Brudz with support and sponsorship from [Earthling Interactive](https://earthlinginteractive.com/)

[![Earthling Interactive](./src/assets/earthling-logo.png)](https://earthlinginteractive.com/)
