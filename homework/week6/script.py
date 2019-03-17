var requests = [d3.json("geoData.json"), d3.json("DP_LIVE_17032019174948957.json")];


window.onload = function() {
  Promise.all(requests).then(function(response) {
    let draw = worldMaker(response)

  })
};
