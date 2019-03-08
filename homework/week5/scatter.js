// Rinus van Grunsven
// 10755373

// var life_expectancy = "https://stats.oecd.org/index.aspx?r=467292&erroCode=403&lastaction=login_submit#"
// var min_wage = "https://stats.oecd.org/index.aspx?r=467292&erroCode=403&lastaction=login_submit#"

var le = "https://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+CAN+CHL+COL+CZE+EST+FRA+DEU+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+TUR+GBR+USA+CRI+BRA+RUS.EXR+PPP.H+A/all?startTime=2000&endTime=2017&dimensionAtObservation=allDimensions"
var rmw = "https://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+CAN+CHL+COL+CZE+EST+FRA+DEU+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+TUR+GBR+USA+CRI+BRA+RUS.EXR+PPP.H+A/all?startTime=2000&endTime=2017&dimensionAtObservation=allDimensions"

var requests = [d3.json(le), d3.json(rmw)];

Promise.all(requests).then(function(response) {
    doFunction(response);
}).catch(function(e){
    throw(e);
});

console.log(requests);
