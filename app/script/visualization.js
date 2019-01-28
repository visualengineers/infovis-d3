
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

                var width = window.innerWidth - 150;
                var height = window.innerHeight - 120;
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

                // PieChart
                var pie1 = d3.select('.pie1').select('svg');
                var pie2 = d3.select('.pie2').select('svg');

                // SLIDER
                var sliderTime = d3
                    .sliderBottom()
                    .min(min)
                    .max(max)
                    .step(1000 * 60 * 60 * 24 * 365)
                    .width(600)
                    .tickFormat(d3.timeFormat('%Y'))
                    .tickValues(dataTime)
                    .default(new Date(year, 10, 3))
                    .on("end", val => {
                        year = d3.timeFormat('%Y')(val);


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
                    var color = myScale(value);
                    if (color == ("rgb(0, 0, 0)") || year == "2001") {
                        return "rgb(#000)";
                    }
                    return color;
                }
                // Ende Einfärben Kontinente


                function handleMouseOver(d, i) {

                    var name = d.properties.name;
                    var id = d.properties.iso_a3;

                    var sanitaer = DataProvider.getValue(id, year, '21046');
                    var sanitaerGes = 100 - DataProvider.getValue(id, year, '21046');

                    var undernourished = DataProvider.getValue(id, year, '210041');
                    var undernourishedGes = 100 - DataProvider.getValue(id, year, '210041');
                    var dataPie = [sanitaer, sanitaerGes];
                    var dataPie2 = [undernourished, undernourishedGes];


                    var red = '#F23C50';
                    var white = '#FFF';
                    var darkGreen = '#16494F';
                    var blue = '#4AD9D9';

                    var pie = d3.pie()
                        .sort(function (a, b) {
                            return a - b;
                        });

                    var arc = d3.arc()
                        .innerRadius(10)
                        .outerRadius(30)

                    pie1.selectAll('path')
                        .data(pie(dataPie))
                        .enter()
                        .append('path')
                        .attr('d', arc)
                        .attr('fill', function (d, i) {
                            return [blue, white][i % 2];
                        })
                        .attr('transform', 'translate(50, 30)')


                    pie2.selectAll('path')
                        .data(pie(dataPie2))
                        .enter()
                        .append('path')
                        .attr('d', arc)
                        .attr('fill', function (d, i) {
                            return [red, white][i % 2];
                        })
                        .attr('transform', 'translate(50, 30)');

                    // Tooltip Handler
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .8);
                    tooltip.html(d.properties.name + "</br>" + DataProvider.getValue(d.properties.iso_a3, year, '21046'))
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");


                    return document.getElementById('name').innerHTML = "<h3>" + name + "</h3><h4>" + id + "</h4>" + "Sanitary:</br>" + DataProvider.getValue(d.properties.iso_a3, year, '21046') + " %</br>"
                        + "</br>Undernourished:</br>" + DataProvider.getValue(d.properties.iso_a3, year, '210041') + " %</h5>";
                }

                // Hintergrund
                svg.append('rect')
                    .attr('width', width - 200)
                    .attr('height', height)
                    .attr('fill', '#2f5f8f');


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
                        pie1.selectAll("path").remove();
                        pie2.selectAll("path").remove();
                    })
                    ;
            })

        }
    }
}(); 
