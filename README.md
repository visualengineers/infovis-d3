# infovis-d3

Example project for working with D3 and Node.

## Data Source

The data has been discovered on [Our-World-In-Data](https://ourworldindata.org), specifically the [Hunger-And-Undernourishment](https://ourworldindata.org/hunger-and-undernourishment). report. The data source is from the [Food and Agriculture Organization of the United Nations (FAO)](http://www.fao.org/faostat/en/#data/FS).

The data has been prepared as follows:

* Two data exports for each of the regions
    * Northern America and Europe > (List)
    * Africa > (List)
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
* In both exports, a column "Continent" has been added with the respective region
* Superfluous columns and redundancies have been removed (Element, Element Code, Domain Code,Domain)
* The 3-year-average entries have been replaced by the mean, in order to unify all entries in one year, e.g. 20012003 --> 2002
* The column "Year Code" has been subsequently removed
* The CSV files have been converted with an [online tool](https://csv.keyangxiang.com)
* The seperate files have been merged to one JSON data file

Within the example project, a hierarchical data preparation has been implemented, resulting in the following structure of the data:

```JSON
[
 {
  "Continent": "Europe",
  "Countries": [
   {
    "Area": "Albania",  
    "Years": [
     {
      "Year": "2000",
      "Properties": [
        ​​​​{
        ​​​​ "Area Code": "3"
​​​​​​​​         ​​​​"Item": "Average protein supply (g/cap/day) (3-year average)"
​​​​​​​​         ​​​​"Item Code": "21013"
​​​​​​​​         ​​​​"Unit": "g/capita/day"
​​​​​​​​         ​​​​"Value": "77"
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