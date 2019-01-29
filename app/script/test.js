let selectedYear = 2004;
let selectedCountry1 = 'Bermuda';
let selectedCountry2 = 'Bermuda';
let dataSetCountry1, dataSetCountry2;
let timeLine1 = null, timeLine2 = null;
//DataProvider.getDataForTimeline(selectedCountry1, "22013", function(value){timeLine1 = value;});
//DataProvider.getDataForTimeline(selectedCountry2, "22013", function(value){timeLine2 = value;});

let svg = d3.select("#forDrawingCircles").append('svg');
let svgGraph = d3.select("#forDrawingGraph").append('svg');

function draw(dataSetCountry1, dataSetCountry2) {
    svg = d3.select("#forDrawingCircles").append('svg')
        .style("width", "100%")
        .style("height", "500px");
    var originX = 200;
    var originY = 300;
    var innerCircleRadius = 40;
    var outerCircleRadius = 60;
    var rotation = 150;

    let dataC1GDP = dataSetCountry1.GrossDomesticProductPerCapita;
    let dataC1Prot = dataSetCountry1.AverageProteinSupply;
    let dataC1Obese = dataSetCountry1.PrevalenceOfObesityInTheAdultPop;
    let dataC1Under = dataSetCountry1.PrevalenceOfUndernourishment;

    let dataC2GDP = dataSetCountry2.GrossDomesticProductPerCapita;
    let dataC2Prot = dataSetCountry2.AverageProteinSupply;
    let dataC2Obese = dataSetCountry2.PrevalenceOfObesityInTheAdultPop;
    let dataC2Under = dataSetCountry2.PrevalenceOfUndernourishment;

    //Scale function for circles
    var scaleGDP = d3.scaleLinear().
    domain([500, 125000]).
    range([0, 150]);

    var scaleProt = d3.scaleLinear().
    domain([0, 150]).
    range([0, 50]);
    var scaleObese = d3.scaleLinear().
    domain([0, 100]).
    range([10, 50]);
    var scaleUnder = d3.scaleLinear().
    domain([0, 100]).
    range([10, 50]);

    //For tooltip
    var div = d3.select("body").append('div')
        .attr("class", "tooltip")
        .style("opacity", 0);

    //Color
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    /**
     * Country 1
     * ***/
    //Outer Circle
    var referencCircleCountry1 = svg.append("circle")
        .attr("cx", originX)
        .attr("cy", originY)
        .attr("r", rotation)
        .attr("fill", "none")
        .attr("stroke", color(3))
        .style("stroke-dasharray", ("10,3"));

    country1 = svg.selectAll("circle")
        .data(dataC1GDP)
        .enter()
        .append("circle")
        .attr("cx", originX)
        .attr("cy", originY)
        .attr("stroke", ()=>{
            if (dataC1GDP !== '999999')
                return color(3);
            else
                return "grey";
        })
        .attr("fill", ()=>{
            if (dataC1GDP !== '999999')
                return color(3);
            else
                return "grey";
        })
        .attr("r", () => {
            if (dataC1GDP !== '999999') {return scaleGDP(dataC1GDP);}
            else {return scaleGDP('10000');}
        })
        .on("mouseover", () => {
            let dataC1GDPstatement;
            if (dataC1GDP !== '999999')
                dataC1GDPstatement = dataC1GDP;
            else
                dataC1GDPstatement = 'Value not provided!';
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry1 + "<br/>" + "GDP "+selectedYear + "<br/>"+dataC1GDPstatement)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () => {
            svgGraph.remove();
            DataProvider.getDataForTimeline(selectedCountry1, "22013", function(value){timeLine1 = value;});
            runGraph();

        });

    avgProteinSupplyCountry1 = svg.append('circle')
        .attr("cx", originX + ((rotation) * Math.sin(0)))
        .attr("cy", originY - ((rotation) * Math.cos(0)))
        .attr("stroke", ()=>{
            if (dataC1Prot !== '999999')
                return color(6);
            else
                return "grey";
        })
        .attr("fill", ()=>{
            if (dataC1Prot !== '999999')
                return color(6);
            else
                return "grey";
        })
        .attr("r", () => {
            if (dataC1Prot !== '999999') {return scaleProt(dataC1Prot);}
            else {return scaleProt('100');}
        })
        .on("mouseover", () => {
            let dataC1Protstatement;
            if (dataC1Prot !== '999999')
                dataC1Protstatement = dataC1Prot;
            else
                dataC1Protstatement = 'Value not provided!';
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry1 + "<br/>" + "Protein "+selectedYear + "<br/>"+dataC1Protstatement)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () => {
            svgGraph.remove();
            DataProvider.getDataForTimeline(selectedCountry1, "21013", function(value){timeLine1 = value;});
            runGraph();
        });

    var lineToavgProteinSuppyCountry1 = svg.append("line")
        .attr("x1", originX)
        .attr("y1", originY)
        .attr("x2", avgProteinSupplyCountry1.node().getBBox().x + avgProteinSupplyCountry1.node().getBBox().width/2)
        .attr("y2", avgProteinSupplyCountry1.node().getBBox().y + avgProteinSupplyCountry1.node().getBBox().height)
        .attr("stroke", color(3))
        .attr("width", "2")
        .style("stroke-dasharray", ("10,3"));

    var prevObesityCountry1 = svg.append('circle')
        .attr("cx", originX + 150)
        .attr("cy", originY - 20)
        .attr("r", ()=> {
            return scaleObese(dataC1Obese);
        })
        .attr("fill", color(1))
        .attr("stroke", color(1))
        .on("mouseover", () => {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry1 + "<br/>" + "Obesity % "+selectedYear + "<br/>"+dataC1Obese)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () => {
            svgGraph.remove();
            DataProvider.getDataForTimeline(selectedCountry1, "21042", function(value){timeLine1 = value;});
            runGraph();
        });

    var lineToPrevObesityCountry1 = svg.append("line")
        .attr("x1", originX)
        .attr("y1", originY)
        .attr("x2", prevObesityCountry1.node().getBBox().x + prevObesityCountry1.node().getBBox().width/2)
        .attr("y2", prevObesityCountry1.node().getBBox().y + prevObesityCountry1.node().getBBox().height/2)
        .attr("stroke", color(3))
        .attr("width", "6")
        .style("stroke-dasharray", ("10,9"));

    var prevUndernourishmentCountry1 = svg.append('circle')
        .attr("cx", originX - 150)
        .attr("cy", originY - 20)
        .attr("r", ()=>{
            return scaleUnder(dataC1Under);
        })
        .attr("fill", color(1))
        .attr("stroke", color(1))
        .on("mouseover", () => {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry1 + "<br/>" + "Undernourishment % "+selectedYear + "<br/>"+dataC1Under)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () =>{
            svgGraph.remove();
            DataProvider.getDataForTimeline(selectedCountry1, "210041", function(value){timeLine1 = value;});
            runGraph();
        });

    var lineToPrevUndernourishmentCountry1 = svg.append("line")
        .attr("x1", originX)
        .attr("y1", originY)
        .attr("x2", prevUndernourishmentCountry1.node().getBBox().x + prevUndernourishmentCountry1.node().getBBox().width/2)
        .attr("y2", prevUndernourishmentCountry1.node().getBBox().y + prevUndernourishmentCountry1.node().getBBox().height/2)
        .attr("stroke", color(3))
        .attr("width", "6")
        .style("stroke-dasharray", ("10,9"));


    /**
     * Coutnry 2
     * **/

    var referencCircle2 = svg.append("circle")
        .attr("cx", 500 + originX)
        .attr("cy", originY)
        .attr("r", rotation)
        .attr("fill", "none")
        .attr("stroke", color(8))
        .style("stroke-dasharray", ("10,3"));

    var country2 = svg.append("circle")
        .attr("cx", 500 + originX)
        .attr("cy", originY)
        .attr("stroke", ()=>{
            if (dataC2GDP !== '999999')
                return color(8);
            else
                return "grey";
        })
        .attr("fill", ()=>{
            if (dataC2GDP !== '999999')
                return color(8);
            else
                return "grey";
        })
        .attr("r", () => {
            if (dataC2GDP !== '999999') {return scaleGDP(dataC2GDP);}
            else {return scaleGDP('10000');}
        })
        .on("mouseover", () => {
            let dataC2GDPstatement;
            if (dataC2GDP !== '999999')
                dataC2GDPstatement = dataC1GDP;
            else
                dataC2GDPstatement = 'Value not provided!';
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry2 + "<br/>" + "GDP "+selectedYear + "<br/>"+dataC2GDPstatement)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () =>{
            svgGraph.remove();
            DataProvider.getDataForTimeline(selectedCountry2, "22013", function(value){timeLine2 = value;});
            runGraph();

        });

    var avgProteinSuppyCountry2 = svg.append('circle')
        .attr("cx", 500 + originX + ((rotation) * Math.sin(0)))
        .attr("cy", originY - ((rotation) * Math.cos(0)))
        .attr("stroke", ()=>{
            if (dataC2Prot !== '999999')
                return color(7);
            else
                return "grey";
        })
        .attr("fill", ()=>{
            if (dataC2Prot !== '999999')
                return color(7);
            else
                return "grey";
        })
        .attr("r", () => {
            if (dataC2Prot !== '999999') {return scaleProt(dataC2Prot);}
            else {return scaleProt('100');}
        })
        .on("mouseover", () => {
            let dataC2Protstatement;
            if (dataC2Prot !== '999999')
                dataC2Protstatement = dataC2Prot;
            else
                dataC2Protstatement = 'Value not provided!';
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry2 + "<br/>" + "Protein Supply "+selectedYear + "<br/>"+dataC2Protstatement)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () =>{
            svgGraph.remove();
            DataProvider.getDataForTimeline(selectedCountry2, "21013", function(value){timeLine2 = value;});
            runGraph();
        });

    var lineToavgProteinSuppyCountry2 = svg.append("line")
        .attr("x1", 500 + originX)
        .attr("y1", originY)
        .attr("x2", avgProteinSuppyCountry2.node().getBBox().x + avgProteinSuppyCountry2.node().getBBox().width/2)
        .attr("y2", avgProteinSuppyCountry2.node().getBBox().y + avgProteinSuppyCountry2.node().getBBox().height)
        .attr("stroke", color(8))
        .attr("width", "2")
        .style("stroke-dasharray", ("10,3"));

    var prevObesityCountry2 = svg.append('circle')
        .attr("cx", 650 + originX)
        .attr("cy", originY - 20)
        .attr("r", ()=>{
            return scaleObese(dataC2Obese);
        })
        .attr("fill", color(1))
        .attr("stroke", color(1))
        .on("mouseover", () => {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry2 + "<br/>" + "Obesity % "+selectedYear + "<br/>"+dataC2Obese)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () =>{
            svgGraph.remove();
            DataProvider.getDataForTimeline(selectedCountry2, "21042", function(value){timeLine2 = value;});
            runGraph();
        });

    var lineToPrevObesityCountry2 = svg.append("line")
        .attr("x1", 500 + originX)
        .attr("y1", originY)
        .attr("x2", prevObesityCountry2.node().getBBox().x + prevObesityCountry2.node().getBBox().width/2)
        .attr("y2", prevObesityCountry2.node().getBBox().y + prevObesityCountry2.node().getBBox().height/2)
        .attr("stroke", color(8))
        .attr("width", "6")
        .style("stroke-dasharray", ("10,9"));

    var prevUndernourishmentCountry2 = svg.append('circle')
        .attr("cx", 350 + originX)
        .attr("cy", originY - 20)
        .attr("r", ()=>{
            return scaleUnder(dataC2Under);
        })
        .attr("fill", color(1))
        .attr("stroke", color(1))
        .on("mouseover", () => {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry2 + "<br/>" + "Undernourishment % "+selectedYear + "<br/>"+dataC2Under)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () =>{
            svgGraph.remove();
            DataProvider.getDataForTimeline(selectedCountry2, "210041", function(value){timeLine2 = value;});
            runGraph();
        });

    var lineToPrevUndernourishmentCountry2 = svg.append("line")
        .attr("x1", 500 + originX)
        .attr("y1", originY)
        .attr("x2", prevUndernourishmentCountry2.node().getBBox().x + prevUndernourishmentCountry2.node().getBBox().width/2)
        .attr("y2", prevUndernourishmentCountry2.node().getBBox().y + prevUndernourishmentCountry2.node().getBBox().height/2)
        .attr("stroke", color(8))
        .attr("width", "6")
        .style("stroke-dasharray", ("10,9"))
}

function drawSlider(){
    // Time
    var dataTime = d3.range(0, 18).map(function(d) {
        return new Date(2000 + d, 10, 3);
    });

    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(dataTime))
        .max(d3.max(dataTime))
        .step(1000 * 60 * 60 * 24 * 365)
        .width(600)
        .tickFormat(d3.timeFormat('%Y'))
        .tickValues(dataTime)
        .default(new Date(2004, 10, 3))
        .on('onchange', val => {
            d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
            selectedYear = d3.timeFormat('%Y')(val);
            loadNewValues();
        });

    var gTime = d3
        .select('div#slider-time')
        .append('svg')
        .attr('width', 700)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gTime.call(sliderTime);

    d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));//*/
}


let selectValuesForPresentation = function () {
    //let data = DataProvider.getPreparedData();
    let data;
    DataProvider.getDataForCountrySelection(function(value){data = value;});
    let selectedRegion1 = 0;
    let selectedRegion2 = 0;

    let region1Vue = new Vue({
        el: '#dropdownRegion1',
        data: {
            selectedRegion: data[0].Index,
            options: data,
        },
        methods: {
            onChange: function () {
                country1Vue.setCountryData(this.selectedRegion);
                selectedRegion1 = this.selectedRegion;
                loadNewValues();
            }
        },
    });

    let country1Vue = new Vue({
        el: '#dropdownCountry1',
        data: {
            selectedCountry: data[0].Countries[0].Area,
            options: data[0].Countries,
        },
        methods: {
            setCountryData: function (thisValue) {
                this.options = [];
                this.options = data[thisValue].Countries;
                this.selectedCountry = data[thisValue].Countries[0].Area;
                selectedCountry1 = this.selectedCountry;
            },
            onChange: function () {
                selectedCountry1 = this.selectedCountry;
                loadNewValues();
            }
        }
    });

    let region2Vue = new Vue({
        el: '#dropdownRegion2',
        data: {
            selectedRegion: data[0].Index,
            options: data,
        },
        methods: {
            onChange: function () {
                country2Vue.setCountryData(this.selectedRegion);
                selectedRegion2 = this.selectedRegion;
                loadNewValues();
            }
        },
    });

    let country2Vue = new Vue({
        el: '#dropdownCountry2',
        data: {
            selectedCountry: data[0].Countries[0].Area,
            options: data[0].Countries,
        },
        methods: {
            setCountryData: function (thisValue) {
                this.options = [];
                this.options = data[thisValue].Countries;
                this.selectedCountry = data[thisValue].Countries[0].Area;
                selectedCountry2 = this.selectedCountry;
            },
            onChange: function () {
                selectedCountry2 = this.selectedCountry;
                loadNewValues();
            }
        }
    });
};


function loadNewValues(){
    svg.remove();
    console.log("Country1: "+selectedCountry1);
    console.log("Country2: "+selectedCountry2);
    console.log("Year: "+selectedYear);
    DataProvider.getDataForCountryAndYear(selectedCountry1, parseInt(selectedYear), function(value){dataSetCountry1 = value;});
    DataProvider.getDataForCountryAndYear(selectedCountry2, parseInt(selectedYear), function(value){dataSetCountry2 = value;});
    console.log(dataSetCountry1);
    console.log(dataSetCountry2);
    draw(dataSetCountry1, dataSetCountry2);
}

function init(){
    DataProvider.getDataForTimeline(selectedCountry1, "22013", function(value){timeLine1 = value;});
    DataProvider.getDataForTimeline(selectedCountry2, "22013", function(value){timeLine2 = value;});
    Helper.get1DatasetFrom2Timelines(timeLine1, timeLine1, drawGraphs);

}

function runGraph(){
    console.log("SVGGraph "+svgGraph);
    svgGraph.remove();
    while(svgGraph.lastChild){
        svgGraph.removeChild(svgGraph.lastChild);
    }

    if (timeLine1 || timeLine1){
        console.log("ONE IS NULL");
    }else{
        console.log("HERE")
    }
    Helper.get1DatasetFrom2Timelines(timeLine1, timeLine2, drawGraphs);
    Helper.getPearsonCoeffizient(timeLine1, timeLine2, drawFill);
    Helper.getSpearmanCoeffizient(timeLine1, timeLine2, drawFill);

}