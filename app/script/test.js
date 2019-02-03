let selectedYear = 2004;
let selectedCountry1 = 'Bermuda';
let selectedCountry2 = 'Bermuda';
let dataSetCountry1, dataSetCountry2;
let timeLine1 = null, timeLine2 = null;
let CoeffizientsRegion1;
let CoeffizientsRegion2;

let svg = d3.select("#forDrawingCircles").append('svg');
let svgGraph = d3.select("#forDrawingGraph").append('svg');

function draw() {
    d3.select('p#selectedValueForCountry1').text("GDP in "+selectedCountry1);
    d3.select('p#selectedValueForCountry2').text("GDP in "+selectedCountry2);

    svg = d3.select("#forDrawingCircles").append('svg')
        .style("width", "100%")
        .style("height", "425px");
    let originX = 200;
    let originY = 225;
    let innerCircleRadius = 40;
    let outerCircleRadius = 60;
    let radiusForReferenceCircle = 150; //Radius!

    let dataC1GDP = dataSetCountry1.GrossDomesticProductPerCapita;
    let dataC1Prot = dataSetCountry1.AverageProteinSupply;
    let dataC1Obese = dataSetCountry1.PrevalenceOfObesityInTheAdultPop;
    let dataC1Under = dataSetCountry1.PrevalenceOfUndernourishment;

    let dataC2GDP = dataSetCountry2.GrossDomesticProductPerCapita;
    let dataC2Prot = dataSetCountry2.AverageProteinSupply;
    let dataC2Obese = dataSetCountry2.PrevalenceOfObesityInTheAdultPop;
    let dataC2Under = dataSetCountry2.PrevalenceOfUndernourishment;

    //Variablen für direkte Correlation über Corrline
    let select1 = 0;
    let select2 = 0;
    let corrlineOn = 0;
    let corrX1 = 0;
    let corrY1 = 0;
    let corrX2 = 0;
    let corrY2 = 0;
    let corrPearson;
    let corrSpearman;
    let corrlineColorScale = d3.scaleLinear().domain([0,100]).range(['#e52020','#33e520']);

    //Scale function for circles
    let scaleGDP = d3.scaleLinear().
    domain([0, 125000]).
    range([10, 150]);

    let scaleProt = d3.scaleLinear().
    domain([0, 150]).
    range([0, 50]);
    let scaleObese = d3.scaleLinear().
    domain([0, 100]).
    range([10, 50]);
    let scaleUnder = d3.scaleLinear().
    domain([0, 100]).
    range([10, 50]);

    //For tooltip
    let div = d3.select("body").append('div')
        .attr("class", "tooltip")
        .style("opacity", 0);

    //Color
    let color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain([0,10]);

    let colorobesity = d3.scaleLinear().domain([0,40]).range(['#33e520','#e52020']);
    let colorunder = d3.scaleLinear().domain([2,40]).range(['#f2a457','#e52020']);
    let colornounder = '#33e520';
    let colorBIP = '#4286f4';
    let colorProt = '#ffa0b9';

    /**
     * Correlation-Function
     */

    let corrlineDrawfunc = function (){
        if (corrlineOn === 1) {corrlineClearfunc();}
        if (select1 !== 0 && select2 !== 0) {
            Helper.getPearsonCoeffizient(timeLine1,timeLine2, function(value){corrPearson = value;});
            Helper.getSpearmanCoeffizient(timeLine1,timeLine2, function(value){corrSpearman = value;});
            let corrlineColorIndex = Math.abs((corrPearson+corrSpearman)/2*100);
            if (isNaN(corrlineColorIndex)){corrlineColorIndex=0;}

            if ((select1 === 4 && (select2 === 3 || select2 === 4)) || (select1 === 3 && select2 === 3)) {
                let lineGenerator = d3.line().curve(d3.curveCardinal);
                let points = [
                    [corrX1, corrY1],
                    [(corrX1+corrX2)/2, corrY1+50],
                    [corrX2, corrY2]
                ];
                let pathData = lineGenerator(points);

                svg.append('path')
                    .attr('id','corrline')
                    .attr('d', pathData)
                    .attr("stroke", corrlineColorScale(corrlineColorIndex))
                    .attr("stroke-width", "4")
                    .attr("fill","none")
            } else {
                svg.append("line")
                    .attr('id','corrline')
                    .attr("x1", corrX1)
                    .attr("y1", corrY1)
                    .attr("x2", corrX2)
                    .attr("y2", corrY2)
                    .attr("stroke", corrlineColorScale(corrlineColorIndex))
                    .attr("stroke-width", "4")
            }
            corrlineOn = 1;

            let corrlineLength = Math.sqrt((corrX2-corrX1)*(corrX2-corrX1)+(corrY2-corrY1)*(corrY2-corrY1));
            let corrOffset = ((corrlineLength -49)/2)/corrlineLength*100;

            svg.append("text")
                .attr('id','corrPearson')
                .attr('y','-4')
                .append("textPath")
                .attr('xlink:href','#corrline')
                .attr('startOffset', corrOffset+'%')
                .attr('font-size','12')
                .text("P: "+corrPearson);

            svg.append("text")
                .attr('id','corrSpearman')
                .attr('y','13')
                .append("textPath")
                .attr('xlink:href','#corrline')
                .attr('startOffset', corrOffset+'%')
                .attr('font-size','12')
                .text("S: "+corrSpearman);
        }
    };

    let corrlineClearfunc = function() {
        d3.select('#corrline').remove();
        d3.select('#corrPearson').remove();
        d3.select('#corrSpearman').remove();
        corrlineOn = 0;
    };

    /**
     * Country 1
     * ***/

    //Outer Circle1
    var referencCircleCountry1 = svg.append("circle")
        .attr('id', 'ReferenzKreis1')
        .attr("cx", originX)
        .attr("cy", originY)
        .attr("r", radiusForReferenceCircle)
        .attr("fill", "none");

    //PieChart1 überschreibt Outer Circle1
    let dataSet = [33, 33, 34];
    let outer = radiusForReferenceCircle + 2;
    let inner = radiusForReferenceCircle - 2;
    let piechart1ColorIndex0 = Math.abs((CoeffizientsRegion1.Obesity_Undernourishment_Pearson+CoeffizientsRegion1.Obesity_Undernourishment_Spearman)/2*100);
    if (isNaN(piechart1ColorIndex0)){piechart1ColorIndex0=0;}
    let piechart1ColorIndex1 = Math.abs((CoeffizientsRegion1.Protein_Undernourishment_Pearson+CoeffizientsRegion1.Protein_Undernourishment_Spearman)/2*100);
    if (isNaN(piechart1ColorIndex1)){piechart1ColorIndex1=0;}
    let piechart1ColorIndex2 = Math.abs((CoeffizientsRegion1.Protein_Obesity_Pearson+CoeffizientsRegion1.Protein_Obesity_Spearman)/2*100);
    if (isNaN(piechart1ColorIndex2)){piechart1ColorIndex2=0;}

    let arc = d3.arc()
        .innerRadius(inner)
        .outerRadius(outer);

    let pie = d3.pie();

    let arcs = svg.selectAll("g.arc")
        .data(pie(dataSet))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate("+outer+", "+inner+")");

    arcs.append("path")
        .attr("fill", function (d, i){
            if (i === 0)
                return corrlineColorScale(piechart1ColorIndex0);
            if (i === 1)
                return corrlineColorScale(piechart1ColorIndex1);
            if (i === 2)
                return corrlineColorScale(piechart1ColorIndex2);
        })
        .attr("d", arc)
        .attr("transform", "translate(49, 76)");

    svg.append("text")
        .attr('y','-4')
        .append("textPath")
        .attr('xlink:href','#ReferenzKreis1')
        .attr('startOffset', '90%')
        .attr('font-size','12')
        .text("P: "+CoeffizientsRegion1.Protein_Obesity_Pearson);

    svg.append("text")
        .attr('y','13')
        .append("textPath")
        .attr('xlink:href','#ReferenzKreis1')
        .attr('startOffset', '90%')
        .attr('font-size','12')
        .text("S: "+CoeffizientsRegion1.Protein_Obesity_Spearman);

    svg.append("text")
        .attr('y','-4')
        .append("textPath")
        .attr('xlink:href','#ReferenzKreis1')
        .attr('startOffset', '55%')
        .attr('font-size','12')
        .text("P: "+CoeffizientsRegion1.Protein_Undernourishment_Pearson);

    svg.append("text")
        .attr('y','13')
        .append("textPath")
        .attr('xlink:href','#ReferenzKreis1')
        .attr('startOffset', '55%')
        .attr('font-size','12')
        .text("S: "+CoeffizientsRegion1.Protein_Undernourishment_Spearman);

    svg.append("text")
        .attr('y','-4')
        .append("textPath")
        .attr('xlink:href','#ReferenzKreis1')
        .attr('startOffset', '72.5%')
        .attr('font-size','12')
        .attr('side','right')
        .text("P: "+CoeffizientsRegion1.Obesity_Undernourishment_Pearson);

    svg.append("text")
        .attr('y','13')
        .append("textPath")
        .attr('xlink:href','#ReferenzKreis1')
        .attr('startOffset', '72.5%')
        .attr('font-size','12')
        .attr('side','right')
        .text("S: "+CoeffizientsRegion1.Obesity_Undernourishment_Spearman);

    country1 = svg.selectAll("circle")
        .data(dataC1GDP)
        .enter()
        .append("circle")
        .attr("cx", originX)
        .attr("cy", originY)
        .attr("stroke", ()=>{
            if (dataC1GDP !== '999999')
                return colorBIP;
            else
                return "grey";
        })
        .attr("fill", ()=>{
            if (dataC1GDP !== '999999')
                return colorBIP;
            else
                return "grey";
        })
        .attr("r", () => {
            if (dataC1GDP !== '999999') {return scaleGDP(dataC1GDP);}
            else {return scaleGDP('10000');}
        })
        .on("mouseover", () => {
            let dataC1GDPStatement;
            if (dataC1GDP !== '999999')
                dataC1GDPStatement = dataC1GDP;
            else
                dataC1GDPStatement = 'Value not provided!';
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry1 + "<br/>" + "GDP "+selectedYear + "<br/>"+dataC1GDPStatement)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () => {
            DataProvider.getDataForTimeline(selectedCountry1, "22013", function(value){timeLine1 = value;});
            if (select1 === 1) {select1 = 0}
            else {select1 = 1;}
            corrX1 = originX;
            corrY1 = originY;
            d3.select('p#selectedValueForCountry1').text("GDP in "+selectedCountry1);
            corrlineDrawfunc();
            runGraph();
        });

    avgProteinSupplyCountry1 = svg.append('circle')
        .attr("cx", originX + ((radiusForReferenceCircle) * Math.sin(0)))
        .attr("cy", originY - ((radiusForReferenceCircle) * Math.cos(0)))
        .attr("stroke", ()=>{
            if (dataC1Prot !== '999999')
                return colorProt;
            else
                return "grey";
        })
        .attr("fill", ()=>{
            if (dataC1Prot !== '999999')
                return colorProt;
            else
                return "grey";
        })
        .attr("r", () => {
            if (dataC1Prot !== '999999') {return scaleProt(dataC1Prot);}
            else {return scaleProt('100');}
        })
        .on("mouseover", () => {
            let dataC1ProtStatement;
            if (dataC1Prot !== '999999')
                dataC1ProtStatement = dataC1Prot;
            else
                dataC1ProtStatement = 'Value not provided!';
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry1 + "<br/>" + "Protein "+selectedYear + "<br/>"+dataC1ProtStatement)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () => {
            DataProvider.getDataForTimeline(selectedCountry1, "21013", function(value){timeLine1 = value;});
            if (select1 === 2) {select1 = 0}
            else {select1 = 2;}
            corrX1 = avgProteinSupplyCountry1.node().getBBox().x + avgProteinSupplyCountry1.node().getBBox().width/2;
            corrY1 = avgProteinSupplyCountry1.node().getBBox().y + avgProteinSupplyCountry1.node().getBBox().height/2;
            d3.select('p#selectedValueForCountry1').text("Protein supply in "+selectedCountry1);
            corrlineDrawfunc();
            runGraph();

        });

    let lineToavgProteinSupplyCountry1ColorIndex = Math.abs((CoeffizientsRegion1.GDP_Protein_Pearson+CoeffizientsRegion1.GDP_Protein_Spearman)/2*100);
    if (isNaN(lineToavgProteinSupplyCountry1ColorIndex)){lineToavgProteinSupplyCountry1ColorIndex=0;}

    let lineToavgProteinSupplyCountry1 = svg.append("line")
        .attr("x1", originX)
        .attr("y1", originY-10)
        .attr("x2", avgProteinSupplyCountry1.node().getBBox().x + avgProteinSupplyCountry1.node().getBBox().width/2)
        .attr("y2", avgProteinSupplyCountry1.node().getBBox().y + avgProteinSupplyCountry1.node().getBBox().height)
        .attr("stroke", corrlineColorScale(lineToavgProteinSupplyCountry1ColorIndex))
        .attr("stroke-width", "4");

    svg.append("text")
        .attr('x','150')
        .attr('y','220')
        .attr('font-size','12')
        .text("P: "+CoeffizientsRegion1.GDP_Protein_Pearson);

    svg.append("text")
        .attr('x','205')
        .attr('y','220')
        .attr('font-size','12')
        .text("S: "+CoeffizientsRegion1.GDP_Protein_Spearman);

    let prevObesityCountry1 = svg.append('circle')
        .attr("cx", originX + ((radiusForReferenceCircle) * Math.sin(2.0944)))
        .attr("cy", originY - ((radiusForReferenceCircle) * Math.cos(2.0944)))
        .attr("stroke", ()=>{
            if (dataC1Obese !== '999')
                return colorobesity(dataC1Obese);
            else
                return "grey";
        })
        .attr("fill", ()=>{
            if (dataC1Obese !== '999')
                return colorobesity(dataC1Obese);
            else
                return "grey";
        })
        .attr("r", () => {
            if (dataC1Obese !== '999') {return scaleObese(dataC1Obese);}
            else {return scaleObese('2.5');}
        })
        .on("mouseover", () => {
            let dataC1ObeseStatement;
            if (dataC1Obese !== '999')
                dataC1ObeseStatement = dataC1Obese;
            else
                dataC1ObeseStatement = 'Value not provided!';
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry1 + "<br/>" + "Obesity % "+selectedYear + "<br/>"+dataC1ObeseStatement)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () => {
            DataProvider.getDataForTimeline(selectedCountry1, "21042", function(value){timeLine1 = value;});
            if (select1 === 3) {select1 = 0}
            else {select1 = 3;}
            corrX1 = prevObesityCountry1.node().getBBox().x + prevObesityCountry1.node().getBBox().width/2;
            corrY1 = prevObesityCountry1.node().getBBox().y + prevObesityCountry1.node().getBBox().height/2;
            d3.select('p#selectedValueForCountry1').text("Obesity in "+selectedCountry1);
            corrlineDrawfunc();
            runGraph();
        });

    let lineToPrevObesityCountry1ColorIndex = Math.abs((CoeffizientsRegion1.GDP_Obesity_Pearson+CoeffizientsRegion1.GDP_Obesity_Spearman)/2*100);
    if (isNaN(lineToPrevObesityCountry1ColorIndex)){lineToPrevObesityCountry1ColorIndex=0;}

    let lineToPrevObesityCountry1 = svg.append("line")
        .attr('id', 'Line_GDP1_Obesity1')
        .attr("x1", originX+8.66)
        .attr("y1", originY+5)
        .attr("x2", prevObesityCountry1.node().getBBox().x + 0.067 * prevObesityCountry1.node().getBBox().width)
        .attr("y2", prevObesityCountry1.node().getBBox().y + 0.25 *prevObesityCountry1.node().getBBox().height)
        .attr("stroke", corrlineColorScale(lineToPrevObesityCountry1ColorIndex))
        .attr("stroke-width", "4");

    svg.append("text")
        .attr('y','-4')
        .append("textPath")
        .attr('xlink:href','#Line_GDP1_Obesity1')
        .attr('startOffset', '30%')
        .attr('font-size','12')
        .text("P: "+CoeffizientsRegion1.GDP_Obesity_Pearson);

    svg.append("text")
        .attr('y','13')
        .append("textPath")
        .attr('xlink:href','#Line_GDP1_Obesity1')
        .attr('startOffset', '30%')
        .attr('font-size','12')
        .text("S: "+CoeffizientsRegion1.GDP_Obesity_Spearman);

    let prevUndernourishmentCountry1 = svg.append('circle')
        .attr("cx", originX + ((radiusForReferenceCircle) * Math.sin(-2.0944)))
        .attr("cy", originY - ((radiusForReferenceCircle) * Math.cos(-2.0944)))
        .attr("stroke", ()=> {
            if (dataC1Under !== '999')
                {if (parseFloat(dataC1Under)<= 2.5) return colornounder;
                else return colorunder(dataC1Under);}
            else
                return "grey";
        })
        .attr("fill", ()=>{
            if (dataC1Under !== '999')
                {if (parseFloat(dataC1Under)<= 2.5) return colornounder;
                else return colorunder(dataC1Under);}
            else
                return "grey";
        })
        .attr("r", () => {
            if (dataC1Under !== '999') {return scaleUnder(dataC1Under);}
            else {return scaleUnder('2.5');}
        })
        .on("mouseover", () => {
            let dataC1UnderStatement;
            if (dataC1Under !== '999')
                dataC1UnderStatement = dataC1Under;
            else
                dataC1UnderStatement = 'Value not provided!';
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry1 + "<br/>" + "Undernourishment % "+selectedYear + "<br/>"+dataC1UnderStatement)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () =>{
            DataProvider.getDataForTimeline(selectedCountry1, "210041", function(value){timeLine1 = value;});
            if (select1 === 4) {select1 = 0}
            else {select1 = 4;}
            corrX1 = prevUndernourishmentCountry1.node().getBBox().x + prevUndernourishmentCountry1.node().getBBox().width/2;
            corrY1 = prevUndernourishmentCountry1.node().getBBox().y + prevUndernourishmentCountry1.node().getBBox().height/2;
            d3.select('p#selectedValueForCountry1').text("Undernourishment in "+selectedCountry1);
            corrlineDrawfunc();
            runGraph();
        });

    let lineToPrevUndernourishmentCountry1ColorIndex = Math.abs((CoeffizientsRegion1.GDP_Undernourishment_Pearson+CoeffizientsRegion1.GDP_Undernourishment_Spearman)/2*100);
    if (isNaN(lineToPrevUndernourishmentCountry1ColorIndex)){lineToPrevUndernourishmentCountry1ColorIndex=0;}

    let lineToPrevUndernourishmentCountry1 = svg.append("line")
        .attr('id', 'Line_GDP1_Under1')
        .attr("x1", prevUndernourishmentCountry1.node().getBBox().x + 0.933 * prevUndernourishmentCountry1.node().getBBox().width)
        .attr("y1", prevUndernourishmentCountry1.node().getBBox().y + 0.25 * prevUndernourishmentCountry1.node().getBBox().height)
        .attr("x2", originX-8.66)
        .attr("y2", originY+5)
        .attr("stroke", corrlineColorScale(lineToPrevUndernourishmentCountry1ColorIndex))
        .attr("stroke-width", "4");

    svg.append("text")
        .attr('y','-4')
        .append("textPath")
        .attr('xlink:href','#Line_GDP1_Under1')
        .attr('startOffset', '40%')
        .attr('font-size','12')
        .text("P: "+CoeffizientsRegion1.GDP_Undernourishment_Pearson);

    svg.append("text")
        .attr('y','13')
        .append("textPath")
        .attr('xlink:href','#Line_GDP1_Under1')
        .attr('startOffset', '40%')
        .attr('font-size','12')
        .text("S: "+CoeffizientsRegion1.GDP_Undernourishment_Spearman);

    /**
     * Country 2
     * **/

    let referencCircle2 = svg.append("circle")
        .attr('id','ReferenzKreis2')
        .attr("cx", 500 + originX)
        .attr("cy", originY)
        .attr("r", radiusForReferenceCircle)
        .attr("fill", "none");

    //PieChart2 überschreibt Outer Circle2
    let piechart2ColorIndex0 = Math.abs((CoeffizientsRegion2.Obesity_Undernourishment_Pearson+CoeffizientsRegion2.Obesity_Undernourishment_Spearman)/2*100);
    if (isNaN(piechart2ColorIndex0)){piechart2ColorIndex0=0;}
    let piechart2ColorIndex1 = Math.abs((CoeffizientsRegion2.Protein_Undernourishment_Pearson+CoeffizientsRegion2.Protein_Undernourishment_Spearman)/2*100);
    if (isNaN(piechart2ColorIndex1)){piechart2ColorIndex1=0;}
    let piechart2ColorIndex2 = Math.abs((CoeffizientsRegion2.Protein_Obesity_Pearson+CoeffizientsRegion2.Protein_Obesity_Spearman)/2*100);
    if (isNaN(piechart2ColorIndex2)){piechart2ColorIndex2=0;}

    let arc2 = d3.arc()
        .innerRadius(inner)
        .outerRadius(outer);

    let pie2 = d3.pie();

    let arcs2 = svg.selectAll("g.arc")
        .data(pie(dataSet))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate("+outer+", "+inner+")");

    arcs.append("path")
        .attr("fill", function (d, i){
            if (i === 0)
                return corrlineColorScale(piechart2ColorIndex0);
            if (i === 1)
                return corrlineColorScale(piechart2ColorIndex1);
            if (i === 2)
                return corrlineColorScale(piechart2ColorIndex2);
        })
        .attr("d", arc)
        .attr("transform", "translate(549, 76)");

    svg.append("text")
        .attr('y','-4')
        .append("textPath")
        .attr('xlink:href','#ReferenzKreis2')
        .attr('startOffset', '90%')
        .attr('font-size','12')
        .text("P: "+CoeffizientsRegion2.Protein_Obesity_Pearson);

    svg.append("text")
        .attr('y','13')
        .append("textPath")
        .attr('xlink:href','#ReferenzKreis2')
        .attr('startOffset', '90%')
        .attr('font-size','12')
        .text("S: "+CoeffizientsRegion2.Protein_Obesity_Spearman);

    svg.append("text")
        .attr('y','-4')
        .append("textPath")
        .attr('xlink:href','#ReferenzKreis2')
        .attr('startOffset', '55%')
        .attr('font-size','12')
        .text("P: "+CoeffizientsRegion2.Protein_Undernourishment_Pearson);

    svg.append("text")
        .attr('y','13')
        .append("textPath")
        .attr('xlink:href','#ReferenzKreis2')
        .attr('startOffset', '55%')
        .attr('font-size','12')
        .text("S: "+CoeffizientsRegion2.Protein_Undernourishment_Spearman);

    svg.append("text")
        .attr('y','-4')
        .append("textPath")
        .attr('xlink:href','#ReferenzKreis2')
        .attr('startOffset', '72.5%')
        .attr('side','right')
        .attr('font-size','12')
        .text("P: "+CoeffizientsRegion2.Obesity_Undernourishment_Pearson);

    svg.append("text")
        .attr('y','13')
        .append("textPath")
        .attr('xlink:href','#ReferenzKreis2')
        .attr('startOffset', '72.5%')
        .attr('side','right')
        .attr('font-size','12')
        .text("S: "+CoeffizientsRegion2.Obesity_Undernourishment_Spearman);

    let country2 = svg.append("circle")
        .attr("cx", 500 + originX)
        .attr("cy", originY)
        .attr("stroke", ()=>{
            if (dataC2GDP !== '999999')
                return colorBIP;
            else
                return "grey";
        })
        .attr("fill", ()=>{
            if (dataC2GDP !== '999999')
                return colorBIP;
            else
                return "grey";
        })
        .attr("r", () => {
            if (dataC2GDP !== '999999') {return scaleGDP(dataC2GDP);}
            else {return scaleGDP('10000');}
        })
        .on("mouseover", () => {
            let dataC2GDPStatement;
            if (dataC2GDP !== '999999')
                dataC2GDPStatement = dataC2GDP;
            else
                dataC2GDPStatement = 'Value not provided!';
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry2 + "<br/>" + "GDP "+selectedYear + "<br/>"+dataC2GDPStatement)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () =>{
            DataProvider.getDataForTimeline(selectedCountry2, "22013", function(value){timeLine2 = value;});
            if (select2 === 1) {select2 = 0}
            else {select2 = 1;}
            corrX2 = originX+500;
            corrY2 = originY;
            d3.select('p#selectedValueForCountry2').text("GPD in "+selectedCountry2);
            corrlineDrawfunc();
            runGraph();
        });

    let avgProteinSupplyCountry2 = svg.append('circle')
        .attr("cx", 500 + originX + ((radiusForReferenceCircle) * Math.sin(0)))
        .attr("cy", originY - ((radiusForReferenceCircle) * Math.cos(0)))
        .attr("stroke", ()=>{
            if (dataC2Prot !== '999999')
                return colorProt;
            else
                return "grey";
        })
        .attr("fill", ()=>{
            if (dataC2Prot !== '999999')
                return colorProt;
            else
                return "grey";
        })
        .attr("r", () => {
            if (dataC2Prot !== '999999') {return scaleProt(dataC2Prot);}
            else {return scaleProt('100');}
        })
        .on("mouseover", () => {
            let dataC2ProtStatement;
            if (dataC2Prot !== '999999')
                dataC2ProtStatement = dataC2Prot;
            else
                dataC2ProtStatement = 'Value not provided!';
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry2 + "<br/>" + "Protein Supply "+selectedYear + "<br/>"+dataC2ProtStatement)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () => {
            DataProvider.getDataForTimeline(selectedCountry2, "21013", function(value){timeLine2 = value;});
            if (select2 === 2) {select2 = 0}
            else {select2 = 2;}
            corrX2 = avgProteinSupplyCountry2.node().getBBox().x + avgProteinSupplyCountry2.node().getBBox().width/2;
            corrY2 = avgProteinSupplyCountry2.node().getBBox().y + avgProteinSupplyCountry2.node().getBBox().height/2;
            d3.select('p#selectedValueForCountry2').text("Protein Supply in "+selectedCountry2);
            corrlineDrawfunc();
            runGraph();
        });

    let lineToavgProteinSupplyCountry2ColorIndex = Math.abs((CoeffizientsRegion2.GDP_Protein_Pearson+CoeffizientsRegion2.GDP_Protein_Spearman)/2*100);
    if (isNaN(lineToavgProteinSupplyCountry2ColorIndex)){lineToavgProteinSupplyCountry2ColorIndex=0;}

    let lineToavgProteinSupplyCountry2 = svg.append("line")
        .attr("x1", 500 + originX)
        .attr("y1", originY-10)
        .attr("x2", avgProteinSupplyCountry2.node().getBBox().x + avgProteinSupplyCountry2.node().getBBox().width/2)
        .attr("y2", avgProteinSupplyCountry2.node().getBBox().y + avgProteinSupplyCountry2.node().getBBox().height)
        .attr("stroke", corrlineColorScale(lineToavgProteinSupplyCountry2ColorIndex))
        .attr("stroke-width", "4");

    svg.append("text")
        .attr('font-size','12')
        .attr('x','650')
        .attr('y','220')
        .text("P: "+CoeffizientsRegion2.GDP_Protein_Pearson);

    svg.append("text")
        .attr('font-size','12')
        .attr('x','705')
        .attr('y','220')
        .text("S: "+CoeffizientsRegion2.GDP_Protein_Spearman);

    let prevObesityCountry2 = svg.append('circle')
        .attr("cx", 500 + originX + ((radiusForReferenceCircle) * Math.sin(2.0944)))
        .attr("cy", originY - ((radiusForReferenceCircle) * Math.cos(2.0944)))
        .attr("stroke", ()=>{
            if (dataC2Obese !== '999')
                return colorobesity(dataC2Obese);
            else
                return "grey";
        })
        .attr("fill", ()=>{
            if (dataC2Obese !== '999')
                return colorobesity(dataC2Obese);
            else
                return "grey";
        })
        .attr("r", () => {
            if (dataC2Obese !== '999') {return scaleObese(dataC2Obese);}
            else {return scaleObese('2.5');}
        })
        .on("mouseover", () => {
            let dataC2ObeseStatement;
            if (dataC2Obese !== '999')
                dataC2ObeseStatement = dataC2Obese;
            else
                dataC2ObeseStatement = 'Value not provided!';
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry2 + "<br/>" + "Obesity % "+selectedYear + "<br/>"+dataC2ObeseStatement)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () =>{
            DataProvider.getDataForTimeline(selectedCountry2, "21042", function(value){timeLine2 = value;});
            if (select2 === 3) {select2 = 0}
            else {select2 = 3;}
            corrX2 = prevObesityCountry2.node().getBBox().x + prevObesityCountry2.node().getBBox().width/2;
            corrY2 = prevObesityCountry2.node().getBBox().y + prevObesityCountry2.node().getBBox().height/2;
            d3.select('p#selectedValueForCountry2').text("Obesity in "+selectedCountry2);
            corrlineDrawfunc();
            runGraph();
        });

    let lineToPrevObesityCountry2ColorIndex = Math.abs((CoeffizientsRegion2.GDP_Obesity_Pearson+CoeffizientsRegion2.GDP_Obesity_Spearman)/2*100);
    if (isNaN(lineToPrevObesityCountry2ColorIndex)){lineToPrevObesityCountry2ColorIndex=0;}

    let lineToPrevObesityCountry2 = svg.append("line")
        .attr('id','Line_GDP2_Obesity2')
        .attr("x1", 500 + originX + 8.66)
        .attr("y1", originY + 5)
        .attr("x2", prevObesityCountry2.node().getBBox().x + 0.067 * prevObesityCountry2.node().getBBox().width)
        .attr("y2", prevObesityCountry2.node().getBBox().y + 0.25 * prevObesityCountry2.node().getBBox().height)
        .attr("stroke", corrlineColorScale(lineToPrevObesityCountry2ColorIndex))
        .attr("stroke-width", "4");

    svg.append("text")
        .attr('y','-4')
        .append("textPath")
        .attr('xlink:href','#Line_GDP2_Obesity2')
        .attr('startOffset', '30%')
        .attr('font-size','12')
        .text("P: "+CoeffizientsRegion2.GDP_Obesity_Pearson);

    svg.append("text")
        .attr('y','13')
        .append("textPath")
        .attr('xlink:href','#Line_GDP2_Obesity2')
        .attr('startOffset', '30%')
        .attr('font-size','12')
        .text("S: "+CoeffizientsRegion2.GDP_Obesity_Spearman);

    let prevUndernourishmentCountry2 = svg.append('circle')
        .attr("cx", 500 + originX + ((radiusForReferenceCircle) * Math.sin(-2.0944)))
        .attr("cy", originY - ((radiusForReferenceCircle) * Math.cos(-2.0944)))
        .attr("stroke", ()=>{
            if (dataC2Under !== '999')
                {if (parseFloat(dataC2Under)<= 2.5) return colornounder;
                else return colorunder(dataC2Under);}
            else
                return "grey";
        })
        .attr("fill", ()=>{
            if (dataC2Under !== '999')
                {if (parseFloat(dataC2Under)<= 2.5) return colornounder;
                else return colorunder(dataC2Under);}
            else
                return "grey";
        })
        .attr("r", () => {
            if (dataC2Under !== '999') {return scaleUnder(dataC2Under);}
            else {return scaleUnder('2.5');}
        })
        .on("mouseover", () => {
            let dataC2UnderStatement;
            if (dataC2Under !== '999')
                dataC2UnderStatement = dataC2Under;
            else
                dataC2UnderStatement = 'Value not provided!';
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("" + selectedCountry2 + "<br/>" + "Undernourishment % "+selectedYear + "<br/>"+dataC2UnderStatement)
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px");
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", () =>{
            DataProvider.getDataForTimeline(selectedCountry2, "210041", function(value){timeLine2 = value;});
            if (select2 === 4) {select2 = 0}
            else {select2 = 4;}
            corrX2 = prevUndernourishmentCountry2.node().getBBox().x + prevUndernourishmentCountry2.node().getBBox().width/2;
            corrY2 = prevUndernourishmentCountry2.node().getBBox().y + prevUndernourishmentCountry2.node().getBBox().height/2;
            d3.select('p#selectedValueForCountry2').text("Undernourishment in "+selectedCountry2);
            corrlineDrawfunc();
            runGraph();
        });

    let lineToPrevUndernourishmentCountry2ColorIndex = Math.abs((CoeffizientsRegion2.GDP_Undernourishment_Pearson+CoeffizientsRegion2.GDP_Undernourishment_Spearman)/2*100);
    if (isNaN(lineToPrevUndernourishmentCountry2ColorIndex)){lineToPrevUndernourishmentCountry2ColorIndex=0;}

    let lineToPrevUndernourishmentCountry2 = svg.append("line")
        .attr('id','Line_GDP2_Under2')
        .attr("x1", prevUndernourishmentCountry2.node().getBBox().x + 0.933 *prevUndernourishmentCountry2.node().getBBox().width)
        .attr("y1", prevUndernourishmentCountry2.node().getBBox().y + 0.25 * prevUndernourishmentCountry2.node().getBBox().height)
        .attr("x2", 500 + originX -8.66)
        .attr("y2", originY + 5)
        .attr("stroke", corrlineColorScale(lineToPrevUndernourishmentCountry2ColorIndex))
        .attr("stroke-width", "4");

    svg.append("text")
        .attr('y','-4')
        .append("textPath")
        .attr('xlink:href','#Line_GDP2_Under2')
        .attr('startOffset', '40%')
        .attr('font-size','12')
        .text("P: "+CoeffizientsRegion1.GDP_Undernourishment_Pearson);

    svg.append("text")
        .attr('y','13')
        .append("textPath")
        .attr('xlink:href','#Line_GDP2_Under2')
        .attr('startOffset', '40%')
        .attr('font-size','12')
        .text("S: "+CoeffizientsRegion1.GDP_Undernourishment_Spearman);


}

function drawSlider(){
    // Time
    let dataTime = d3.range(0, 18).map(function(d) {
        return new Date(2000 + d, 10, 3);
    });

    let sliderTime = d3
        .sliderBottom()
        .min(d3.min(dataTime))
        .max(d3.max(dataTime))
        .step(1000 * 60 * 60 * 24 * 365)
        .width(600)
        .tickFormat(d3.timeFormat('%Y'))
        .tickValues(dataTime)
        .default(new Date(2004, 10, 3))
        .on('onchange', val => {
            //d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
            selectedYear = d3.timeFormat('%Y')(val);
            loadNewValues();
        });

    let gTime = d3
        .select('div#slider-time')
        .append('svg')
        .attr('width', '100%')
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(150,30)');

    gTime.call(sliderTime);

    //d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));//*/
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
    DataProvider.getDataForCountryAndYear(selectedCountry1, parseInt(selectedYear), function(value){dataSetCountry1 = value;});
    DataProvider.getDataForCountryAndYear(selectedCountry2, parseInt(selectedYear), function(value){dataSetCountry2 = value;});
    Helper.getCoeffizientsForRegion(selectedCountry1, function(value){CoeffizientsRegion1 = value;});
    Helper.getCoeffizientsForRegion(selectedCountry2, function(value){CoeffizientsRegion2 = value;});
    draw();
}

function init(){
    loadNewValues();
    DataProvider.getDataForTimeline(selectedCountry1, "22013", function(value){timeLine1 = value;});
    DataProvider.getDataForTimeline(selectedCountry2, "22013", function(value){timeLine2 = value;});
    Helper.getCoeffizientsForRegion(selectedCountry1, function(value){CoeffizientsRegion1 = value;});
    Helper.getCoeffizientsForRegion(selectedCountry2, function(value){CoeffizientsRegion2 = value;});
    Helper.get1DatasetFrom2Timelines(timeLine1, timeLine1, drawGraphs);
}

function runGraph(){
    console.log("SVGGraph "+svgGraph);
    graph.remove();
    while(svgGraph.lastChild){
        svgGraph.removeChild(svgGraph.lastChild);
    }
    Helper.get1DatasetFrom2Timelines(timeLine1, timeLine2, drawGraphs);

}

