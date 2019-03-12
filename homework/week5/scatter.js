// Rinus van Grunsven
// 10755373

// var life_expectancy = "https://stats.oecd.org/index.aspx?r=467292&erroCode=403&lastaction=login_submit#"
// var min_wage = "https://stats.oecd.org/index.aspx?r=467292&erroCode=403&lastaction=login_submit#"
//
// var le = "https://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+CAN+CHL+COL+CZE+EST+FRA+DEU+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+TUR+GBR+USA+CRI+BRA+RUS.EXR+PPP.H+A/all?startTime=2000&endTime=2017&dimensionAtObservation=allDimensions"
// var rmw = "https://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+CAN+CHL+COL+CZE+EST+FRA+DEU+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+TUR+GBR+USA+CRI+BRA+RUS.EXR+PPP.H+A/all?startTime=2000&endTime=2017&dimensionAtObservation=allDimensions"
//
// var requests = [d3.json(le), d3.json(rmw)];

var gde = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/G_PPP.FRA+DEU+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var ppp = "https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.FRA+DEU+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var requests = [d3.json(gde), d3.json(ppp)];

window.onload = function() {
  // if (requests.status >= 200 && requests.status < 400){
  Promise.all(requests).then(function(response) {
      // response.forEach(function(data){
        let refined_data = transformResponse(response)
        // combine the data into one array
        year = undefined
        let draw = main(refined_data, year)
        }).catch(function(e){
            throw(e);
        });
      };

function main(refined_data, year){
  if ((year == undefined) || (year == "")){
    data = refined_data
  } else {
    data = []
    for (let i = 0; i < refined_data.length; i++){
      if (refined_data[i][0] == year){
        // add data to data thingy
        data.push(refined_data[i]);
      }
    }
  }};

function setGraph() {
  d3.selectAll("svg").remove();
  var year = document.getElementById('1').value;
  Promise.all(requests).then(function(response) {
      // response.forEach(function(data){
        var data = transformResponse(response)
        let draw = main(data, year)
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
                  dataArray.push(tempObj);
              }
          });
      });
      dataCollection.push(dataArray)
      })

        // combine data based on their years
        // create new array to which to add combined data
        var combinedData = []
        var y = 0
        for (let i = 0; i < dataCollection[0].length; i++){
          if (dataCollection[0][i].time != dataCollection[1][i + y].time){
            y += 1
          }
          let tempObj = [dataCollection[1][i + y].time, dataCollection[1][i + y].datapoint, dataCollection[0][i].datapoint, dataCollection[1][i + y].Country]
          combinedData.push(tempObj)
        };
        return combinedData;
        };

// use d3 to make the plot
// define heigth, width, padding
// var padding = 30;
var margin = {top: 40, right: 120, bottom: 20, left: 30},
        height = 500 - margin.left - margin.right,
        width = 800 - margin.bottom - margin.top;

// create a svg canvas
var svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
	 		          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Determine domain and range
var gde_list = []
for (var i = 0; i < data.length; i++){
  gde_list.push(data[i][1])
};

var ppp_list = []
for (var i = 0; i < data.length; i++){
  ppp_list.push(data[i][2])
};

var xAxis = d3.scaleLinear()
          .range([0, width])
          .domain([Math.min(...ppp) -10, Math.max(...ppp)])
          .ticks(10);

var yAxis = d3.scaleLinear()
          .range(height, 0)
          .domain([Math.min(...gde) -10, Math.max(...gde)])
          .ticks(10);

// Add title above barchart
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
	.style('fill', 'darkOrange')
  .text("Scatterplot: Gross Domestic Expenditure on R&D at current PPP$ vs purchasing parity power");

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
          .text("parity power");

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
