// Rinus van Grunsven
// 10755373

// var life_expectancy = "https://stats.oecd.org/index.aspx?r=467292&erroCode=403&lastaction=login_submit#"
// var min_wage = "https://stats.oecd.org/index.aspx?r=467292&erroCode=403&lastaction=login_submit#"
//
// var le = "https://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+CAN+CHL+COL+CZE+EST+FRA+DEU+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+TUR+GBR+USA+CRI+BRA+RUS.EXR+PPP.H+A/all?startTime=2000&endTime=2017&dimensionAtObservation=allDimensions"
// var rmw = "https://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+CAN+CHL+COL+CZE+EST+FRA+DEU+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+TUR+GBR+USA+CRI+BRA+RUS.EXR+PPP.H+A/all?startTime=2000&endTime=2017&dimensionAtObservation=allDimensions"
//
// var requests = [d3.json(le), d3.json(rmw)];

var gde = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/G_PPP.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var ppp = "https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var requests = [d3.json(gde), d3.json(ppp)];

window.onload = function() {
  Promise.all(requests).then(function(response) {
      // response.forEach(function(data){
        let refined_data = transformResponse(response);
        // combine the data into one array
        console.log(refined_data)
        year = undefined
        let draw = main(refined_data, year)
        }).catch(function(e){
          console.log(e);
            throw(e);
        });
      };

function main(refined_data, year){
  if ((year == undefined) || (year == "")){
    data = refined_data
  } else {
    data = []
    for (let i = 0; i < refined_data.length; i++){
      if (refined_data[i][0] == year){
        // add data to data thingy
        data.push(refined_data[i])
      }
    }
  }};

function transformResponse(response){
    // set array to add response to
    var dataCollection = []
    response.forEach(function(data){
      // access data property of the response
      let dataHere = data.dataSets[0].series;
      console.log(dataHere)
      // access variables in the response and save length for later
      let series = data.structure.dimensions.series;
      let seriesLength = series.length;
      // console.log(series)


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
                  dataArray.push(tempObj);
              }
          });
      });
      dataCollection.push(dataArray)
    })};
