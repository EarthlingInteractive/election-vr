# Mapping the 2016 popular vote for US president in VR
 
The recent presidential election results show Donald Trump winning the electoral college but Hillary Clinton winning the popular vote.  The existing visualizations showing states or counties as red or blue provides information about the majority vote but they hide any sense of scale and they conceal the number of votes that non-majority candidates received.  For example, if one looks at the Google’s visualization of the Massachusetts voting results, all of the counties are blue and one would get the impression that no one voted for Donald Trump or any other candidate.  In fact, over one million people in Massachusetts voted for Donald Trump. 
 
I propose to build a visualization that would leverage the 3D capabilities of virtual reality to show a more complete and nuanced view of the voting results.
 
Prototype 1:  Show the proportion of votes that each candidate received by coloring proportionally sized sections of each state on the map.  This first prototype would be in 2D.  The candidate with the highest number of votes would have their area displayed in the center.  The shape of the area would be the same as the shape of the state scaled to the percentage of the vote that the candidate received.  The other candidates’ areas would be shaped similarly but would surround the winning candidate’s area like tree rings. Estimated effort: 1-2 days
 
Prototype 2: Show the number of votes that each candidate received by extending the areas of the first prototype vertically into 3D.  This prototype would be in virtual reality with a web-accessible 3D version, too.  The initial scale would be set so that 6 million votes would appear to be 6 feet tall.  This would allow comparisons between states based on the numbers of voters.  Estimated effort: 3-5 days
 
Prototype 3: Add the visualization of results by county data to prototype 2.  This would provide a more nuanced view of the voting results.  Estimated effort: 2-5 days
 
Prototype 4:  Add interactivity to the visualization by allowing the viewer to choose to see only the results for particular candidates.  Estimated effort: 1 day
 
Prototype 5: Add the ability for the viewer to change the scale of the visualization so that they can zoom in to look at the voting results for less populous states.  Estimated effort: 1 day
 
Prototype 6: Add data from past elections so that the results from another year could be visualized in this manner.  Estimated effort: 2-3 days
 
Prototype 7: Allow comparison between the results of two different election years by superimposing the results.  Estimated effort: 5-7 days
 
Prototype 8: Show estimated max possible voter turnout in the outermost ring of the tree. Draw boundaries to show the actual turn-out from previous years.

Prototype 9: Show real-time updates of data from AP feed (for use in CNN Newsroom of the future)

Challenges and Risks:
* County-level voting data from the 2016 election is currently only available from 1) individual state and county clerk web sites or 2) from the Associated Press.  The data from the AP is rich and formatted for easy use in visualizations but there is a fee to access it.  The data from state and county web sites vary from state to state and county to county.  It is not formatted for use in visualization and would need to be compiled manually into a spreadsheet via copy and paste.
* Country-level data may hit performance issues when rendering because of the number of objects involved.
 
Technologies:
* WebVR using the A-Frame VR framework from Mozilla
* Three.js is the underlying library used by A-Frame for rendering
* D3.js for transforming map data into 2D paths that can be converted to 3D using Three.js
* TopoJSON US Atlas for state and county boundaries
* AP Data via Google for state-level voting results (copied and pasted into a CSV file)
* [Elex](https://source.opennews.org/en-US/articles/introducing-elex-tool-make-election-coverage-bette/) for getting AP data
 
Related Visualizations:
* http://scribu.github.io/romania-3d/
* http://www.smartjava.org/content/render-geographic-information-3d-threejs-and-d3js
* http://www.politico.com/2016-election/results/map/president

Data Sets: 
* FIPS data: http://www2.census.gov/geo/docs/reference/state.txt

