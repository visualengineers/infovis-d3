var highlightColor = "#555555";

var height = 500;
var width = 800;
var xOffset = 150;
var yOffset = 100;
var circleRadius = 10;
var transitionDuration = 1000;

var fatScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width-xOffset]);

var politScale = d3.scaleLinear()
    .domain([-2.5, 2.5])
    .range(["#FF1100","#A16BB0", "#002366"]);

var bipScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height-yOffset, 0]);

function setBipDomain(min, max) {
    bipScale = d3.scaleLinear()
        .domain([min, max])
        .range([height-yOffset, 0]);
}

function setPolitDomain(min, max) {
    politScale = d3.scaleLinear()
        .domain([min, (min+max)/2.0,max])
        .range(["#FF1100","#A16BB0", "#002366"]);
}

function setFatDomain(min, max) {
    fatScale = d3.scaleLinear()
        .domain([min, max])
        .range([0, width-xOffset]);
}

function setWidth(w){
    width = w;
}

function setHeight(h){
    height = h;
}

function highlightCountry(svgId,countryId){
    var country = d3.select('#' + svgId)
                    .select('#' + countryId)
                    .transition()
                    .duration(200)
                    .attr('r', circleRadius*3)
                    .style('stroke',highlightColor)
                    .style('stroke-width', '2px');
}

function unhighlightCountries(svgId){
    var country = d3.select('#' + svgId)
                    .selectAll('circle')
                    .transition()
                    .duration(200)
                    .attr('r', circleRadius)
                    .style('stroke','')
                    .style('stroke-width', '0px');

}

function drawPolitCircle(value, svgId){

    var svg = d3.select('#' + svgId)
                .style("height", "50px")
                .style("width", "50px");

    svg.append('circle')
       .attr('cx',25)
       .attr('cy',25)
       .attr('r',20)
       .attr('fill',function(d){
           return value === "?" ? "orange" : politScale(value);
       })
}

function generateDiagram(dataSet, svgId) {


    var svg = d3.select('#' + svgId)        
        .style("width", width + "px")
        .style("height", height + "px");

    /*
    svg.append("rect")
       .attr("fill","#EEE")
       .attr("width", "100%")
       .attr("height", "100%")
*/

    var svgGroup = svg.append('g')
        .attr('transform', 'translate(85, 20)');

    svgGroup.append('text')
            .attr('id', "yearId")
            .attr('transform', 'translate(' + (width*3/4) + ',20)')
            .text("2000")
            .style("font-size","25px");

    var circles = svgGroup
        .selectAll('circle')
        .data(dataSet)
        .enter()
        .append('circle')
        .attr('id', function(d,i){
            return d.country.replace(/ /g, '');
        })
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
        .style("opacity","0.75")
        .on("mouseenter", function (d) {
            d3.select(this)
                .style("opacity", 1.0);
        })
        .on("mouseleave", function (d) {
            d3.select(this)
            .style("opacity", .75);
        })

        .append("svg:title")
        .text(function (d) {
            return d.country + "( BiP: " + d.bip + ", Fat: " + d.fat + ", Polit : " + d.polit + ")";
        })



    // BiP-Axis
    svgGroup.append('g')
        .call(d3.axisLeft(bipScale))
        .attr("id","bipAxisId")
        .attr("transform", "translate(" + (-circleRadius * 2) + "," + (-circleRadius) + ")");

    // BiP-Label
    svgGroup.append('text')
        .attr("id","bipAxisLabelId")
        .attr("text-anchor", "end")
        .attr("y", -75)
        .attr("x", (-height + yOffset) / 2)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("BIP/Kopf (in €)")

    // Fat-Axis
    svgGroup.append('g')
        .call(d3.axisBottom(fatScale))
        .attr("id","fatAxisId")
        .attr("transform", "translate(" + circleRadius + "," + (height - yOffset + circleRadius * 2) + ")");

    // Fat Label
    svgGroup.append('text')
        .attr("id","fatAxisLabelId")
        .attr("text-anchor", "end")
        .attr("y", height + 40 - yOffset)
        .attr("x", (width-xOffset)/2  )
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