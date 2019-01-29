function drawFill(percentage) {
    var r = 50;
    var svg = d3.select("#forDrawingGauges").append("svg")
        .style("width", "250px")
        .style("height", "250px");

    console.log(percentage);
    var grad = svg.append("defs").append("linearGradient").attr("id", "grad")
        .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
    grad.append("stop").attr("offset", parseInt(percentage*100)+"%").style("stop-color", "lightblue");
    grad.append("stop").attr("offset", 100-parseInt(percentage*100)+"%").style("stop-color", "white");


    svg.append("circle")
        .attr("cx", r)
        .attr("cy", r)
        .attr("r", r)
        .attr("stroke", "blue")
        .attr("stroke-width", "3px")
        .attr("fill", "url(#grad)");
    svg.append("text")
        .attr("x", r+r)
        .attr("y", r-20)
        .text(Math.round(percentage*100)/100);
}