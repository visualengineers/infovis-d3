
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

                var dataTime = d3.range(0, 17).map(function (d) {
                    return new Date(2000 + d, 10);
                });
                var year = "2005";
                var min = d3.min(dataTime);
                var max = d3.max(dataTime);

                //svg - scaleable vector graphics
                var svg = d3.select('svg');

                var width = window.innerWidth;
                var height = window.innerHeight;
                console.log("Width: " + width + ", Height: " + height);
                var transformString = "translate(" + (-0.7 * width) + "," + (-1.1 * height) + ")scale(2.5)";

                var projection = d3.geoNaturalEarth1()
                    .scale(180)
                    .translate([(width / 2) - 150, (height / 2)]);

                // pathgenerator
                var path = d3.geoPath()
                    .projection(projection); // translate coordinates to pixels

                // Tooltip
                var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

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
                                return paintMapRegions('21032', DataProvider.getAverageForRegion(d.properties.iso_a3, year, "21032"), year);
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

                // Einfärben Kontinente
                function paintMapRegions(code, value, year) {
                    var myScale = d3.scaleLinear()
                        .domain([DataProvider.getMinValueYear(code, year).Value, 0, DataProvider.getMaxValueYear(code, year).Value])
                        .range(['red', 'yellow', 'green']);
                    var ColorCode = myScale(value);
                    if (ColorCode == ("rgb(0, 0, 0)") || year == "2001") {
                        return "rgb(#000)";
                    }
                    console.log("Looking up: " + value + " results in " + ColorCode);
                    return ColorCode;
                }
                // Ende Einfärben Kontinente

                function handleMouseOver(d, i) {
                    var name = d.properties.name;
                    var id = d.properties.iso_a3;
                    var red = '#F23C50';
                    var yellow = '#FFCB05';
                    var darkGreen = '#16494F';
                    var blue = '#4AD9D9';

                    var height = 100;
                    var scale = d3.scaleLinear()
                        .domain([0, 50])
                        .range([0, height]);

                    var barWidth = 1;

                    // Tooltip Handler
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .8);
                    tooltip.html(d.properties.name + "</br>" + DataProvider.getValue(d.properties.iso_a3, year, '21046') )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");



                    d3.select('svg')
                        .selectAll('rect')
                        .data(data.features)
                        // .filter(function(d) { return d.properties.geounit ==  name })
                        // .filter(function(d) { return d.landholder.indexOf(chosen) > -1; })
                        .enter()
                        .append('rect')
                        .attr('x', function (d, i) {
                            return (barWidth + 10) * i;
                        })
                        .attr('y', function (d, i) {
                            if (DataProvider.getValue(d.properties.iso_a3, year, '21046') > 0)
                                return height - scale(DataProvider.getValue(d.properties.iso_a3, year, '21046'));
                        })
                        .attr('width', width)
                        .attr('height', function (d, i) {
                            if (DataProvider.getValue(d.properties.iso_a3, year, '21046') > 0)
                                return scale(DataProvider.getValue(d.properties.iso_a3, year, '21046'));
                        })
                        .style('fill', function (d, i) {
                            if (DataProvider.getValue(d.properties.iso_a3, year, '21046') <= 20) return red;
                            if (DataProvider.getValue(d.properties.iso_a3, year, '21046') <= 40) return yellow;
                            if (DataProvider.getValue(d.properties.iso_a3, year, '21046') <= 60) return blue;
                        })

                    return document.getElementById('name').innerHTML = name + " " + id + "</br><h5>" + "Sanitary: " + DataProvider.getValue(d.properties.iso_a3, year, '21046') + " %</h5>";
                }

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

                        return paintMapRegions('21032', DataProvider.getAverageForRegion(d.properties.iso_a3, year, "21032"), year);
                        //übergebe Daten aus geodata.json
                        // 21032 - Politische Stabilität
                        // 21046 - sichere Sanitäranlagen
                        // 21047 - Trinkwasser sicher (in Prozent)
                        // 210041 - Unterernährung
                    })
                    .on('mouseover', handleMouseOver)
                    .on("mouseout", function (d) {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });


                // svg.selectAll('text')
                //     .data(data.features)
                //     .enter()
                //     .append('text')
                //     .text(function (d) {
                //         return d.properties.name; //alle Daten von geodata.json
                //     })
                //     .attr("x", function (d) {
                //         return path.centroid(d)[0];
                //     })
                //     .attr("y", function (d) {
                //         return path.centroid(d)[1];
                //     })
                //     .attr("text-anchor", "middle")
                //     .attr('font-size', '6pt')
                //     .attr('fill', 'white');

            })

        }
    }
}(); 
