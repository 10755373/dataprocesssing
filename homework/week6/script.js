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

  var margin = {top: 70, right: 100, bottom: 20, left: 50},
        height = 900 - margin.bottom - margin.top,
        width = 1300 - margin.left - margin.right;

  var svg = d3v5.select("body")
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

var colorScale = d3v5.scaleOrdinal()
            .domain([Math.min(... values_2016), Math.max(... values_2016)])
            .range(['Leeg','Laag','Semi','Redelijk','Hoog','Uitzonderlijk']);
            // .range(["rgb(5, 10, 172)", "rgb(40, 60, 190)", "rgb(70, 100, 245)", "rgb(90, 120, 245)", "rgb(106, 137, 247)", "rgb(220, 220, 220)"]);

for (var key in dict_2016) {
  let country_color = {}
  country_color["Value"] = parseInt(dict_2016[key])
  country_color["fillKey"] = colorScale(dict_2016[key])
  dict_2016[key] = country_color;
}

console.log(dict_2016);

console.log(saved_dict);

var map = new Datamap({
    element: document.getElementById('container'),
    responsive: true,
    fills: {
        defaultFill: '#f0a0fa',
        Leeg: '#e6f0ff',
        Laag: '#b3d1ff',
        Semi: '#80b3ff',
        Redelijk: '#0066ff',
        Hoog: '#0047b3',
        Uitzonderlijk: '#002966'
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
    // done: function(datamap) {
    // datamap.div.selectAll('.datamaps-subunit').on('click', function (geography) {
    //     // var state_id = geography.id;
    //     // var fillkey_obj = datamap.options.data[state_id] || {fillColor: '#FF1493'};
    //     // var fillkey = fillkey_obj.fillColor;;
    //     // var fillkeys = Object.keys(fills);
    //     // var antikey = fillkeys[Math.abs(fillkeys.indexOf(fillkey) - 1)];
    //     // var new_fills = {
    //     //   [geography.id] : {
    //     //     fillColor: antikey
    //     //   }
    //     // }
    //     // datamap.updateChoropleth(new_fills)
    //     linegraph(geography.id);
    //   });
      // }
    // setProjection: function linegraph(country, data) {
    // var projection = d3.geo.equirectangular()}
    // d3v5.select("body").on('click', function() {
    //     linegraph(country, data);
    // })

    // setProjection: setProjection,
    // dataType: 'json'
    // dataUrl: 'DP_LIVE_2016.json',
    // data: ,
  });

  // Make an empty graph underneath the world map
  graph();

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


  // svg.append("g")
  //       .attr("class", "countries")
  //     .selectAll("path")
  //       .data(geo.properties.name)
  //     .enter().append("path")
  //       .attr("d", path)
  //       .style('stroke', 'white')
  //       .style('stroke-width', 1.1)
  //       .attr("transform", "translate(0, " + margin.top + ")")
  //       .style("fill", function(d) {
  //       return colorscale(gdp[1].data[2][2]);
  //       })
  //       .style("opacity", 0.8)
  //       .style("stroke","white")
  //       .style('stroke-width', 0.3)
          // .on('mouseover',function(d){
          //   tip.show(d);
          //
          //   d3v5.select(this)
          //     .style("opacity", 1)
          //     .style("stroke","white")
          //     .style("stroke-width",3);
          // })
          // .on('mouseout', function(d){
          //   tip.hide(d);
          //   d3v5.select(this)
          //     .style("opacity", 0.8)
          //     .style("stroke","white")
          //     .style("stroke-width", 0.3);
          // })
        //     .on("click", function(d){
        //       graph(d.id)
        // });
  //
  //   var tip = d3.tip()
  //               .attr('class', 'd3-tip')
  //               .offset([0, 0])
  //               .html(function(d) {
  //                 for (var i = 0; i < data_cleaned.length; i++) {
  //                   if (geo.properties.id == data_cleaned[i][0]){
  //                     return "<strong>Country: </strong><span class='details'>" + geo.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" + data_cleaned[i][2] +"</span>";
  //                   }
  //                 }
  //               });
  //
  // svg.call(tip);

};

function graph() {

  d3v5.json("DP_LIVE_GDP.json").then(function(data){

  var graph_data = data.data

  var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

  var svg = d3v5.select("body")
            .append("svg")
            .attr("id", "lineplot")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

  var parseYear = d3v5.timeParse("%Y")
  var years = []
  for (let i = 1960; i < 2016; i++) {
      j = parseYear(i)
      years.push(j);
      }

  var gdps = []
  for (let i = 0; i < graph_data.length; i++) {
      gdps.push(graph_data[i][2]);
  }

  var xScale = d3v5.scaleTime()
                  .range([0, width])
                  .domain([Math.min(... years), Math.max(... years)]);

  var yScale = d3v5.scaleLinear()
                .range([height, 0])
                .domain([Math.min(... gdps), Math.max(... gdps)]);

  var xAxis = d3v5.axisBottom()
              .scale(xScale)
              .ticks(10);

  var yAxis = d3v5.axisLeft()
              .scale(yScale)
              .ticks(10);

  svg.append("g")
     .attr("class", "yAxis")
     .attr("transform", "translate(" + margin.left + ",0)")
     .call(yAxis)
     .style("font-size", "10px");

  svg.append("g")
     .attr("class", "xAxis")
     .attr("transform", "translate(" + margin.left + "," + height + ")")
     .call(xAxis)
     .style("font-size", "10px");

  svg.append("text")
      .attr("transform", "translate(" + (width / 2) + " ," +
                         (height + margin.top + margin.bottom) + ")")
      .style("text-anchor", "middle")
      .text("Year")
      .style("font-size", "15px");

  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", - height / 2)
     .attr("y", margin.left / 2)
     .style("text-anchor", "middle")
     .text("Average GDP per capita")
     .style("font-size", "15px");

 // var temp_line = d3v5.line()
 //   .x(function(d) { return xScale(d3v5.timeParse(d.Year));
 //   })
 //   .y(function(d) { return yScale(d["GDP"]);
 //   })
 //
 // svg.append("path")
 //     .data([gdps])
 //     .attr("class", "line")
 //     .attr("d", temp_line)
 //     .attr("fill", "white")
 //     .style("stroke", "orange")
 //     .style("stroke-width", 4)
 //     .attr("transform", "translate(" + margin.left + ", 0)");
 //   })
}
)};

function linegraph(country) {

  d3v5.json("DP_LIVE_GDP.json").then(function(data){

  var overall_data = data.data

  // var svg = d3.select("body")
  //           .append("svg")
  //           .attr("id", "lineplot")
  //           .attr("width", width + margin.left + margin.right)
  //           .attr("height", height + margin.top + margin.bottom);

  var country_data = []
  for (let i = 0; i < overall_data.length; i++) {
    if (overall_data[i][0] == country) {
      country_data.push(overall_data[i][2]});
    }
  }

  var parseYear = d3v5.timeParse("%Y")
  var years = []
  for (let i = 0; i < overall_data.length; i++) {
      j = parseTime(i)
      years.push(j);
      }

  // var data_cleaned = []
  // for (i = 0; i < data_cleaned.length; i++) {
  //   data_cleaned.push(data_cleaned[i][2]);
  //   }

  var xScale = d3v5.scaleTime()
                  .range([0, width])
                  .domain([Math.min(... years), Math.max(... years)]);

  var yScale = d3v5.scaleLinear()
                .range([height, 0])
                .domain([Math.min(... country_data), Math.max(... country_data)]);

  var xAxis = d3v5.axisBottom()
              .ticks(10)
              .scale(xScale);

  var yAxis = d3v5.axisLeft()
              .ticks(10)
              .scale(yScale);

  // svg.append("g")
  //    .attr("class", "yAxis")
  //    .attr("transform", "translate(" + margin.left + ",0)")
  //    .call(yAxis)
  //    .style("font-size", "10px");
  //
  // svg.append("g")
  //    .attr("class", "xAxis")
  //    .attr("transform", "translate(" + margin.left + "," + h + ")")
  //    .call(xAxis)
  //    .style("font-size", "10px");
  //
  // svg.append("text")
  //     .attr("transform", "translate(" + (width / 2) + " ," +
  //                        (height + margin.top) + ")")
  //     .style("text-anchor", "middle")
  //     .text("Year")
  //     .style("font-size", "15px");
  //
  // svg.append("text")
  //    .attr("transform", "rotate(-90)")
  //    .attr("x", - height / 2)
  //    .attr("y", margin.left / 2)
  //    .style("text-anchor", "middle")
  //    .text("Average GDP per capita")
  //    .style("font-size", "15px");

   var line = d3v5.svg.line()
     .interpolate("basis")
     .x(function(d) { return xScale(parseTime(d.Year));
     })
     .y(function(d) { return yScale(d["GDP"]);
     })

    var bisectDate = d3.bisector(function(d) { return d; }).left;
  });
  }

function transformresponse(data) {
    var data_list = []
    for (let i = 0; i < data[0].data.length; i++){
        data_list.push(data[0].data[i])
      }
    return data_list;
  };

// function id_value(data) {
//   var dict = {}
//   for (let i = 0; i < data[0].data.length; i++) {
//     if (data[0].data[i][1] == "2016")
//     dict[data[0].data[i][0]] = data[0].data[i][2]
//   }
//   return dict
// };
