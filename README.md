# infovis-d3

Example project for working with D3 and Node.

## Data Source

The data has been discovered on [Our-World-In-Data](https://ourworldindata.org), specifically the [Hunger-And-Undernourishment](https://ourworldindata.org/hunger-and-undernourishment) report. The data source is from the [Food and Agriculture Organization of the United Nations (FAO)](http://www.fao.org/faostat/en/#data/FS).

The data has been prepared as follows:

* Selection of specific items
    * Average protein supply (g/cap/day) (3-year average)
    * Average supply of protein of animal origin (g/cap/day) (3-year average)
    * Gross domestic product per capita
    * Prevalence of undernourishment (percent)
    * Political stability and absence of violence/terrorism (index)
    * Percentage of population using safely managed drinking water services (Percent)
    * Percentage of population using safely managed sanitation services (Percent)
    * Prevalence of obesity in the adult population (18 years and older)
    * Prevalence of anemia among women of reproductive age (15-49 years)
* Selection of all available years
* Select Output Formatting Options
    * Codes
    * Units
    * Null Values
* Data exports for each of the regions (Select ISO3 Coding System)
    * Eastern Africa > (List)
    * Middle Africa > (List)
    * Northern Africa > (List)
    * Southern Africa > (List)
    * Western Afria > (List)
    * Eastern Europe > (List)
    * Northern Europe > (List)
    * Southern Europe > (List)
    * Western Europe > (List)
    * Northern America > (List)
    * Southern America > (List)
* Add in each data export a new column "Continent" with the respective value
* Add in each data export a column "Region" with the respective exported region
* Superfluous columns and redundancies have been removed
    * Element
    * Element Code
    * Domain Code
    * Domain
    * Year Code
* The 3-year-average entries have been replaced by the mean, in order to unify all entries in one year, e.g. 2001-2003 --> 2002
* The CSV files have been converted with an [online tool](https://csv.keyangxiang.com)
* The seperate files have been merged to one JSON data file

Within the example project, a hierarchical data preparation has been implemented, resulting in the following structure of the data:

```JSON
[
 {
  "Region": "Northern America",
  "Countries": [
   {
    "Area": "Bermuda",  
    "Years": [
     {
      "Year": "2000",
      "Properties": [
        ​​​​{
        ​​​​ "Area Code": "BMU",
         "Continent": "America",
​​​​​​​​         ​​​​"Item": "Average protein supply (g/cap/day) (3-year average)",
​​​​​​​​         ​​​​"Item Code": "21013",
​​​​​​​​         ​​​​"Unit": "g/capita/day",
​​​​​​​​         ​​​​"Value": "105"
        ​​​​},
        ​​​​{
         "Item": "Gross domestic product per capita, PPP, dissemination (constant 2011 international $)",
         "Item Code": "22013",
         ...
        },
        ​​​​{
         "Item": "Prevalence of undernourishment (percent) (3-year average)",
         "Item Code": "210041",
         ...
        },
        ​​​​{
         "Item": "Political stability and absence of violence/terrorism (index)",
         "Item Code": "21032",
         ...
        },
        ​​​​{
         "Item": "Percentage of population using safely managed drinking water services (Percent)",
         "Item Code": "21045",
         ...
        },
        ​​​​{
         "Item": "Percentage of population using safely managed sanitation services (Percent)",
         "Item Code": "21046",
         ...
        },
        ​​​​{
         "Item": "Prevalence of obesity in the adult population (18 years and older)",
         "Item Code": "21042",
         ...
        },
        ​​​​{
         "Item": "Prevalence of anemia among women of reproductive age (15-49 years)",
         "Item Code": "21043",
         ...
        }
      ]
     },
     ...
    ]
   },
   ...
  ]  
 },
 ...
]
```

## Map Data

The map data (geodata.json) has been generated using https://geojson-maps.ash.ms/.

The property 'Area Code' from the source data matches the property 'iso_a3' from the map data, thus linking both data sets for visualization purposes.

The structure is:

```JSON
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Belize",
        "iso_a3": "BLZ",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [-89.14308041050332,17.80831899664932],
              [-89.15090938999553,17.95546763760042],
              [-89.02985734735182,18.001511338772488],
              ...
            ]
          ]
        },
        ...
      },
    },
    ...
  ]
}
```
