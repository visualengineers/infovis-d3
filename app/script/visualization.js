/**
 * Visualization module
 */
var Visualization = function () {
    var _greeting;

    return {
        /**
         * Create the visualisation. This is the main application entry point.
         */
        draw: function () {
            var _greeting = '<pre>There are ' + DataProvider.getPreparedData().length + ' regions. ';
            DataProvider.getPreparedData().forEach(function (region) {
                _greeting += region.Region + ' has ' + region.Countries.length + ' countries.\n';
            });
            _greeting += 'By the way, Germany had ' + DataProvider.getValue('Germany', '2016', '21042') + ' percent of obese people in 2016.\n\n'
            _greeting += 'Northern Africa had an average index of ' + DataProvider.getAverageForRegion('Northern Africa', '2016', '21032') + ' for political stability in 2015,\n';
            _greeting += 'while Western Europe had ' + DataProvider.getAverageForRegion('Western Europe', '2016', '21032') + '. ';
            var bestIndex = DataProvider.getMaxValue('21032');
            _greeting += 'The best index was ' + bestIndex.Value + ' in ' + bestIndex.Country + ' in the year ' + bestIndex.Year + '.';
            _greeting += '</pre>';
            document.body.innerHTML = _greeting;
        }
    }
}(); 
