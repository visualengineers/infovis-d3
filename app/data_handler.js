/**
 *
 * @param {*} url to the json
 * @returns loaded json
 */
function loadJson(url) {
  let json = null;
  let REQUEST_GET = {
    url: null,
    type: "GET",
    contentType: "application/json",
    dataType: "json",
    async: false,
    success: result => {
      json = result;
    },
    error: function() {},
    timeout: 30000
  };

  REQUEST_GET.url = url;
  $.ajax(REQUEST_GET);
  return json;
}

function formatData(json) {
  let data = {};
  let data2 = {};
  // reads the neccessary data from json
  for (let i = 0; i < json.length; i++) {
    // init the objects
    if (!data[json[i].Year]) {
      data[json[i].Year] = [];
    }
    if (!data[json[i].Year][json[i].Area]) {
      data[json[i].Year][json[i].Area] = {};
    }

    // put the data to objects
    if (json[i].Item.includes("domestic")) {
      data[json[i].Year][json[i].Area]["bip"] = json[i].Value;
    }
    if (json[i].Item.includes("obesity")) {
      data[json[i].Year][json[i].Area]["fat"] = json[i].Value;
    }
    if (json[i].Item.includes("stability")) {
      data[json[i].Year][json[i].Area]["polit"] = json[i].Value;
    }
  }
  // formats the data accordingly
  /*
    {"2000": 
        {
            Germany: {
                bip: ..
            }
        }
    }
    -->
    {
    '2000' : [
    { country : 'Afghanistan', bip : 25, fat : 67, polit : 0.3999999999999999},
    ]}
  */
  const years = Object.keys(data);
  const yearsObjects = Object.values(data);
  for (i = 0; i < years.length; i++) {
    data2[years[i]] = [];
    const countries = Object.keys(yearsObjects[i]);
    const countriesObjects = Object.values(yearsObjects[i]);
    for (let j = 0; j < countries.length; j++) {
      data2[years[i]].push({
        country: countries[j],
        bip: parseFloat(countriesObjects[j]["bip"]),
        fat: parseFloat(countriesObjects[j]["fat"]),
        polit: parseFloat(countriesObjects[j]["polit"])
      });
    }
  }

  return data2;
}

function loadData() {
  const json = loadJson("data/FAOSTAT_data.json");
  return formatData(json);
}
