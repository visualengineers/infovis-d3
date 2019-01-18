var highlightColor = "#555555";

var politStableColor = "#002366"
var politNeutralColor = "#A16BB0"
var politUnstableColor = "#FF1100"

var height = 500;
var width = 800;
var xOffset = 150;
var yOffset = 100;
var circleRadius = 10;
var transitionDuration = 1000;


var fatScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width - xOffset]);

var politScale = d3.scaleLinear()
    .domain([-2.5, 0, 2.5])
    .range([politUnstableColor, politNeutralColor, politStableColor]);

var bipScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height - yOffset, 0]);

function setBipDomain(min, max) {
    bipScale = d3.scaleLinear()
        .domain([min, max])
        .range([height - yOffset, 0]);
}

function setPolitDomain(min, max) {
    politScale = d3.scaleLinear()
        .domain([min, (min + max) / 2.0, max])
        .range(["#FF1100", "#A16BB0", "#002366"]);
}

function setFatDomain(min, max) {
    fatScale = d3.scaleLinear()
        .domain([min, max])
        .range([0, width - xOffset]);
}

function setWidth(w) {
    width = w;
}

function setHeight(h) {
    height = h;
}

function highlightCountry(svgId, countryId) {
    var country = d3.select('#' + svgId)
        .select('#' + escapeId(countryId))
        .transition()
        .duration(200)
        .attr('r', circleRadius * 3)
        .style('stroke', highlightColor)
        .style('stroke-width', '2px');
}

function unhighlightCountries(svgId) {
    var country = d3.select('#' + svgId)
        .selectAll('circle')
        .transition()
        .duration(200)
        .attr('r', circleRadius)
        .style('stroke', '')
        .style('stroke-width', '0px');

}

function drawPolitCircle(value, svgId) {

    var svg = d3.select('#' + svgId)
        .style("height", "50px")
        .style("width", "50px");

    svg.append('circle')
        .attr('cx', 25)
        .attr('cy', 25)
        .attr('r', 20)
        .style("stroke", "gray")
        .style("stroke-width", "1px")
        .attr('fill', function (d) {
            return value === "?" ? "white" : politScale(value);
        })
}


function generateDiagram(dataSet, svgId, onClickCallback) {


    var svg = d3.select('#' + svgId)
        .style("width", width + "px")
        .style("height", height + "px");

    // Generate Legend
    var legend = svg.append('g')
        .attr("transform", "translate(" + width * 2 / 20 + "," + height * 1 / 20 + ")")

    legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width / 5)
        .attr("height", height * 3 / 20)
        .attr("fill", "white")
        .style("stroke", "gray")
        .style("stroke-width", "1px")
        .style("opacity", ".4");

    legend.append('text')
        .text("Political Stability")
        .attr("transform", "translate(100,20)");

    var gradient = svg.append("defs").append("linearGradient")
        .attr("id", "politGradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", politUnstableColor)
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", politStableColor)
        .attr("stop-opacity", 1);


    legend.append("rect")
        .attr("x", width * 1 / 50)
        .attr("y", height * 1 / 20)
        .attr("width", width * 3 / 20)
        .attr("height", height * 1 / 30)
        .attr("fill", "url(#politGradient)");

    legend.append("text")
        .text("Unstable")
        .attr("transform", "translate(10,90)")
    legend.append("text")
        .text("Neutral")
        .attr("transform", "translate(120,90)")

    legend.append("text")
        .text("Stable")
        .attr("transform", "translate(250,90)")


    var svgGroup = svg.append('g')
        .attr('transform', 'translate(90, 20)');

    svgGroup.append('text')
        .attr('id', "yearId")
        .attr('transform', 'translate(' + (width * 3 / 4) + ',50)')
        .text("2000")
        .style("font-size", "3vw");



    var circles = svgGroup
        .selectAll('circle')
        .data(dataSet)
        .enter()
        .append('circle')
        .attr('id', function (d, i) {
            return escapeId(d.country);
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
        .style("opacity", "0.75")
        .on("mouseenter", function (d) {
            d3.select(this)
                .style("opacity", 1.0);
        })
        .on("mouseleave", function (d) {
            d3.select(this)
                .style("opacity", .75);
        })
        .on("click", function (d) {
            onClickCallback(d);
        })

        .append("svg:title")
        .text(function (d) {
            return d.country + "( BiP: " + d.bip + ", Fat: " + d.fat + ", Polit : " + d.polit + ")";
        })



    // BiP-Axis
    svgGroup.append('g')
        .call(d3.axisLeft(bipScale))
        .attr("id", "bipAxisId")
        .attr("transform", "translate(" + (-circleRadius * 2) + "," + (-circleRadius) + ")");

    // BiP-Label
    svgGroup.append('text')
        .attr("id", "bipAxisLabelId")
        .attr("text-anchor", "end")
        .attr("y", -80)
        .attr("x", (-height + yOffset) / 2)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Gross domestic product")

    // Fat-Axis
    svgGroup.append('g')
        .call(d3.axisBottom(fatScale))
        .attr("id", "fatAxisId")
        .attr("transform", "translate(" + circleRadius + "," + (height - yOffset + circleRadius * 2) + ")");

    // Fat Label
    svgGroup.append('text')
        .attr("id", "fatAxisLabelId")
        .attr("text-anchor", "end")
        .attr("y", height + 40 - yOffset)
        .attr("x", (width - xOffset) / 2)
        .attr("dy", ".75em")
        .text("Prevalence of obesity in the adult population (18 years and older)")


}

function updateDiagram(dataSet, svgId, year) {
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


    svg.select('#yearId')
        .transition()
        .duration(transitionDuration)
        .text(year)
}