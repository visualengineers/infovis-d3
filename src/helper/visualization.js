import { dataProvider } from "./dataprovider";
/**
 * Visualization module
 */
export const visualization = {
  draw
};

/**
 * Create the visualisation. This is the main application entry point.
 */
function draw() {
  let _greeting =
    "<pre>There are " + dataProvider.getPreparedData().length + " regions. ";
  dataProvider.getPreparedData().forEach(function(region) {
    _greeting +=
      region.Region + " has " + region.Countries.length + " countries.\n";
  });
  _greeting +=
    "By the way, Germany had " +
    dataProvider.getValue("Germany", "2016", "21042") +
    " percent of obese people in 2016.\n\n";
  _greeting +=
    "Northern Africa had an average index of " +
    dataProvider.getAverageForRegion("Northern Africa", "2016", "21032") +
    " for political stability in 2015,\n";
  _greeting +=
    "while Western Europe had " +
    dataProvider.getAverageForRegion("Western Europe", "2016", "21032") +
    ". ";
  var bestIndex = dataProvider.getMaxValue("21032");
  _greeting +=
    "The best index was " +
    bestIndex.Value +
    " in " +
    bestIndex.Country +
    " in the year " +
    bestIndex.Year +
    ".";
  _greeting += "</pre>";
  document.body.innerHTML = _greeting;
}
