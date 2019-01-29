/**
 * DataProvider module
 */
var DataProvider = function () {
    var _data;
    var _preparedData;
    var _fileName = 'data/FAOSTAT_data.json';

    /**
     * Make data hierarchical.
     * @param {Object} flatData - The flat data structure.
     * @param {string} key - The key which is used for the hierarchical transformation.
     * @param {string} value - The name of the collection property under which children are stored.
     * @return {Object} The hierarchically prepared data.
     */
    function _groupData(flatData, key, value) {
        var result = [];
        var hierarchy = {};

        flatData.forEach(function (node) {
            hierarchy[node[key]] = node;
        });

        Object.keys(hierarchy).forEach(function (root) {
            var parent = {};
            parent[key] = root;
            parent[value] = [];
            flatData.forEach(function (node) {
                if (node[key] === root) {
                    parent[value].push(node);
                    delete node[key];
                }
            });
            result.push(parent);
        });

        return result;
    }

    /**
     * Prepare hierarchical data structure with Regions, Areas, and Years.
     * @return {Object} The hierarchically prepared data.
     */
    function _prepareData(originalData) {
        var i=-1;
        var groupRegions = _groupData(originalData, 'Region', 'Countries');
        groupRegions.forEach(function (region) {
            var groupedCountries = _groupData(region.Countries, 'Area', 'Years');
            region.Countries = groupedCountries;
            i++;
            region.Index = i;
            var j=-1;
            groupedCountries.forEach(function (country) {
                j++;
                var groupedYears = _groupData(country.Years, 'Year', 'Properties');
                country.Years = groupedYears;
                country.Index = j;
            });
        });
        return groupRegions;
    }

    return {
        getData: function () {
            return _data;
        },
        getPreparedData: function () {
            return _preparedData;
        },
        /**
         * Load data.
         * @param {requestCallback} callback - The callback that handles the response.
         */
        loadJSON: function (callback) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', _fileName, true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                    // Parse JSON string into object
                    _data = JSON.parse(xobj.response);
                    _preparedData = _prepareData(JSON.parse(xobj.response));
                    callback(xobj.responseText);
                }
            };
            xobj.send(null);
        },
        /**
         * Get a value from the data.
         * @param {string} country - The country in the data.
         * @param {number} year - The year of the parameter.
         * @param {number} code - The numerical code of the parameter (see data source documentation).
         * @return {number} The desired value in the data.
        */
        getValue: function (country, year, code) {
            var getValueResult;
            _data.some(function (item) {
                if (item['Area'] === country && item['Year'] === year && item['Item Code'] === code) {
                    getValueResult = item['Value'];
                    return true;
                }
            });
            return getValueResult;
        },
        /**
         * Retrieve maximum value for a given parameter.
         * @param {number} code - The numerical code of the parameter (see data source documentation).
         * @return {Object} Result containing value, year, and country.
         */
        getMaxValue: function (code) {
            var resultMax = 0;
            var country = 'unknown';
            var year = 'unknown';
            _data.forEach(function (item) {
                var currentValue = Number.parseFloat(item['Value']);
                if (item['Item Code'] === code && resultMax < currentValue) {
                    resultMax = currentValue;
                    country = item['Area'];
                    year = item['Year'];
                }
            });
            return {
                "Value": resultMax,
                "Year": year,
                "Country": country
            };
        },
        /**
         * Computes the average for a region of a specific parameter of a given year
         * @param {string} region - The region in the data.
         * @param {number} year - The year of the parameter.
         * @param {number} code - The numerical code of the parameter (see data source documentation).
         * @return {number} The average value.
         */
        getAverageForRegion: function (region, year, code) {
            var sumAverage = 0;
            var countAverage = 0;
            _data.forEach(function (item) {
                if (item['Region'] === region && item['Year'] === year && item['Item Code'] === code && item['Value'] !== undefined) {
                    sumAverage += Number.parseFloat(item['Value']);
                    countAverage++;
                }
            });
            return sumAverage / countAverage;
        },
        /**
         * Stellt alle Daten einer Region und eines Parameters zur Anwendung für einen Zeitstrahl zusammen
         * @param country
         * @param code
         * @returns {{minValue: number, minYear: number, maxYear: number, maxValue: number, actualData: Array}}
         */
        getDataForTimeline: function (country, code,callback) {

            let data = _data;
            let minYear = 0;
            let maxYear = 0;
            let minValue = 0;
            let maxValue = 0;
            let avgValue = 0;
            let actualData = [];

            let index = 0;
            let value;
            let sumValue = 0;

            for (var year=2000; year<2019; year++){
                _data.some(function (item) {
                    if (item['Area'] === country && item['Year'] === (year.toString()) && item['Item Code'] === code) {

                        value = item['Value'];

                        if (!isNaN(parseFloat(value))) {
                            sumValue += parseFloat(value);

                            if (minYear === 0) {minYear = year; maxYear = year;}
                            if (year > maxYear) {maxYear = year;}

                            if (minValue === 0) {minValue = value; maxValue = value;}
                            if (value < minValue) {minValue = value;}
                            if (value > maxValue) {maxValue = value;}

                            actualData[index] = {year: year, value: value};
                            index++;
                        }
                    }
                });
            }

            if (index!==0) {avgValue = sumValue / index;}

            let dataForTimeline = {
                minYear: minYear,
                maxYear: maxYear,
                minValue: minValue,
                maxValue: maxValue,
                avgValue: avgValue,
                actualData: actualData
            };

            callback(dataForTimeline);
        },
        /**
         * Prepare hierarchical data structure with Regions, Areas.
         * @returns {Array}
         */
        getDataForCountrySelection : function (callback) {
        let i=-1;
        let data = JSON.parse(JSON.stringify(_data));
        let groupRegions = _groupData(data, 'Region', 'Countries');
        groupRegions.forEach(function (region) {
            let groupedCountries = _groupData(region.Countries, 'Area', 'Years');
            region.Countries = groupedCountries;
            i++;
            region.Index = i;
            let j=-1;
            groupedCountries.forEach(function (country) {
                j++;
                country.Index = j;
                delete country.Years;
            });
        });
        callback(groupRegions);
        },
        /**
         * Returns the values for a single year and country via Callback
         * @param country
         * @param vear
         * @param callback
         */
        getDataForCountryAndYear(country,year,callback){
            let GrossDomesticProductPerCapita;
            let AverageProteinSupply;
            let PrevalenceOfObesityInTheAdultPop;
            let PrevalenceOfUndernourishment;

            _data.some(function (item) {
                if (item['Area'] === country && item['Year'] === (year.toString()) && item['Item Code'] === '22013') {
                    GrossDomesticProductPerCapita = item['Value'];
                }
                if (item['Area'] === country && item['Year'] === (year.toString()) && item['Item Code'] === '21013') {
                    AverageProteinSupply = item['Value'];
                }
                if (item['Area'] === country && item['Year'] === (year.toString()) && item['Item Code'] === '21042') {
                    PrevalenceOfObesityInTheAdultPop = item['Value'];
                }
                if (item['Area'] === country && item['Year'] === (year.toString()) && item['Item Code'] === '210041') {
                    PrevalenceOfUndernourishment = item['Value'];
                }
            });

            if (isNaN(GrossDomesticProductPerCapita) || GrossDomesticProductPerCapita === '') {GrossDomesticProductPerCapita='999999';}
            if (isNaN(AverageProteinSupply) || AverageProteinSupply === '') {AverageProteinSupply='999999';}
            if (isNaN(PrevalenceOfObesityInTheAdultPop) || PrevalenceOfObesityInTheAdultPop === '') {PrevalenceOfObesityInTheAdultPop='2.5';}
            if (isNaN(PrevalenceOfUndernourishment) || PrevalenceOfUndernourishment === '') {PrevalenceOfUndernourishment='2.5';}

            let singleData = {
                GrossDomesticProductPerCapita: GrossDomesticProductPerCapita,
                AverageProteinSupply: AverageProteinSupply,
                PrevalenceOfObesityInTheAdultPop: PrevalenceOfObesityInTheAdultPop,
                PrevalenceOfUndernourishment: PrevalenceOfUndernourishment
            };
            callback(singleData);
        }
    }
}();
