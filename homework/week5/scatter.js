// Rinus van Grunsven
// 10755373

var science = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+AUS+JPN+GRC+HUN+LUX+POL+TUR+KOR+NLD+ESP+IRL+SVK+PRT+GBR/all?startTime=2007&endTime=2015"
var conf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+AUS+JPN+GRC+HUN+POL+LUX+TUR+ESP+SVK+IRL+GBR.COCONF.A/all?startTime=2007&endTime=2015"
var requests = [d3.json(science), d3.json(conf)];
console.log(requests);

window.onload = function() {
  // if (requests.status >= 200 && requests.status < 400){
  Promise.all(requests).then(function(response) {
      // response.forEach(function(data){
        var refined_data = transformResponse(response)
        console.log(refined_data)
        }).catch(function(e){
            throw(e);
        });
      };

function setGraph() {
  d3.selectAll("svg").remove();
  var year = document.getElementById('1').value;
  Promise.all(requests).then(function(response) {
        var data = transformResponse(response)
  })
};

function transformResponse(response){
    // set array to add response to
    var dataCollection = []
    response.forEach(function(data){
      // access data property of the response
      let dataHere = data.dataSets[0].series;
      // access variables in the response and save length for later
      let series = data.structure.dimensions.series;
      let seriesLength = series.length;

      // set up array of variables and array of lengths
      let varArray = [];
      let lenArray = [];

      series.forEach(function(serie){
          varArray.push(serie);
          lenArray.push(serie.values.length);
      });

      // get the time periods in the dataset
      let observation = data.structure.dimensions.observation[0];
      // add time periods to the variables, but since it's not included in the
      // 0:0:0 format it's not included in the array of lengths
      varArray.push(observation);

      // create array with all possible combinations of the 0:0:0 format
      let strings = Object.keys(dataHere);

      // set up output array, an array of objects, each containing a single datapoint
      // and the descriptors for that datapoint
      let dataArray = [];

      // for each string that we created
      strings.forEach(function(string){
          // for each observation and its index
          observation.values.forEach(function(obs, index){
              let data = dataHere[string].observations[index];
              if (data != undefined){

                  // set up temporary object
                  let tempObj = {};

                  let tempString = string.split(":").slice(0, -1);
                  tempString.forEach(function(s, indexi){
                      tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                  });

                  // every datapoint has a time and ofcourse a datapoint
                  tempObj["time"] = obs.name;
                  tempObj["datapoint"] = data[0];
                  // tempObj["Country"] = data.structure.dimensions.series[1].values[0].name
                  dataArray.push(tempObj);
              }
          });
      });
      dataCollection.push(dataArray)
      console.log(dataCollection)
      })
        // combine data based on their years
        // create new array to which to add combined data
        var combined = []
        var y = 0
        for (let i = 0; i < dataCollection[0].length; i++){
          if (dataCollection[0][i].time != dataCollection[1][i + y].time){
            y += 1
          }
          let tempObj = [dataCollection[1][i + y].time, dataCollection[1][i + y].datapoint, dataCollection[0][i].datapoint, dataCollection[1][i + y].Country]
          combined.push(tempObj)
        };
        return combined;
        };

// Determine margins
var margin = {top: 40, right: 120, bottom: 20, left: 30},
        height = 500 - margin.left - margin.right,
        width = 800 - margin.bottom - margin.top;

// create a svg canvas
var svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)


// Make list with all science values
var science_list = []
for (var i = 0; i < refined_data.length; i++){
  science_list.push(refined_data[i][2])
};

// Make list with all conf values
var conf_list = []
for (var i = 0; i < refined_data.length; i++){
  conf_list.push(refined_data[i][1])
};

var xAxis = d3.scaleLinear()
          .range([0, width])
          .domain([Math.min(...conf) -10, Math.max(...conf)])
          .ticks(10);

var yAxis = d3.scaleLinear()
          .range(height, 0)
          .domain([Math.min(...science) -10, Math.max(...science)])
          .ticks(10);

var colour_country = [{"Country": {"France": "#66c2a5"}}, {"Country": {"Germany": "#fc8d62"}}, {"Country": {"KOR": "#8da0cb"}}, {"Country": {"Netherlands": "#e78ac3"}},
                      {"Country": {"Portugal": "#e78ac3"}}, {"Country": {"Australia": "#a6d854"}}, {"Country" : {"Japan": "#ffd92f"}}, {"Country": {"Greece": "#b2182b"}},
                      {"Country": {"Hungary": "#ef8a62"}}, {"Country": {"Poland": "#762a83"}}, {"Country": {"Luxembourg": "#4d9221"}}, {"Country": {"Turkey": "#2166ac"}},
                      {"Country": {"Spain": "#756bb1"}}, {"Country": {"Slovenia": "#d95f0e"}}, {"Country": {"IRL": "#f03b20"}}, {"Country": {"United Kingdom": "#2b8cbe"}}];

// function colours_coun(data){
//   for (var i = 0; i < refined_data.length; i++){
//     if(refined_data[i][3] == )
//   }
// }


var colours = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#e78ac3", "#a6d854", "#ffd92f", "#b2182b", "#ef8a62", "#762a83", "#4d9221", "#2166ac", "#756bb1", "#d95f0e", "#f03b20", "#2b8cbe"];
var colour_dict = {}
let colour = 0
for (var i = 0; i < refined_data.length; i++){
    if (!colour_dict.includes(refined_data[i][3])){
      color_dict[refined_data[i][3]] = "colours"
      colour += 1
    }
    svg.append("circle")
          .attr("cx", function(){
            return xAxis(data[i][1])
          });
          .attr("cy", function(){
            return yAxis(data[i][2])
          });
          .attr("r", 5)
          .attr("fill", color_dict[colour])
      };

// Add title above barchart
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
	.style('fill', 'darkOrange')
  .text("Scatterplot: Science Expenditure vs confidence");

// create legend block
var legend = svg.append("rect")
               .attr("class", "legend")
               .attr("width", margin.right)
               .attr("height", margin.top * 3)
               .attr("x", width + margin.left)
               .attr("y", 0)
               .style("fill", "rgb(0, 255, 0)");

// Determine the axis
// Determine x as
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
          .attr("class", "x label_x")
          .attr("x", width - margin.left)
          .attr("y", 50)
          .text("confidence");

// Determine y as
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".6em")
        .style("text-anchor", "end")
        .text("gde");

// create text box for mouseover event
var tip = d3.select("body")
  		.data(data)
  		.append("div")
  		.attr("class", "tip")
  		.text("")
  		.style("position", "absolute")
  		.style("display", "none")
  		.on("mouseover", function(d, i) {
  		  tip.transition().duration(0);
  		})
  		.on("mouseout", function(d, i) {
    		tip.style("display", "none");
  		});
