var requests = [d3v5.json("DP_LIVE_17032019174948957.json")];

window.onload = function() {
  Promise.all(requests).then(function(response) {
    var req = response
    console.log(req)
    console.log(req[0].data)
    // foreach()
    // console.log(req["Value"])
    // console.log(req.columns[0].data)
    // console.log(alert(req.data[2])
    // console.log(Object.values(obj))
    // console.log(response.data[i][2])
    // console.log(response[1].data[2][2])
    let draw = world(req)
    var map = new Datamap({element: document.getElementById('world')});

  })
}

function world(data) {

  var gdp = data
    console.log(gdp)
    // console.log(gdp[1].data)
    // console.log(gdp[1].data[2])

  var margin = {top: 70, right: 100, bottom: 20, left: 50},
        height = 800 - margin.bottom - margin.top,
        width = 1300 - margin.left - margin.right;

  var svg = d3v5.select("body")
              .append("svg")
              .attr("id", "map")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("class", "map");

  var legend = svg.append("rect")
               .attr("class", "legend")
               .attr("width", margin.right)
               .attr("height", margin.top * 8)
               .attr("x", width + margin.left)
               .attr("y", 0);

  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([0,0])
              .html(function(d) {
                for (var i = 0; i < gdp[0].data.length; i++) {
                  if (d.id == gdp[1].data[0]){
                    return "<strong>Country: </strong><span class='details'>" + geo.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" + format(gdp[0].data[2]) +"</span>";
                  }
                }
              });

  var projection = d3v5.geoMercator()
                      .scale(100)
                      .translate([width / 2, height / 1.5]);

  var path = d3v5.geoPath().projection(projection);

  var gdp_countries = [];
  for (let i = 0; i < gdp[0].data.length; i++){
    gdp_countries.push(gdp[0].data[2]);
  }
  console.log(gdp_countries)

  var xScale = d3v5.scaleLinear()
            .domain([Math.min(... gdp_countries) - 5, Math.max(... gdp_countries)])
            .range([20, width]);

  var colorscale = d3v5.scaleThreshold()
              .domain([Math.min(... gdp_countries) - 5, Math.max(... gdp_countries)])
              .range([0, 280]);

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
  	.style('fill', 'darkOrange')
    .text("Worldmap: GDP per capita");

  svg.append("g")
        .attr("class", "countries")
      .selectAll("path")
        .data(features.properties.name)
      .enter().append("path")
        .attr("d", path)
        .style('stroke', 'white')
        .style('stroke-width', 1.1)
        .attr("transform", "translate(0, " + margin.top + ")")
        .style("fill", function(d) {
        return colorscale(gdp[1].data[2][2]);
        })
        .style("opacity", 0.8)

          .style("stroke","white")
          .style('stroke-width', 0.3)
          .on('mouseover',function(d){
            tip.show(d);

            d3v5.select(this)
              .style("opacity", 1)
              .style("stroke","white")
              .style("stroke-width",3);
          })
          .on('mouseout', function(d){
            tip.hide(d);
            d3v5.select(this)
              .style("opacity", 0.8)
              .style("stroke","white")
              .style("stroke-width", 0.3);
          })
        //     .on("click", function(d){
        //       graph(d.id)
        // });

    svg.call(tip);


};
//
// function graph(data) {
//
//   var margin = {top: 20, right: 80, bottom: 30, left: 50},
//         width = 900 - margin.left - margin.right,
//         height = 700 - margin.top - margin.bottom;
//
//       var parseYear = d3.time.format("%Y").parse;
//
//       var x = d3.time.scale()
//         .range([0, width])
//         .domain();
//
//       var y = d3.scaleLinear()
//         .range([height, 0]);
//         .domain();
//
//       var xAxis = d3.axisBottom()
//         .scale(x);
//
//       var yAxis = d3.axisLeft()
//         .scale(y);
//
//       var line = d3.svg.line()
//         .interpolate("basis")
//         .x(function(d) {
//           return x(gdp[1].data[2][1]);
//         })
//         .y(function(d) {
//           return y(gdp[1].data[2][2]);
//         });
//
//       var svg = d3.select("body").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//       var data = d3.tsv.parse(myData);
//
//       data.forEach(function(d) {
//         d.date = parseDate(d.date);
//       });
//

// };

// function transformresponse(data) {
//     var data_list = []
//     for (let i = 0; i < data[1].data.length; i++){
//       // if (data[i][2] == "Value"){
//         data_list.push(data[1].data)
//       // }
//     }
//     return data_list;
//     console.log(data_list)
// };