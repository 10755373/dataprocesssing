// Rinus van Grunsven
// 10755373

// var life_expectancy = "https://stats.oecd.org/index.aspx?r=467292&erroCode=403&lastaction=login_submit#"
// var min_wage = "https://stats.oecd.org/index.aspx?r=467292&erroCode=403&lastaction=login_submit#"

var le = "https://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+CAN+CHL+COL+CZE+EST+FRA+DEU+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+TUR+GBR+USA+CRI+BRA+RUS.EXR+PPP.H+A/all?startTime=2000&endTime=2017&dimensionAtObservation=allDimensions"
var rmw = "https://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+CAN+CHL+COL+CZE+EST+FRA+DEU+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+TUR+GBR+USA+CRI+BRA+RUS.EXR+PPP.H+A/all?startTime=2000&endTime=2017&dimensionAtObservation=allDimensions"

var requests = [d3.json(le), d3.json(rmw)];

window.onload = function() {
  Promise.all(requests).then(function(response) {
      // response.forEach(function(data){
        let refined_data = transformResponse(response);
        // combine the data into one array
        console.log(refined_data)
        year = undefined
        let draw = main(refined_data, year)
  }).catch(function(e){
      throw(e);
  });
};

  // use d3 to make the plot
  // define heigth, width, padding
  var padding = 30;
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

  // create legend block
  var legend = svg.append("rect")
                 .attr("class", "legend")
                 .attr("width", margin.right)
                 .attr("height", margin.top * 3)
                 .attr("x", width + margin.left)
                 .attr("y", 0);
                 // .style("fill", "rgb(0, 255, 0)");


  // making lists of consConf [1] and womenInScience [2]
  var consConf = []
  for (let i = 0; i < data.length; i++){
    consConf.push(data[i][1])
  }
  var womenInScience = []
  for (let i = 0; i < data.length; i++){
    womenInScience.push(data[i][2])
  }
  var yScale = d3.scaleLinear()
                 .domain([Math.min(...consConf) - 5, Math.max(...consConf) + 1])
                 .range([height, padding]);

  var xScale = d3.scaleLinear()
                 .domain([Math.min(...womenInScience) -10, Math.max(...womenInScience)])
                 .range([padding, width]);

  // making the circles one at a time (for later use when different colours have to be used)
  // colours for the circles
  color = ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f', '#b2182b', '#ef8a62', '#762a83', '#4d9221', '#2166ac']

  // making the axyi
     var yAxis = d3.axisLeft()
                   .scale(yScale)
                   .ticks(10)

     var xAxis = d3.axisBottom()
                   .scale(xScale)
                   .ticks(11);

     // add axes
 		 canvas.append("g")
 			.attr("class", "x axis")
 		 	.attr("transform", "translate(0," + height + ")")
 		 	.call(x_axis)
 		 	.append("text")
 		  		.attr("class", "label_x")
 		  		.attr("x", width - margin.left)
 		  		.attr("y", 30)
 		  		.text("Happy Planet Index");

 		 canvas.append("g")
 		 	.attr("class", "y axis")
 		 	.call(y_axis)
 		 	.append("text")
 		  		.attr("class", "label_y")
 		  		.attr("x", -margin.left)
 		  		.attr("y", -5)
 		  		.text("Life Expectancy");

// Add title above barchart
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .style('fill', 'darkOrange')
  .text("Life expectancy and real minimum wage");
});
