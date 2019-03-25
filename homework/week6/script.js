var requests = [d3v5.json("DP_LIVE_GDP.json")];

window.onload = function() {
  Promise.all(requests).then(function(response) {
    var req = response
    console.log(req)
    // console.log(req[0].data)
    // req0 = req[0].data
    // console.log(req0)
    // req0_dict = {}
    // req0.forEach(function(element) {
    //   req0_dict.push(req[0].data[2][2])
    // console.log(element);
    // });
    // console.log(req[0].data[2][2])

    // foreach()
    // console.log(req["Value"])
    // console.log(req.columns[0].data)
    // console.log(alert(req.data[2])
    // console.log(Object.values(obj))
    // console.log(response.data[i][2])
    // console.log(response[1].data[2][2])

    let draw = world(req)

})};

function world(data) {

  console.log(data)

  var data_cleaned = transformresponse(data)
    console.log(data_cleaned)
  // var dict_2016 = id_value(data)
  // console.log(dict_2016)

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
// var dict2_2016 = {}
// var temp_dict = {}
// for (let i = 0; i < data_cleaned.length; i++){
//   if (data_cleaned[i][1] == "2016") {
//     temp_dict["Year"] = 2016
//     temp_dict["fillKey"] = data_cleaned[i][2]
//   }
//   dict_2016["data_cleaned[i][0]""] = data_cleaned[i][2]
// };
// console.log(dict_2016)

// "#afafaf", "#123456", "blue", "rgb(0,0,0)"

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
//
// var colors_2016 = {}
// for (let i = 0; i < data_cleaned.length; i++){
//   if (data_cleaned[i][1] == "2016") {
//     let col_dict = {}
//     let color = "rgb(0 "+ colorscale(data_cleaned[i][2]) +", 0)"
//     col_dict["fillKey"] = color
//     colors_2016["data_cleaned[i][0]"] = col_dict;
//   }
// };

console.log(dict_2016);

// for (let i = 0; i < data_cleaned.length; i++) {
//   if (data_cleaned[i][1] == "2016") {
//     var colorscaled = {}
//     colorscaled["fillKey"] = "rgb(0 "+ colorscale(data_cleaned[i][2]) +", 0)";
//   }
//   country_color["data_cleaned[i][0]"] = "colorscaled";
// }

console.log(saved_dict);

var map = new Datamap({
    element: document.getElementById('container'),
    // responsive: true,
    fills: {
        // defaultFill: "#ABDDA4",
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
    }
    // d3v5.select(window).on('click', function() {
    //     linegraph(country, data);
    // })

    // setProjection: setProjection,
    // dataType: 'json'
    // dataUrl: 'DP_LIVE_2016.json',
    // data: ,
  });

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

  let draw = graph(data);
};

function graph(data) {

  var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = 900 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

  // create svg canvas
  var svg = d3v5.select("body")
            .append("svg")
            .attr("id", "lineplot")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

  var parseYear = d3v5.timeParse("%Y")
  var years = []
  for (let i = 1960; i < 2017; i++) {
      // u = parseTime(i)
      years.push(i);
      }

  var xScale = d3v5.scaleTime()
                  .range([0, width])
                  .domain([Math.min(... years), Math.max(... years)]);

  var yScale = d3v5.scaleLinear()
                .range([height, 0])
                .domain(0, 5000000000);

  var xAxis = d3v5.axisBottom()
              .ticks(10)
              .scale(xScale);

  var yAxis = d3v5.axisLeft()
              .ticks(10)
              .scale(yScale);

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
      .attr("transform", "translate(" + (width/2) + " ," +
                         (height + margin.top) + ")")
      .style("text-anchor", "middle")
      .text("Year")
      .style("font-size", "15px");

  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", - height/2)
     .attr("y", margin.left / 2)
     .style("text-anchor", "middle")
     .text("Average GDP per capita")
     .style("font-size", "15px");

};

function linegraph(country, data) {

  var data_cleaned = transformresponse(data)

  var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = 900 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

  var svg = d3.select("body")
            .append("svg")
            .attr("id", "lineplot")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

  var country_data = []
  for (let i = 0; i < data_cleaned.length; i++) {
    if (data_cleaned[i][0] == country) {
      country_data.push({"Year": data_cleaned[i][1], "GDP": data_cleaned[i][2]});
    }
  }

  var parseYear = d3v5.timeParse("%Y")
  var years = []
  for (let i = 0; i < country_data.length; i++) {
      country_data[i][0]
      u = parseTime(i)
      years.push(u);
      }

  var data_cleaned = []
  for (i = 0; i < data_cleaned.length; i++) {
    data_cleaned.push(data_cleaned[i][2]);
    }

  var xScale = d3v5.scaleTime()
                  .range([0, width])
                  .domain([Math.min(... parseYear), Math.max(... parseYear)]);

  var yScale = d3v5.scaleLinear()
                .range([height, 0])
                .domain([Math.min(... data_cleaned), Math.max(... data_cleaned)]);

  var xAxis = d3v5.axisBottom()
              .ticks(10)
              .scale(xScale);

  var yAxis = d3v5.axisLeft()
              .ticks(10)
              .scale(yScale);

  svg.append("g")
     .attr("class", "yAxis")
     .attr("transform", "translate(" + margin.left + ",0)")
     .call(yAxis)
     .style("font-size", "10px");

  svg.append("g")
     .attr("class", "xAxis")
     .attr("transform", "translate(" + margin.left + "," + h + ")")
     .call(xAxis)
     .style("font-size", "10px");

  svg.append("text")
      .attr("transform", "translate(" + (width/2) + " ," +
                         (height + margin.top) + ")")
      .style("text-anchor", "middle")
      .text("Year")
      .style("font-size", "15px");

  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", - height/2)
     .attr("y", margin.left / 2)
     .style("text-anchor", "middle")
     .text("Average GDP per capita")
     .style("font-size", "15px");

   var line = d3.svg.line()
     .interpolate("basis")
     .x(function(d) {
       return xScale(parseTime(d.Year));
     })
     .y(function(d) {
       return yScale(d["GDP"]);
     })

    var bisectDate = d3.bisector(function(d) { return d; }).left;

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
