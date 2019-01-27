
/**
 * Visualization module
 */
var Visualization = function () {
    var _greeting;

    // return {
    //     /**
    //      * Create the visualisation. This is the main application entry point.
    //      */
    //     draw: function () {
    //         var _greeting = '<pre>There are ' + DataProvider.getPreparedData().length + ' regions. ';
    //         DataProvider.getPreparedData().forEach(function (region) {
    //             _greeting += region.Region + ' has ' + region.Countries.length + ' countries.\n';
    //         });
    //         _greeting += 'By the way, Germany had ' + DataProvider.getValue('Germany', '2016', '21042') + ' percent of obese people in 2016.\n\n'
    //         _greeting += 'Northern Africa had an average index of ' + DataProvider.getAverageForRegion('Northern Africa', '2016', '21032') + ' for political stability in 2015,\n';
    //         _greeting += 'while Western Europe had ' + DataProvider.getAverageForRegion('Western Europe', '2016', '21032') + '. ';
    //         var bestIndex = DataProvider.getMaxValue('21032');
    //         _greeting += 'The best index was ' + bestIndex.Value + ' in ' + bestIndex.Country + ' in the year ' + bestIndex.Year + '.';
    //         _greeting += '</pre>';
    //         document.body.innerHTML = _greeting;
    //     }
    // }

    return {
        /**
         * Create the visualisation. This is the main application entry point.
         */

        draw: function () {
            d3.json("data/geodata.json", function (error, data) {

                var dataTime = d3.range(0, 19).map(function (d) {
                    return new Date(2000 + d, 10);
                });
                var year = "2003";
                var min = d3.min(dataTime);
                var max = d3.max(dataTime);


                //svg - scaleable vector graphics
                var svg = d3.select('svg');

                var width = window.innerWidth;
                var height = window.innerHeight;
                console.log("Width: " + width + ", Height: " + height);

                var projection = d3.geoNaturalEarth1()
                    .scale(180)
                    .translate([(width / 2) - 150, (height / 2)]);

                // pathgenerator
                var path = d3.geoPath()
                    .projection(projection); // translate coordinates to pixels

                // Einfärben Kontinente
                function paintMapRegions(code, value, year) {
                    var myScale = d3.scaleLinear()
                        .domain([DataProvider.getMinValueYear(code, year).Value, 0, DataProvider.getMaxValueYear(code, year).Value])
                        .range(['red', 'yellow', 'green']);
                    var ColorCode = myScale(value);
                    if (ColorCode == ("rgb(0, 0, 0)") || year == "2001") {
                        return "rgb(150, 150, 150)";
                    }
                    console.log("Looking up: " + value + " results in " + ColorCode);
                    return ColorCode;
                }
                // Ende Einfärben Kontinente

                // SLIDER
                var sliderTime = d3
                    .sliderBottom()
                    .min(min)
                    .max(max)
                    .step(1000 * 60 * 60 * 24 * 365)
                    .width(800)
                    .tickFormat(d3.timeFormat('%Y'))
                    .tickValues(dataTime)
                    .default(new Date(year, 10, 3))
                    .on("end", val => {
                        year = d3.timeFormat('%Y')(val);
                        //console.log("Year selected: " + year);


                        // Map repaint mit Slider
                        svg.selectAll('path')
                            .attr('fill', function (d, i) {
                                return paintMapRegions('21032', DataProvider.getAverageForRegion(d.properties.subregion, year, "21032"), year);
                            });
                    });

                // Slider zeichnen
                var gTime = d3
                    .select('div#slider')
                    .append('svg')
                    .append('g')
                    .attr('transform', 'translate(' + (width - 600) / 5 + ',15)')
                    .call(sliderTime);

                // ENDE SLIDER

                // Hintergrund
                svg.append('rect')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('fill', '#000102');

                // Map Initial
                svg.selectAll('path')
                    .data(data.features)
                    .enter()
                    .append('path')
                    .attr('d', function (d) {
                        return path(d)
                    })
                    .attr('data-country', function (d) {
                        return d.properties.name;
                    })
                    .attr('fill', function (d, i) {
                        return paintMapRegions('21032', DataProvider.getAverageForRegion(d.properties.subregion, year, "21032"), year);
                    })
                    .on('mouseover', function (d) {
                        var name = d.properties.continent;
                        return document.getElementById('name').innerHTML = name;
                    });


                /* Testzweck (Map erhält Text)
                
                .append("text")
                .text(function (d) { return d.properties.name; })
                .attr("x", function(d){
                    return path.centroid(d)[0];
                })
                .attr("y", function(d){
                    return  path.centroid(d)[1];
                })
                .attr("text-anchor","middle")
                .attr('font-size','6pt');

                */

            })

        }
    }
}(); 
