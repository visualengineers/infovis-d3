/**
 * Visualization module
 */
var Visualization = function () {
    var _greeting;

    return {
        /**
         * Create the visualisation. This is the main application entry point.
         */
        draw: function (dataFromTimeLine) {
            /***
             * */

            data = dataFromTimeLine.actualData;

            var maxValue = d3.max(data, function(d){
                return d.value;
            });
            var minValue = d3.min(data, function(d){
                return d.value;
            });
            var maxYear = d3.max(data, function (d) {
                return d.year;
            });
            var minYear = d3.min(data, function (d) {
                return d.year;
            });

            var maxYearAsString = String(maxYear);
            var minYearAsString = String(minYear);

            console.log("Min year = "+minYear);

            var newData = [];
            var height = 300;
            var width = 300;
            var barWidth = 10;
            var scale  = d3.scaleLinear().
            domain([0, maxValue]).
            range([height, 0]);

            for(var i = 0; i < data.length; i++)
                newData[i] = scale(data[i]);

            var SVGGroup = d3.select('svg').append('g').attr('transform', 'translate(50, 20)');

            var dateScale = d3.scaleTime()
                .range([0, width])
                .domain([new Date(minYearAsString), new Date(maxYearAsString)]);

            var rect = SVGGroup
                .selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr('x', function (d){
                    return dateScale(new Date(String(d.year)))-(barWidth/2);})
                .attr('y', function (d) {
                    return scale(d.value);
                })
                .attr('width', barWidth)
                .attr('height', function (d) {
                    console.log(d.year, scale(d.year));
                    return height - scale(d.value);
                })
                .transition()
                .duration(300)
                .attr('x', function (d){
                    return dateScale(new Date(String(d.year)))-(barWidth/2);})
                .attr('y', function (d) {
                    return scale(d.value);
                })
                .attr('width', barWidth)
                .attr('height', function (d) {
                    console.log(d.year, scale(d.year));
                    return height - scale(d.value);
                });

            SVGGroup.append('g')
                .call(d3.axisLeft(scale));
            SVGGroup.append('g')
                .attr('transform', 'translate(0, '+height+')')
                .call(d3.axisBottom(dateScale).tickFormat(d3.timeFormat("%Y")))
                .selectAll("text")
                .attr("dx", "-1.8em")
                .attr("dy", "-0.7em")
                .attr('transform', "rotate(-90)");
        }
    }
}();

