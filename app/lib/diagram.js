var highlightColor = "#555555";

var height = 500;
var width = 300;
var circleRadius = 4;
var transitionDuration = 1000;
//var barWidth = 10;
//var verticalAxisSpacing = 40;

var fatScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, height]);

/*var dateScale = d3.scaleTime()
    .range([0, width])
    .domain([new Date('1999'), new Date('2017')]);
*/
var politScale = d3.scaleLinear()
    .domain([-2.5, 2.5])
    .range(["#FF1100", "#002366"]);

var bipScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);


function generateDiagram(dataSet, svgId) {


    var svg = d3.select('#' + svgId)
               .style("width", width + 300 + "px")
        .style("height", height + 100 + "px")
        
        .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
         }));

    var svgGroup = svg.append('g')
        .attr('transform', 'translate(50, 20)');

    var circles = svgGroup
        .selectAll('circle')
        .data(dataSet)
        .enter()
        .append('circle')
        .attr('cx', function (d, i) {
            return fatScale(d.fat) + circleRadius
        })
        .attr('cy', function (d, i) {
            return bipScale(d.bip) - circleRadius
        })
        .attr('r', circleRadius)
        .attr('fill', function (d, y) {
            return politScale(d.polit)
        })
        .on("mouseenter", function (d) {
            d3.select(this)
                .attr("fill", highlightColor);
        })
        .on("mouseleave", function (d) {
            d3.select(this)
                .attr("fill", politScale(d.polit));
        })

        .append("svg:title")
        .text(function (d) {
            return d.country + "( BiP: " + d.bip + ", Fat: " + d.fat+", Polit : " + d.polit+ ")";
        })



    // BiP-Axis
    svgGroup.append('g')
        .call(d3.axisLeft(bipScale))
        .attr("transform", "translate(" + (-circleRadius*2) + "," + (-circleRadius) + ")");

    // BiP-Label
    svgGroup.append('text')
        .attr("text-anchor", "end")
        .attr("y", -50)
        .attr("x", -height / 2)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("BIP/Kopf")

    // Fat-Axis
    svgGroup.append('g')
        .call(d3.axisBottom(fatScale))
        .attr("transform", "translate(" + circleRadius + "," + (height+circleRadius*2) + ")");

    // Fat Label
    svgGroup.append('text')
        .attr("text-anchor", "end")
        .attr("y", height + 40)
        .attr("x", 400)
        .attr("dy", ".75em")
        .text("Verbreitung von Fettleibigkeit (in %)")
}

function updateDiagram(dataSet, svgId) {
    var svg = d3.select('#' + svgId)

    svg.selectAll("circle")
        .data(dataSet)
        .transition()
        .duration(transitionDuration)
        .attr('cx', function (d, i) {
            return fatScale(d.fat) + circleRadius
        })
        .attr('cy', function (d, i) {
            return bipScale(d.bip) - circleRadius
        })
        .attr('fill', function (d, y) {
            return politScale(d.polit)
        })
}