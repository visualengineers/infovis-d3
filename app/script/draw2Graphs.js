function drawGraphs(dateSetTogether) {
    //console.clear();
// set the dimensions and margins of the graph
    var margin = {top: 20, right: 40, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

// parse the date / time
    var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
    var xBar = d3.scaleBand().range([0, width]).paddingInner(0.5).paddingOuter(0.25);
    var xLine = d3.scalePoint().range([0, width]).padding(0.5);
    var yBar = d3.scaleLinear().range([height, 0]);
    var yLine = d3.scaleLinear().range([height, 0]);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    //var svgGraph = d3.select("#forDrawingGraph").append('svg');
    var svg = d3.select("#forDrawingGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Get the data


// format the data
    let data =  dateSetTogether;
    console.table(data);

// Scale the range of the data
    xBar.domain(data.map(function (d) {
        return d.year;
    }));
    xLine.domain(data.map(function (d) {
        return d.year;
    }));
    yBar.domain([0, d3.max(data, function (d) {
        return d.value1;
    })]).nice();
    yLine.domain([0, d3.max(data, function (d) {
        return Math.max(d.value2);
    })]).nice();

    var rect = svg.selectAll("rect")
        .data(data);

    var rect2 = svg.selectAll("rect")
        .data(data);
    rect2.enter().append("rect")
        .merge(rect)
        .attr("class", "bar")
        .style("stroke", "none")
        .style("fill", "red")
        .attr("x", function (d) {
            return xBar.bandwidth() / 2 + xBar(d.year);
        })
        .attr("width", function (d) {
            return xBar.bandwidth() / 2;
        })
        .attr("y", function (d) {
            return yBar(d.value1);
        })
        .attr("height", function (d) {
            return height - yBar(d.value2);
        });

    rect.enter().append("rect")
        .merge(rect)
        .attr("class", "bar")
        .style("stroke", "none")
        .style("fill", "steelblue")
        .attr("x", function (d) {
            return xBar(d.year);
        })
        .attr("width", function (d) {
            return xBar.bandwidth() / 2;
        })
        .attr("y", function (d) {
            return yBar(d.value1);
        })
        .attr("height", function (d) {
            return height - yBar(d.value1);
        });

// Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xLine));

// Add the Y0 Axis
    svg.append("g")
        .attr("class", "axisSteelBlue")
        .call(d3.axisLeft(yBar));

// Add the Y1 Axis
    svg.append("g")
        .attr("class", "axisRed")
        .attr("transform", "translate( " + width + ", 0 )")
        .call(d3.axisRight(yLine));
}