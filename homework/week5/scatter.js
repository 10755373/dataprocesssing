// Rinus van Grunsven
// 10755373

var science = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+AUS+JPN+GRC+HUN+LUX+POL+TUR+KOR+NLD+ESP+IRL+SVK+PRT+GBR/all?startTime=2007&endTime=2015"
var conf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+AUS+JPN+GRC+HUN+POL+LUX+TUR+ESP+SVK+IRL+GBR.COCONF.A/all?startTime=2007&endTime=2015"
var requests = [d3.json(science), d3.json(conf)];

// Onload api's
window.onload = function() {
  // if (requests.status >= 200 && requests.status < 400){
  Promise.all(requests).then(function(response) {
        let combined_data = transformResponse(response);
        year = undefined;
        let loaded = load(combined_data, year);
})};

// Make graph
function setGraph() {
  d3.selectAll("svg").remove();
  var year = document.getElementById('1').value;
  Promise.all(requests).then(function(response) {
    var data = transformResponse(response);
    let loaded = load(data, year);
  });
};

// Load right data
function load(combined_data, year){
  if ((year == "") || (year == undefined)){
    relevant_data = combined_data;
  } else {
    relevant_data = []
    for (let i = 0; i < combined_data.length; i++){
      if (combined_data[i][0] == year){
      relevant_data.push(combined_data[i]);
    }
    }};

    // Determine margins
    var margin = {top: 40, right: 80, bottom: 20, left: 30};
            height = 800 - margin.left - margin.right,
            width = 1200 - margin.bottom - margin.top;

    // Make svg
    var svg = d3.select("body")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

    // Make legend
    var legend = svg.append("rect")
                   .attr("class", "legend")
                   .attr("width", margin.right)
                   .attr("height", margin.top * 8)
                   .attr("x", width + margin.left)
                   .attr("y", 0);

    // Make list with all science values
    var science_list = [];
    for (let i = 0; i < relevant_data.length; i++){
      science_list.push(relevant_data[i][2]);
    };

    // Make list with all conf values
    var conf_list = []
    for (let i = 0; i < relevant_data.length; i++){
      conf_list.push(relevant_data[i][1])
    };

    // Make scales
    var xScale = d3.scaleLinear()
              .domain([Math.min(... science_list) - 5, Math.max(... science_list)])
              .range([20, width]);
    var yScale = d3.scaleLinear()
              .domain([Math.min(... conf_list) - 1, Math.max(... conf_list)])
              .range([height, 20]);

    // Append colours to countries and draw circles
    colours = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#636363", "#a6d854", "#ffd92f", "#b2182b", "#ef8a62", "#762a83", "#4d9221", "#2166ac", "#756bb1", "#d95f0e", "#f03b20", "#2b8cbe"];
    let colour_list = [];
    let colour = 0;
    for (let i = 0; i < relevant_data.length; i++){
        if (!colour_list.includes(relevant_data[i][3])){
          colour += 1;
          colour_list.push(relevant_data[i][3]);

          // make legend
          svg.append("text")
              .attr("x", width + margin.left)
              .attr("y", (colour * 20) + 10)
              .text(relevant_data[i][3])
              .attr("fill", colours[colour]);

        }
        // Draw circles
        svg.append("circle")
        .attr("cx", function() {
          return xScale(relevant_data[i][2]);
        })
        .attr("cy", function() {
          return yScale(relevant_data[i][1]);
        })
        .attr("r", 5)
        .attr("fill", colours[colour]);
      };

    // Add title above barchart
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
    	.style('fill', 'darkOrange')
      .text("Scatterplot: % woman in science vs consumer confidence per country");

    // Determine x-as
    var xAxis = d3.axisBottom()
                  .scale(xScale)
                  .ticks(10);

    // Determine y-as
    var yAxis = d3.axisLeft()
                  .scale(yScale)
                  .ticks(10);

    // Draw x-as
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .call(xAxis)

    // Draw y-as
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left * 1.65 + ", 0)")
        .call(yAxis)

    // Append label to x-as
    svg.append("text")
       .attr("transform",
           "translate(" + (width/2) + " ," +
                          (height + margin.top) + ")")
       .style("text-anchor", "middle")
       .text("% woman");

    // Append label to y-as
     svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", - height/2)
        .attr("y", 15)
        .style("text-anchor", "middle")
        .text("Confidence (of consumers)");

    // create text box for mouseover event
    var tip = d3.select("body")
      		.data(relevant_data)
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
        var combined_data = []
        var y = 0
        for (let i = 0; i < dataCollection[0].length; i++){
          if (dataCollection[0][i].time != dataCollection[1][i + y].time){
            y += 1
          }
          let tempObj = [dataCollection[1][i + y].time, dataCollection[1][i + y].datapoint, dataCollection[0][i].datapoint, dataCollection[1][i + y].Country]
          combined_data.push(tempObj)
        };
    return combined_data;
  };
