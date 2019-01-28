/**
 * DataProvider module
 */
let _preparedData;
import _data from "../data/FAOSTAT_data";

export const dataProvider = {
  getData: function() {
    return _data;
  },
  getPreparedData: function() {
    return _preparedData;
  },
  loadJSON,
  getValue,
  getMaxValue,
  getAverageForRegion,
  getValues
};
/**
 * Make data hierarchical.
 * @param {Object} flatData - The flat data structure.
 * @param {string} key - The key which is used for the hierarchical transformation.
 * @param {string} value - The name of the collection property under which children are stored.
 * @return {Object} The hierarchically prepared data.
 */
function _groupData(flatData, key, value) {
  let result = [];
  let hierarchy = {};

  flatData.forEach(function(node) {
    hierarchy[node[key]] = node;
  });

  Object.keys(hierarchy).forEach(function(root) {
    let parent = {};
    parent[key] = root;
    parent[value] = [];
    flatData.forEach(function(node) {
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
  let groupRegions = _groupData(originalData, "Region", "Countries");
  groupRegions.forEach(function(region) {
    let groupedCountries = _groupData(region.Countries, "Area", "Years");
    region.Countries = groupedCountries;
    groupedCountries.forEach(function(country) {
      let groupedYears = _groupData(country.Years, "Year", "Properties");
      country.Years = groupedYears;
    });
  });
  return groupRegions;
}

/**
 * Load data.
 * @param {requestCallback} callback - The callback that handles the response.
 */
function loadJSON(callback) {
  _preparedData = _prepareData(_data);
  callback();
}

/**
 * Get a value from the data.
 * @param {string} country - The country in the data.
 * @param {number} year - The year of the parameter.
 * @param {number} code - The numerical code of the parameter (see data source documentation).
 * @return {number} The desired value in the data.
 */
function getValue(country, year, code) {
  let getValueResult = null;
  _data.some(function(item) {
    if (
      item["Area"] === country &&
      item["Year"] === year &&
      item["Item Code"] === code
    ) {
      getValueResult = item["Value"];
      return true;
    }
  });
  return getValueResult;
}

/**
 * Retrieve maximum value for a given parameter.
 * @param {number} code - The numerical code of the parameter (see data source documentation).
 * @return {Object} Result containing value, year, and country.
 */
function getMaxValue(code) {
  let resultMax = 0;
  let country = "unknown";
  let year = "unknown";
  _data.forEach(function(item) {
    let currentValue = Number.parseFloat(item["Value"]);
    if (item["Item Code"] === code && resultMax < currentValue) {
      resultMax = currentValue;
      country = item["Area"];
      year = item["Year"];
    }
  });
  return {
    value: resultMax,
    year: year,
    country: country
  };
}

/**
 * Computes the average for a region of a specific parameter of a given year
 * @param {string} region - The region in the data.
 * @param {number} year - The year of the parameter.
 * @param {number} code - The numerical code of the parameter (see data source documentation).
 * @return {number} The average value.
 */
function getAverageForRegion(region, year, code) {
  let sumAverage = 0;
  let countAverage = 0;
  _data.forEach(function(item) {
    if (
      item["Region"] === region &&
      item["Year"] === year &&
      item["Item Code"] === code &&
      item["Value"] !== undefined
    ) {
      sumAverage += Number.parseFloat(item["Value"]);
      countAverage++;
    }
  });
  return sumAverage / countAverage;
}

// get values function for returning everything in one array
function getValues() {
  return new Promise(resolve => {
    const filteredData = _data; // maybe filter for the future

    let map = {};
    let regionMap = {};
    let yearMap = {};
    // let data = [];
    let gdpMax = 0;
    let gdpMin = 0;
    let stabilityMax = 0;
    let stabilityMin = 0;
    let obesityMax = 0;
    let obesityMin = 0;

    // create hash map and find min/max
    for (let i = 0; i < filteredData.length; i++) {
      let areaCode = filteredData[i]["Area Code"];
      let year = filteredData[i]["Year"];

      // create object if not defined
      if (typeof map[areaCode] === "undefined") {
        map[areaCode] = {
          area: filteredData[i]["Area"],
          code: areaCode,
          continent: filteredData[i]["Continent"],
          region: filteredData[i]["Region"],
          values: {}
        };
      }
      // build up region map
      if (typeof regionMap[filteredData[i]["Region"]] === "undefined") {
        regionMap[filteredData[i]["Region"]] = filteredData[i]["Region"];
      }
      // build year map
      if (typeof yearMap[year] === "undefined") {
        yearMap[year] = year;
      }

      // GDP values
      if (
        filteredData[i]["Item Code"] === "22013" ||
        filteredData[i]["Item Code"] === "21042" ||
        filteredData[i]["Item Code"] === "21032"
      ) {
        // build up year map for each area
        if (typeof map[areaCode]["values"][year] === "undefined") {
          map[areaCode]["values"][year] = {};
        }

        // parse value
        let value = parseFloat(filteredData[i]["Value"]);
        // check if value is valid, if not it is 0!
        if (isNaN(value)) {
          value = 0;
        }

        // save value according to the item code
        switch (filteredData[i]["Item Code"]) {
          case "22013":
            // gpd values
            map[areaCode]["values"][year]["gdpValue"] = value;

            // find gpd max
            if (value > gdpMax) {
              gdpMax = value;
            }

            // find gdp min
            if (value < gdpMin) {
              gdpMin = value;
            }
            break;
          case "21042":
            // obesity values
            map[areaCode]["values"][year]["obesityValue"] = value;

            // find obesity max
            if (value > obesityMax) {
              obesityMax = value;
            }

            // find obesity min
            if (value < obesityMin) {
              obesityMin = value;
            }
            break;
          case "21032":
            // stability values
            map[areaCode]["values"][year]["stabilityValue"] = value;

            // find stability max
            if (value > stabilityMax) {
              stabilityMax = value;
            }

            // find stability min
            if (value < stabilityMin) {
              stabilityMin = value;
            }
            break;
        }
      }
    }

    // Removes countries with missing properties.
    let data = Object.values(map);
    for (let i = 0; i < data.length; i++) {
      for (let year in yearMap) {
        if (typeof data[i].values[year] === "undefined") {
          continue;
        }
        if (
          typeof data[i].values[year].gdpValue === "undefined" ||
          typeof data[i].values[year].obesityValue === "undefined" ||
          typeof data[i].values[year].stabilityValue === "undefined"
        ) {
          delete data[i].values[year];
        }
      }
    }

    // resolve the promise
    resolve({
      values: data,
      regions: Object.values(regionMap),
      years: Object.values(yearMap),
      gdpMax: gdpMax,
      gdpMin: gdpMin,
      stabilityMax: stabilityMax,
      stabilityMin: stabilityMin,
      obesityMax: obesityMax,
      obesityMin: obesityMin
    });
  });
}
