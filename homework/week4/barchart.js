// Rinus van Grunsven
// 10755373

function load() {
 	// get local file
	d3.json("KNMI_20190101.json", function(dataset) {
        console.log(data);

  // Setting up size variables
  var margin = {top:20, right:20, bottom:20, left:20},
      width  = 800 - margin.right - margin.left,
      height = 600 - margin.bottom - margin.top;

  var barPadding = 1;
  var padding = 30;

  // Setting up svg
  var svg = d3.select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      // .attr("viewBox", "0 0 " + width + " " + height);
      .append("g");

  var years = ["2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];

  for (var i = 0; i < dataset.lenght; i++){
    data[i]["Datum"] = years[i];
  };

// Setting up y scale
var yScale = d3.scaleLinear()
    .range([height - margin.top - margin.bottom, 0])
    .domain([0, 40]);

// // Setting up x scale
// var xscale = d3.scale.ordinal()
//     .rangeRoundBands([0, width - margin.right - margin.left], .1);
    // vs .rangeBands() !!!!!

// Adding a function for x-as
var xAxis = d3.scaleBand()
    .domain()
    .orient("bottom");

// Adding a function for y-as
var yAxis = d3.axisLeft()
    .scale(yScale);

svg.append('text')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Hoogste windstoot (in 0.1 m/s)');

svg.append('text')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Jaartal');
})
}
