var requests = [d3v5.json("DP_LIVE_GDP.json")];

window.onload = function() {
  Promise.all(requests).then(function(response) {
    var req = response
    console.log(req)
    let draw = world(req)

})};

function world(data) {

  console.log(data)

  var data_cleaned = transformresponse(data)
    console.log(data_cleaned)

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

  // var svg = d3v5.select("body")
  //             .append("svg")
  //             .attr("id", "map")
  //             .attr("width", width + margin.left + margin.right)
  //             .attr("height", height + margin.top + margin.bottom)
  //             .append("class", "map");

  // var legend = svg.append("rect")
  //              .attr("class", "legend")
  //              .attr("width", margin.right)
  //              .attr("height", margin.top * 8)
  //              .attr("x", width + margin.left)
  //              .attr("y", 0);

var values_2016 = []
for (let i = 0; i < data_cleaned.length; i++){
  if (data_cleaned[i][1] == "2016") {
    values_2016.push(data_cleaned[i][2]);
  }
};
console.log(values_2016)

var saved_dict = {}
for (let i = 0; i < data_cleaned.length; i++){
  if (data_cleaned[i][1] == "2016") {
    saved_dict[data_cleaned[i][0]] = data_cleaned[i][2]
  }
};

var dict_2016 = {}
for (let i = 0; i < data_cleaned.length; i++){
  if (data_cleaned[i][1] == "2016") {
    dict_2016[data_cleaned[i][0]] = data_cleaned[i][2]
  }
};
console.log(dict_2016)

// Determine colorscale
var colorScale = d3v5.scaleOrdinal()
            .domain([Math.min(... values_2016), Math.max(... values_2016)])
            .range(['Laag','Medium','Redelijk','Hoog','Uitzonderlijk']);

// Adjust previously made dict
for (var key in dict_2016) {
  let country_color = {}
  country_color["Value"] = parseInt(dict_2016[key])
  country_color["fillKey"] = colorScale(dict_2016[key])
  dict_2016[key] = country_color;
}

console.log(dict_2016);

console.log(saved_dict);

// Make worldmap visible
var map = new Datamap({
    element: document.getElementById('container'),
    responsive: true,
    fills: {
        defaultFill: '#f0a0fa',
        Laag: '#e6f2ff',
        Semi: '#99ccff',
        Redelijk: '#3399ff',
        Hoog: '#0059b3',
        Uitzonderlijk: '#00264d'
    },
    data: dict_2016,
    scope: 'world',
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
        state_name = geography.properties.name
        setlinegraph(state_name);
      })}
    // done: function(datamap) {
    //   datamap.div.selectAll('.datamaps-subunit').on('click', function (geography) {
    //     state_name = geography.properties.name
    // //     // var fillkey_obj = datamap.options.data[state_id] || {fillColor: '#FF1493'};
    // //     // var fillkey = fillkey_obj.fillColor;;
    // //     // var fillkeys = Object.keys(fills);
    // //     // var antikey = fillkeys[Math.abs(fillkeys.indexOf(fillkey) - 1)];
    // //     // var new_fills = {
    // //     //   [geography.id] : {
    // //     //     fillColor: antikey
    // //     //   }
    // //     // }
    // //     // datamap.updateChoropleth(new_fills)
    //     setlinegraph(state_name);
      // });
      // }
    // setProjection: function linegraph(country, data) {
    // var projection = d3.geo.equirectangular()}
    // d3v5.select("body").on('click', function() {
    //     linegraph(country, data);
    // })
    });

  // Make an empty graph underneath the world map
  setgraph();

  // Make a legend
  map.legend();

  //
  // var projection = d3v5.geoMercator()
  //                     .scale(100)
  //                     .translate([width / 2, height / 1.5]);
  //
  // var path = d3v5.geoPath().projection(projection);
  //
  // var xScale = d3v5.scaleLinear()
  //           .domain([Math.min(... values_2016) - 5, Math.max(... values_2016)])
  //           .range([20, width]);


};

function setgraph() {

  // Load data
  d3v5.json("DP_LIVE_GDP.json").then(function(data){

  // Retrieve the right data from loaded data
  var graph_data = data.data

  // Determine margins
  var margin = {top: 20, right: 80, bottom: 30, left: 200},
        width = 1000 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

  // Make a svg
  var svg = d3v5.select("body")
            .append("svg")
            .attr("id", "lineplot")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

  // Make title
  svg.append("text")
     .attr("x", width)
     .attr("class", "title")
     .attr("y", margin.top / 1.3)
     .style("text-anchor", "middle")
     .style("font-size", "16px")
     .text("When clicked on a country you'll see the GDP per capita from 1960 to 2016");

  // var formatDate = d3v5.time.format("%y");
  // d.year = formatDate.parse(d.year);
  // var parseTime = d3.timeParse("%Y")
  var parseTime = d3v5.timeParse("%Y");
  var years = []
  for (let i = 1960; i < 2016; i++) {
      j = parseTime(i)
      years.push(j);
      }

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
     .style("font-size", "15px");M
  // make temporary line
 var temp_line = d3v5.line()
   .x(function(d) { return xScale(parseTime(d.Year));
   })
   .y(function(d) { return yScale(d["GDP"]);
   })

  // Determine path for temporary line
 svg.append("path")
     .data([gdps])
     .attr("class", "line")
     .attr("d", temp_line)
     .attr("fill", "black")
     .style("stroke", "orange")
     .style("stroke-width", 4)
     .attr("transform", "translate(" + margin.left + ", 0)");

}
)};

function setlinegraph(country) {

  d3v5.json("DP_LIVE_GDP.json").then(function(data){

  var overall_data = data.data

  var margin = {top: 20, right: 80, bottom: 30, left: 200},
        width = 1000 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

  var svg = d3.select("body")
            .append("svg")
            .attr("id", "lineplot")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

  var country_data = []
  for (let i = 0; i < overall_data.length; i++) {
    if (overall_data[i][0] == country) {
      country_data.push(overall_data[i][2]);
    }}


  var parseTime = d3v5.timeParse("%Y")
  var years = []
  for (let i = 0; i < overall_data.length; i++) {
      j = parseTime(i)
      years.push(j);
      }

  // var data_cleaned = []
  // for (i = 0; i < data_cleaned.length; i++) {
  //   data_cleaned.push(data_cleaned[i][2]);
  //   }

  // Make xScale
  var xScale = d3v5.scaleTime()
                  .range([0, width])
                  .domain([Math.min(... years), Math.max(... years)]);

  // Make yScale
  var yScale = d3v5.scaleLinear()
                .range([height, 0])
                .domain([Math.min(... country_data), Math.max(... country_data)]);

  // Make xAxis
  var xAxis = d3v5.axisBottom()
              .ticks(10)
              .scale(xScale);

  // Make yAxis
  var yAxis = d3v5.axisLeft()
              .ticks(10)
              .scale(yScale);

  // Determine points
   var country_line = d3v5.line()
     .x(function(d) { return xScale(parseTime(d.Year));
     })
     .y(function(d) { return yScale(d["GDP"]);
     })

   var svg = d3.selectAll("#lineplot");

   // Make the changes to the line
   svg.select(".line")
      .transition()
      .duration(750)
      .attr("d", country_line(country_data));

  // Make sure data fits
  var bisectDate = d3.bisector(function(d) { return d; }).left;

  // var mouseG = svg.append("g")
  //     .attr("class", "mouse-over-effects");
  //
  //   mouseG.append("path") // this is the black vertical line to follow mouse
  //     .attr("class", "mouse-line")
  //     .style("stroke", "black")
  //     .style("stroke-width", "1px")
  //     .style("opacity", "0");
  //
  //   var lines = document.getElementsByClassName('line');
  //
  //   var mousePerLine = mouseG.selectAll('.mouse-per-line')
  //     .data(cities)
  //     .enter()
  //     .append("g")
  //     .attr("class", "mouse-per-line");
  //
  //   mousePerLine.append("circle")
  //     .attr("r", 7)
  //     .style("stroke", black)
  //     .style("fill", "none")
  //     .style("stroke-width", "1px")
  //     .style("opacity", "0");
  //
  //   mousePerLine.append("text")
  //     .attr("transform", "translate(10,3)");
  //
  //   mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
  //     .attr('width', width) // can't catch mouse events on a g element
  //     .attr('height', height)
  //     .attr('fill', 'none')
  //     .attr('pointer-events', 'all')
  //     .on('mouseout', function() { // on mouse out hide line, circles and text
  //       d3.select(".mouse-line")
  //         .style("opacity", "0");
  //       d3.selectAll(".mouse-per-line circle")
  //         .style("opacity", "0");
  //       d3.selectAll(".mouse-per-line text")
  //         .style("opacity", "0");
  //     })
  //     .on('mouseover', function() { // on mouse in show line, circles and text
  //       d3.select(".mouse-line")
  //         .style("opacity", "1");
  //       d3.selectAll(".mouse-per-line circle")
  //         .style("opacity", "1");
  //       d3.selectAll(".mouse-per-line text")
  //         .style("opacity", "1");
  //     })
  //     .on('mousemove', function() { // mouse moving over canvas
  //       var mouse = d3.mouse(this);
  //       d3.select(".mouse-line")
  //         .attr("d", function() {
  //           var d = "M" + mouse[0] + "," + height;
  //           d += " " + mouse[0] + "," + 0;
  //           return d;
  //         });
  //
  //       d3.selectAll(".mouse-per-line")
  //         .attr("transform", function(d, i) {
  //           console.log(width / mouse[0])
  //           var xDate = x.invert(mouse[0]),
  //               bisect = d3.bisector(function(d) { return d.date; }).right;
  //               idx = bisect(d.values, xDate);
  //
  //           var beginning = 0,
  //               end = lines[i].getTotalLength(),
  //               target = null;
  //
  //           while (true){
  //             target = Math.floor((beginning + end) / 2);
  //             pos = lines[i].getPointAtLength(target);
  //             if ((target === end || target === beginning) && pos.x !== mouse[0]) {
  //                 break;
  //             }
  //             if (pos.x > mouse[0])      end = target;
  //             else if (pos.x < mouse[0]) beginning = target;
  //             else break; //position found
  //           }
  //
  //           d3.select(this).select('text')
  //             .text(y.invert(pos.y).toFixed(2));
  //
  //           return "translate(" + mouse[0] + "," + pos.y +")";
  //         });
  //     });
  });
  }

function transformresponse(data) {
    var data_list = []
    for (let i = 0; i < data[0].data.length; i++){
        data_list.push(data[0].data[i])
      }
    return data_list;
  };
