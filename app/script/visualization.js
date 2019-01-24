
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
            d3.json("data/geodata.json", function(error, data){
                
                var svg = d3.select('svg');

                var width  = window.innerWidth;
                var height = window.innerHeight;
                console.log("Width: " + width + ", Height: " + height);

                var projection = d3.geoNaturalEarth1().scale(200).translate([(width/2)-100, (height/2)+50]);
                var path = d3.geoPath().projection(projection);

                // background rect for select continents 
                svg.append("rect")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("fill", "#efefef")
                    //.on("click", function(d, i) {
                    //    handleMouseClick();
                    //})
                    ;
                    
                svg.selectAll('path')
                .data(data.features)
                .enter()
                .append('path')
                .attr('d', function(d) { 
                    return path(d)
                    });
            })
            
        }
    }
}(); 
