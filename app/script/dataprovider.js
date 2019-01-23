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
        var groupRegions = _groupData(originalData, 'Region', 'Countries');
        groupRegions.forEach(function (region) {
            var groupedCountries = _groupData(region.Countries, 'Area', 'Years');
            region.Countries = groupedCountries;
            groupedCountries.forEach(function (country) {
                var groupedYears = _groupData(country.Years, 'Year', 'Properties');
                country.Years = groupedYears;
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
         * Get a value from the data.
         * @param {string} country - The country in the data in iso_a3 form.
         * @param {number} year - The year of the parameter.
         * @param {number} code - The numerical code of the parameter (see data source documentation).
         * @return {number} The desired value in the data.
        */
        getValuebyiso: function(country, year, code) {
            var getValueResult;

            if (code == 210041) {
                var yearInt = parseInt(year,10);
                year = year + "-" + (yearInt+2);
            }

            _data.some(function (item) {
                if (item['iso_a3'] === country && item['Year'] === year && item['Item Code'] === code) {
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
         * Retrieve minimum value for a given parameter.
         * @param {number} code - The numerical code of the parameter (see data source documentation).
         * @return {Object} Result containing value, year, and country.
         */
        getMinValue: function (code) {
            var resultMin = 0;
            var country = 'unknown';
            var year = 'unknown';
            _data.forEach(function (item) {
                var currentValue = Number.parseFloat(item['Value']);
                if (item['Item Code'] === code && currentValue < resultMin) {
                    resultMin = currentValue;
                    country = item['Area'];
                    year = item['Year'];
                }
            });
            return {
                "Value": resultMin,
                "Year": year,
                "Country": country
            };
        },
        /**
         * Retrieve maximum value for a given parameter.
         * @param {number} code - The numerical code of the parameter (see data source documentation).
         * @param {number} yearLookUp - The year of the parameter.
         * @return {Object} Result containing value, year, and country.
         */
        getMaxValueYear: function (code, yearLookUp) {
            var resultMax = 0;
            var country = 'unknown';
            var year = 'unknown';
            _data.forEach(function (item) {
                var currentValue = Number.parseFloat(item['Value']);
                if (item['Item Code'] === code && item['Year'] === yearLookUp && resultMax < currentValue) {
                    resultMax = currentValue;
                    country = item['Area'];
                    year = item['Year'];
                }
            });
            //console.log("MAX VALUE "+resultMax);
            return {
                "Value": resultMax,
                "Year": year,
                "Country": country
            };
        },
        /**
         * Retrieve minimum value for a given parameter.
         * @param {number} code - The numerical code of the parameter (see data source documentation).
         * @param {number} yearLookUp - The year of the parameter.
         * @return {Object} Result containing value, year, and country.
         */
        getMinValueYear: function (code, yearLookUp) {
            var resultMin = 100000;
            var country = 'unknown';
            var year = 'unknown';
            _data.forEach(function (item) {
                var currentValue = Number.parseFloat(item['Value']);
                if (item['Item Code'] === code && item['Year'] === yearLookUp &&  currentValue < resultMin) {
                    resultMin = currentValue;
                    country = item['Area'];
                    year = item['Year'];
                }
            });
            //console.log("MIN VALUE "+resultMin);
            return {
                "Value": resultMin,
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
                if (item['subregion'] === region && item['Year'] === year && item['Item Code'] === code && item['Value'] !== undefined) {
                    sumAverage += Number.parseFloat(item['Value']);
                    countAverage++;
                }
            });
            return sumAverage / countAverage;
        },
        /**
         * Computes the average for a continent of a specific parameter of a given year
         * @param {string} continent - The continent in the data.
         * @param {number} year - The year of the parameter.
         * @param {number} code - The numerical code of the parameter (see data source documentation).
         * @return {number} The average value.
         */
        getAverageForContinent: function (continent, year, code) {
            var sumAverage = 0;
            var countAverage = 0;
            console.log(continent);
            _data.forEach(function (item) {
                if (item['continent'] === continent && item['Year'] === year && item['Item Code'] === code && item['Value'] !== undefined) {
                    sumAverage += Number.parseFloat(item['Value']);
                    countAverage++;
                }
            });
            return sumAverage / countAverage;
        }
    }
}();
