var requests = [d3.json("package.json"), d3.json("DP_LIVE_17032019174948957.json")];

window.onload = function() {
  Promise.all(requests).then(function(response) {
  let draw = world(response)
  console.log(draw);
  })
};

function world(data){
    var gdp = transformresponse(data_list[])

    # set width, height, padding and margins
    var margin = {top: 70, right: 100, bottom: 20, left: 50}
        var height = 700 - margin.bottom - margin.top,
        var width = 1300 - margin.left - margin.right;

    # create svg canvas
    var svg = d3.select("body")
              .append("svg")
              .attr("id", 1)
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom);

    # Make legend
    var legend = svg.append("rect")
                   .attr("class", "legend")
                   .attr("width", margin.right)
                   .attr("height", margin.top * 8)
                   .attr("x", width + margin.left)
                   .attr("y", 0);

    # Make list with all science values
    var gdp_country = [];
    for (let i = 0; i < gdp.length; i++){
      gdp_country.push(gdp[i][2]);
    }

    # Make scales
    var xScale = d3.scaleLinear()
              .domain([Math.min(... gdp_country) - 5, Math.max(... gdp_country)])
              .range([20, width]);

    # Add title above barchart
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
    	.style('fill', 'darkOrange')
      .text("Worldmap: GDP per capita");

};

function transformresponse(data){
    var data_list = []
    for (var i = 0; i < data.length; i++){
        if(data[i][2] == "Value"){
        data_list.push(data[i])
        }
    }
    return data_list
};




- data inladen van json bestanden;
- worldmap aanroepen;
- transformresponse aanroepen voor gegevens uit 2016;
- maak svg voor worldmap;
- plaats gegevens van 2016 bij landen;
- kleurvariaties maken;
- mousetip-optie maken;
- legenda maken;
- lijngrafiek aanroepen;
- laat data zien voor alle jaren;
- mousetip maken;
- legenda maken;
