# infovis-d3

Project for the module "Programmierung von Benutzeroberflächen" at HTW Dresden.

The visualization shows the rate of anemia in relation to the average protein intake and the GDP for selected countries from 2000 to 2012. It clearly shows that countries with a high GDP have high protein intake and low anemia rates, while countries with a lower GDP have higher rates of anemia and lower protein intake.

Authors: Denis Keiling, Leo Lindhorst, Đức Hùng Nguyễn, Oliver von Seydlitz

## Data Source

The data has been discovered on [Our-World-In-Data](https://ourworldindata.org), specifically the [Hunger-And-Undernourishment](https://ourworldindata.org/hunger-and-undernourishment) report. The data source is from the [Food and Agriculture Organization of the United Nations (FAO)](http://www.fao.org/faostat/en/#data/FS).

## Installation
You can install all dependencies by running
```
npm install
```
That requires [npm](https://www.npmjs.com), of course.

## Building
The project can be built by running 
```
npm run build
```

## Development server
You can also run a development server that automatically recompiles when you change a file by running
```
npm run serve
```
The result is served at `http://localhost:8080/`
