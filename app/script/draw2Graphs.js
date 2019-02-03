function drawGraphs(dateSetTogether) {
    //console.clear();
// set the dimensions and margins of the graph
    let margin = {top: 20, right: 40, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

// parse the date / time
    let parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
    let xBar = d3.scaleBand().range([0, width]).paddingInner(0.5).paddingOuter(0.25);
    let xLine = d3.scalePoint().range([0, width]).padding(0.5);
    let y0Axis = d3.scaleLinear().range([height, 0]);
    let y1Axis = d3.scaleLinear().range([height, 0]);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    //let svgGraph = d3.select("#forDrawingGraph").append('svg');
    let svg = d3.select("#forDrawingGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
		.attr("id", "graph")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //For tooltip
    let div = d3.select("body").append('div')
        .attr("class", "tooltip2")
        .style("opacity", 0);


// format the data
    let data =  dateSetTogether;
    //console.table(data);

// Scale the range of the data
    xBar.domain(data.map((d) => {
        return d.year;
    }));
    xLine.domain(data.map((d) => {
        return d.year;
    }));
    y0Axis.domain([0, d3.max(data, (d) => {
        return Math.max(d.value1);
    })]).nice();
    y1Axis.domain([0, d3.max(data, (d) => {
        return Math.max(d.value2);
    })]).nice();

    let rect = svg.selectAll("rect")
        .data(data);

    let rect2 = svg.selectAll("rect")
        .data(data);

    rect.enter().append("rect")
        .merge(rect)
        .attr("class", "bar")
        .style("stroke", "none")
        .style("fill", "steelblue")
        .attr("x", (d) => {
            return xBar(d.year);
        })
        .attr("width", () => {
            return xBar.bandwidth() / 2;
        })
        .attr("y", (d) => {
            return y0Axis(d.value1);
        })
        .attr("height", (d) => {
            console.log("y0Acis: "+y0Axis);
            return height - y0Axis(d.value1);
        })
        .on("mouseover", (d) => {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html("" + d.value1 + "<br/>Year: " +d.year + "<br/>")
            .style("left", d3.event.pageX+"px")
            .style("top", d3.event.pageY+"px");
    })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    rect2.enter().append("rect")
        .merge(rect)
        .attr("class", "bar")
        .style("stroke", "none")
        .style("fill", "red")
        .attr("x", (d) => {
            return xBar.bandwidth() / 2 + xBar(d.year);
        })
        .attr("width", () => {
            return xBar.bandwidth() / 2;
        })
        .attr("y", (d) => {
            return y1Axis(d.value2);
        })
        .attr("height", (d) => {
            return height - y1Axis(d.value2);
        })
        .on("mouseover", (d) => {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + d.value2 + "<br/>" + "Year: "+d.year + "<br/>")
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

// Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xLine));

// Add the Y0 Axis
    svg.append("g")
        .attr("class", "axisSteelBlue")
        .call(d3.axisLeft(y0Axis));

// Add the Y1 Axis
    svg.append("g")
        .attr("class", "axisRed")
        .attr("transform", "translate( " + width + ", 0 )")
        .call(d3.axisRight(y1Axis));
}