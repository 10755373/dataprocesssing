var requests = [d3v5.json("DP_LIVE_GDP.json")];

window.onload = function() {
  Promise.all(requests).then(function(response) {
    var req = response
    let draw = world(req)
    })
  };

function world(data) {

  // Use function to clean data
  var data_cleaned = transformresponse(data)

  // Set margins
  var margin = {top: 70, right: 100, bottom: 20, left: 50},
        height = 900 - margin.bottom - margin.top,
        width = 1300 - margin.left - margin.right;

  // Append title
  var svg = d3v5.select("div")
    .append("text")
    .attr("x", (width / 2))
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
  	.style('fill', 'darkOrange')
    .text("Worldmap: GDP per capita");

// Get values from 2016
var values_2016 = []
for (let i = 0; i < data_cleaned.length; i++){
  if (data_cleaned[i][1] == "2016") {
    values_2016.push(data_cleaned[i][2]);
  }
};

// Make dictionary with country as key and gdp (2016) as value
var saved_dict = {}
for (let i = 0; i < data_cleaned.length; i++){
  if (data_cleaned[i][1] == "2016") {
    saved_dict[data_cleaned[i][0]] = data_cleaned[i][2]
  }
};

// Determine colorscale for every country
var dict_2016 = {}
for (let i = 0; i < data_cleaned.length; i++){
  if (data_cleaned[i][1] == "2016") {
    dict_2016[data_cleaned[i][0]] = data_cleaned[i][2]
  }
};

// Determine colorscale
var colorScale = d3v5.scaleOrdinal()
            .domain([Math.min(... values_2016), Math.max(... values_2016)])
            .range(['Laag','Medium','Hoog','Uitzonderlijk']);

// Adjust previously made dict
for (var key in dict_2016) {
  let country_color = {}
  country_color["Value"] = parseInt(dict_2016[key])
  country_color["fillKey"] = colorScale(dict_2016[key])
  dict_2016[key] = country_color;
}

// Make worldmap visible
var map = new Datamap({
    element: document.getElementById('container'),
    responsive: true,
    fills: {
        defaultFill: '#f0a0fa',
        Ontbrekend: '#f0a0fa',
        Laag: '#ccffcc',
        Semi: '#96c985',
        Hoog: '#61943d',
        Uitzonderlijk: '#336600'
    },
    data: dict_2016,
    scope: 'world',
    responsive: true,
    geographyConfig: {
        popupTemplate: function(geo, data) {
            return ['<div class="hoverinfo"><strong>',
                    'Total GDP in ' + geo.properties.name,
                    ': ' + data.Value,
                    '</strong></div>'].join('');
        }
    },
    done: function(datamap) {
      datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
        setlinegraph(geography.properties.iso);
      })}

    });

  // Make an empty graph underneath the world map
  setgraph();

  // Make a legend
  map.legend();

};

function setgraph(country) {

  // Load data
  d3v5.json("DP_LIVE_GDP.json").then(function(response){

  // Retrieve the right data from loaded data
  var graph_data = response.data

  // Determine margins
  var margin = {top: 20, right: 80, bottom: 30, left: 200},
        width = 1300 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

  // Make a svg
  var svg = d3v5.select("body")
            .append("svg")
            .attr("id", "lineplot")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

  // Make title
  svg.append("text")
     .attr("x", width / 1.5)
     .attr("class", "title")
     .attr("y", margin.top / 1.2)
     .style("text-anchor", "middle")
     .style("font-size", "16px")
     .text("When clicked on a country you'll see the GDP per capita from 1960 to 2016");

  // Get years and parse them
  var parseTime = d3v5.timeParse("%Y");
  var years = []
  for (let i = 1970; i < 2016; i++) {
      j = parseTime(i)
      years.push(j);
      }

  // Get all gdp's
  var gdps = []
  for (let i = 0; i < graph_data.length; i++) {
      gdps.push(graph_data[i][2]);
  }

  // Determine xScale
  var xScale = d3v5.scaleTime()
                  .range([0, width])
                  .domain([Math.min(... years), Math.max(... years)]);

  // Determine yScale
  var yScale = d3v5.scaleLinear()
                .range([height, 0])
                .domain([Math.min(... gdps), Math.max(... gdps)]);

  // Determine xAxis
  var xAxis = d3v5.axisBottom()
              .scale(xScale)
              .ticks(10);

  // Determine yAxis
  var yAxis = d3v5.axisLeft()
              .scale(yScale)
              .ticks(10);

  // Make yaxis
  svg.append("g")
     .attr("class", "yAxis")
     .attr("transform", "translate(" + margin.left + ",0)")
     .call(yAxis)
     .style("font-size", "10px");

  // Make xaxis
  svg.append("g")
     .attr("class", "xAxis")
     .attr("transform", "translate(" + margin.left + "," + height + ")")
     .call(xAxis)
     .style("font-size", "10px");

  // Make label xaxis
  svg.append("text")
      .attr("transform", "translate(" + (width / 2) + " ," +
                         (height + margin.top + margin.bottom) + ")")
      .style("text-anchor", "middle")
      .text("Year")
      .style("font-size", "15px");

  // Make label yaxis
  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", - height / 2)
     .attr("y", margin.left / 2)
     .style("text-anchor", "middle")
     .text("Average GDP per capita")
     .style("font-size", "15px");

    // Get data from country throughout the year
   var gdp_country = []
   for (let i = 0; i < graph_data.length; i++) {
     if (graph_data[i][0] == country){
       gdp_country.push({"Year" : graph_data[i][1], "GDP" : graph_data[i][2]});
     }
   }

  // make temporary line
 var temp_line = d3v5.line()
   .x(function(d) { return xScale(d.Year);
   })
   .y(function(d) { return yScale(d["GDP"]);
   })

  // Determine path for temporary line
 svg.append("path")
     .data([gdp_country])
     .attr("class", "line")
     .attr("d", temp_line)
     .attr("fill", "white")
     .style("stroke", "orange")
     .style("stroke-width", 4)
     .attr("transform", "translate(" + margin.left + ", 0)");

}
)};

function setlinegraph(country) {

  // Load data
  d3v5.json("DP_LIVE_GDP.json").then(function(response){

  // Get right data and put it in a variable
  var overall_data = response.data

  // Determine margins
  var margin = {top: 20, right: 80, bottom: 30, left: 200},
        width = 1300 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

  // Get data from country
  var country_data = []
  for (let i = 0; i < overall_data.length; i++) {
    if (overall_data[i][0] == country) {
      country_data.push(overall_data[i][2]);
    }}

  // Get time and parse it in the right format
  var parseTime = d3v5.timeParse("%Y")
  var years = []
  for (let i = 0; i < overall_data.length; i++) {
    if (overall_data[i][0] == country) {
      j = parseTime(overall_data[i][1])
      years.push(j);
    }}

  // Make yScale
  var yScale = d3v5.scaleLinear()
                .range([height, 0])
                .domain([Math.min(... country_data), Math.max(... country_data)]);

  // Make yAxis
  var yAxis = d3v5.axisLeft()
              .ticks(10)
              .scale(yScale);

  // Get both year and gdp from specific country and put it in a dict
  var info_country = []
  for (let i = 0; i < country_data.length && years.length; i++) {
      info_country.push({"Year" : years[i], "GDP" : overall_data[i][2]});
    }

  // Make xScale
  var xScale = d3v5.scaleTime()
                .range([0, width])
                // .domain([d3v5.extent(years_country, function(d) { return d })]);
                .domain([Math.min(... years), Math.max(... years)]);
  // var proef = d3v5.extent(years_country, function(d) { return d })
  // console.log(proef)

  // Make xAxis
  var xAxis = d3v5.axisBottom()
              .ticks(10)
              .scale(xScale);

  // Determine points
   var country_line = d3v5.line()
     .x(function(d) {
       return xScale(d.Year);
     })
     .y(function(d) {
       return yScale(d["GDP"]);
   });

   // Place data in the right position
   var bisectDate = d3v5.bisector(function(d) { return d; }).left;

   // Select lineplot
   var svg = d3v5.selectAll("#lineplot");

   // Make the changes to the line
   svg.select(".line")
      .transition()
      .duration(750)
      .attr("d", country_line(info_country));

  // Create class for mouseover event
  var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    // Make path
    mouseG.append("path")
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    // Get lines' id
    var lines = document.getElementsByClassName('line');

    // Append data to circle
    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(info_country)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    // Append circle to mouseover line for the data display
    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", '#000000')
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    // Append text to circle
    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");

    // Make data circle
    mouseG.append('svg:rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() {
        d3v5.select(".mouse-line")
          .style("opacity", "0");
        d3v5.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3v5.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() {
        d3v5.select(".mouse-line")
          .style("opacity", "1");
        d3v5.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3v5.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() {
        var mouse = d3v5.mouse(this);
        d3v5.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        // Determine data for data circles with a function
        d3v5.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            var lines = document.getElementsByClassName('line')
            var xDate = xScale.invert(mouse[0]),
                bisect = d3v5.bisector(function(d) { return d.Year; }).left;
                idx = bisect(d.GDP, xDate);

            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.xScale !== mouse[0]) {
                  break;
              }
              if (pos.xScale > mouse[0])      end = target;
              else if (pos.xScale < mouse[0]) beginning = target;
              else break;
            }

            d3v5.select(this).select('text')
              .text(yScale.invert(pos.yScale).toFixed(2));

            return "translate(" + mouse[0] + "," + pos.yScale +")";
          });
      });
})};

// Function to retrieve the right data
function transformresponse(data) {
    var data_list = []
    for (let i = 0; i < data[0].data.length; i++){
        data_list.push(data[0].data[i])
      }
    return data_list;
  };
