/**
 * Visualization module
 */
var Visualization = function () {
    var _greeting;

    return {
        /**
         * Create the visualisation. This is the main application entry point.
         */
        draw: function () {
            d3.json("data/geodata.json", function(error, data){
                var dataTime = d3.range(0, 17).map(function(d) {
                    return new Date(2000 + d, 10, 3);
                });
                var year = "2010";
                var min = d3.min(dataTime);
                var max = d3.max(dataTime);

                var svg = d3.select('svg');
                var sidebar = d3.select('.sidebar_container').select('svg');

                var width  = window.innerWidth;
                var height = window.innerHeight;
                var sidebarWidth = sidebar.node().getBoundingClientRect().width;
                var sidebarHeight = sidebar.node().getBoundingClientRect().height;
                console.log("W: " + width + " / H: " + height);

                var projection = d3.geoMercator().scale(175).translate([(width/2)-200, (height/2)+100]);
                    
                var path = d3.geoPath()
                .projection(projection);
                var fontSize = 18;
                var circleOffset;
                var hover = true;
                var view = "World";
                var cont = "";
                var CompareList = [];

                function ColorScaleYear(code, value, year) {
                    var myScale = d3.scaleLinear()
                    .domain([DataProvider.getMinValueYear(code, year).Value,0,DataProvider.getMaxValueYear(code, year).Value])
                    .range(['red', 'yellow', 'green']);         
                    var ColorCode = myScale(value);
                    if (ColorCode == ("rgb(0, 0, 0)") || year == "2001") {
                        return "rgb(150, 150, 150)";
                    }
                    //console.log("Looking up: "+value+" results in "+ColorCode);
                    return ColorCode;
                }

                function SizeScaleYear(code, value, year) {
                    var myScale = d3.scalePow()
                    .exponent(2)
                    .domain([DataProvider.getMinValueYear(code, year).Value,DataProvider.getMaxValueYear(code, year).Value])
                    .range([0,200]);          
                    var ColorCode = myScale(value);
                    return ColorCode;
                }

                function SizeScaleYearSidebar(code, value, year) {
                    var myScale = d3.scalePow()
                    .exponent(2)
                    .domain([DataProvider.getMinValueYear(code, year).Value,DataProvider.getMaxValueYear(code, year).Value])
                    .range([0,50]);          
                    var ColorCode = myScale(value);
                    return ColorCode;
                }

                function removeCountryFromList(iso_a3, year){
                    for (var i = 0; i<CompareList.length;i++) {
                        if (CompareList[i][0] == iso_a3 && CompareList[i][1] == year) {
                            CompareList.splice(i,1);
                        }
                    }
                    drawList();
                }

                function drawList() {
                    var previousCircleOffset = 0;
                    var yPosCircleSidebar = 0;
                    var circleOffset = [];
                    var i;
                    sidebar.selectAll('circle').remove();
                    sidebar.selectAll("foreignObject").remove();
                    sidebar.selectAll('text').remove();

                    for (i=0; i<CompareList.length;i++) {
                        sidebar.append('circle')
                            .attr('id', function(d) {
                                return "circleSidebar-"+CompareList[i][0];
                            })
                            .attr('r',function(d){ 
                                circleOffset[i] = new Array(CompareList[i][0],SizeScaleYearSidebar('22013', DataProvider.getValuebyiso(CompareList[i][0],CompareList[i][1],"22013"), CompareList[i][1]));
                                if (circleOffset[i][1] == false || circleOffset[i][1] == undefined || circleOffset[i][1] !== circleOffset[i][1]) {
                                    circleOffset[i][1] = 0;
                                }
                                return 15+circleOffset[i][1]; 
                            })
                            .attr('cx', function(d) {
                                return 30+circleOffset[i][1];
                            })
                            .attr('cy', function(d) {
                                if (yPosCircleSidebar == 0) {
                                    yPosCircleSidebar = 30 + circleOffset[i][1];
                                    previousCircleOffset = circleOffset[i][1];
                                    circleOffset[i][2] = yPosCircleSidebar;
                                    return yPosCircleSidebar
                                }
                                yPosCircleSidebar += 80 + previousCircleOffset + circleOffset[i][1];
                                previousCircleOffset = circleOffset[i][1];
                                circleOffset[i][2] = yPosCircleSidebar;
                                return yPosCircleSidebar;                      
                            })
                            .attr('stroke','black')
                            .attr('fill', function(d) {
                                //dynamically change color of the circle diagram
                                var circleColor = ColorScaleYear('21032', DataProvider.getValuebyiso(CompareList[i][0],CompareList[i][1],"21032"), CompareList[i][1]);
                                var circlePercent;
                                var tempData = DataProvider.getValuebyiso(CompareList[i][0],CompareList[i][1],"210041");
                                if (tempData == "<2.5") {
                                    circlePercent = "2.5";
                                } else if (tempData == false || tempData == undefined)
                                {
                                    circlePercent = "100";

                                    sidebar.append("text")
                                    .attr("x", function(){
                                        //nutzt "d" der fill funktion
                                        return 30 + circleOffset[i][1];                                  
                                    })
                                    .attr("y", function(){
                                        return 5 + circleOffset[i][2];
                                    })
                                    .attr("text-anchor", "middle") 
                                    .attr("font-weight", "bold")
                                    .style('fill', function(d){return circleColor;})
                                    .style("font-size", "14px")
                                    .text("n.a.");

                                    return "url(#diagonalSchraffur)";
                                } else {
                                    circlePercent = tempData;
                                }

                                var gradSidebar = sidebar.append("defs")
                                    .append("linearGradient")
                                    .attr("id", function (d) {
                                        return "gradient-"+CompareList[i][0]+CompareList[i][1];
                                    })
                                    .attr("x1", "0%")
                                    .attr("x2", "0%")
                                    .attr("y1", "100%")
                                    .attr("y2", "0%");

                                gradSidebar.append("stop")
                                    .attr("offset", "0%")
                                    .transition()
                                    .style("stop-color", function (d) {
                                        return ColorScaleYear('21032', DataProvider.getValuebyiso(CompareList[i][0],CompareList[i][1],"21032"), CompareList[i][1]);
                                    })
                                    .attr("offset", function(d) {
                                        return (100-parseInt(circlePercent)) + "%";
                                    });;

                                gradSidebar.append("stop")
                                    .attr("offset", "0%")
                                    .transition()
                                    .style("stop-color", "white")
                                    .attr("offset", function(d) {
                                        return (100-parseInt(circlePercent)) + "%";
                                    });

                                return ("url(#gradient-"+CompareList[i][0]+CompareList[i][1]+")");
                            })
                            .on("click", function(d, i) {
                                removeCountryFromList(CompareList[i][0]);
                            });

                        sidebar.selectAll("foreignObject")
                            .data(data.features)
                            .enter()
                            .filter(function(d) {
                                if (CompareList[i].includes(d.properties.iso_a3)) {
                                    return d.properties.iso_a3;
                                }
                            })  
                            .append("foreignObject")
                            .attr("width", function (d) {
                                return sidebarWidth-circleOffset[i][1]*2;
                            })
                            .attr("height", function (d) {
                                return 100;
                            })
                            .attr("x", function(d){
                                return 60+circleOffset[i][1]*2;
                            })
                            .attr("y", function(d){
                                //yPosCircleSidebar = sidebar.selectAll("circle[id='circleSidebar-"+CompareList[i][0]+"']").attr('cy');
                                return circleOffset[i][2]-(2.5*fontSize);
                            })
                            .append("xhtml:body")
                            .html(function(d) {
                                var undernourishment = DataProvider.getValuebyiso(CompareList[i][0],CompareList[i][1],"210041");
                                if (undernourishment == undefined || undernourishment == "") {
                                    undernourishment = "n.a."
                                }
                                var GDP = DataProvider.getValuebyiso(CompareList[i][0],CompareList[i][1],"22013");
                                if (GDP == undefined || GDP == "") {
                                    GDP = "n.a."
                                }
                                var politicalStability = DataProvider.getValuebyiso(CompareList[i][0],CompareList[i][1],"21032");
                                if (politicalStability == undefined || politicalStability == "") {
                                    politicalStability = "n.a."
                                }
                                return "<p><b>"+d.properties.name+" ("+CompareList[i][1]+")</b><br>Undernourishment: "+undernourishment+"<br>GDP: "+GDP+"<br>Political stability: "+politicalStability+"</p>";
                            })
                            .on("click", function(d) {
                                removeCountryFromList(CompareList[i][0]);
                            });
                    }
                }
                    
                function handleMouseOver(continent, country) {
                    if(hover){
                        switch(view){
                        case"World":
                            svg.selectAll('path')
                            .filter(function(d) { return d.properties.continent != continent })
                            .transition().duration(100)
                            .attr('opacity', 0.3);
                        break;
                        case"Continent":
                            if (continent == cont){
                                svg.selectAll('path')
                                .filter(function(d) { return d.properties.name != country})
                                .filter(function(d) { return d.properties.continent == cont})
                                .transition().duration(100)
                                .attr('opacity', 0.3);

                                //define gradient for the circle diagram
                                var grad = svg.append("defs").append("linearGradient").attr("id", "grad")
                                .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
                                    grad.append("stop").attr("offset", "0%").style("stop-color", "black");
                                    grad.append("stop").attr("offset", "0%").style("stop-color", "white");

                                // define "Schraffur" for "n.a." in the circle diagram
                                svg.select("defs")
                                    .append("pattern")
                                        .attr("id", "diagonalSchraffur")
                                        .attr("patternUnits", "userSpaceOnUse")
                                        .attr("width", "10")
                                        .attr("height", "10")
                                    .append("image")
                                        .attr("href", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J2dyZXknIHN0cm9rZS13aWR0aD0nMScvPgo8L3N2Zz4K")
                                        .attr("x", "0")
                                        .attr("y", "0")
                                        .attr("width", "10")
                                        .attr("height", "10");
                                
                                svg.selectAll('circle')
                                .data(data.features)
                                .enter()
                                .filter(function(d) { return d.properties.name == country})
                                .append('circle')
                                .attr('id', 'hoverCircle')
                                .attr('r',function(d){ 
                                    circleOffset = SizeScaleYear('22013', DataProvider.getValuebyiso(d.properties.iso_a3,year,"22013"), year);
                                    if (circleOffset == false || circleOffset == undefined || circleOffset !== circleOffset) {
                                        circleOffset = 0;
                                    }
                                    return 20+circleOffset; 
                                })
                                .attr('cx', function(d) {
                                    if (d.properties.name == country) {
                                        return d3.mouse(this)[0]+40+circleOffset;
                                    }
                                })
                                .attr('cy', function(d) {
                                    if (d.properties.name == country) {
                                        return d3.mouse(this)[1];
                                    }
                                })
                                .attr('stroke','black')
                                .attr('fill', function(d,i) {
                                    //dynamically change color of the circle diagram
                                    var circleColor = ColorScaleYear('21032', DataProvider.getValuebyiso(d.properties.iso_a3,year,"21032"), year);
                                    var circlePercent;
                                    var tempData = DataProvider.getValuebyiso(d.properties.iso_a3,year,"210041");
                                    if (tempData == "<2.5") {
                                        circlePercent = "2.5";
                                    } else if (tempData == false || tempData == undefined)
                                    {
                                        circlePercent = "100";

                                        svg.append("text")
                                        .attr("x", function(d){return d3.mouse(this)[0]+40+circleOffset;})
                                        .attr("y", function(d){return d3.mouse(this)[1]+5;})
                                        .attr("text-anchor", "middle") 
                                        .attr("font-weight", "bold")
                                        .style('fill', function(d){return circleColor;})
                                        .style("font-size", "18px")
                                        .text("n.a.");

                                        return "url(#diagonalSchraffur)";
                                    } else {
                                        circlePercent = tempData;
                                    }
                                    //console.log(circlePercent);
                                    svg.selectAll("stop")
                                        .attr("offset","0%")
                                        .transition()
                                        .style("stop-color", function(d,i) {
                                            if (i === 0) {
                                                return circleColor;
                                            }
                                            return "white";
                                        })
                                        .attr("offset", function(d,i) {
                                            return (100-parseInt(circlePercent)) + "%";
                                        });

                                    return "url(#grad)";
                                });
                                //console.log(svg);
                                svg.append("text")
                                .attr("x", function(d){return d3.mouse(this)[0]+40+circleOffset;})
                                .attr("y", function(d){return d3.mouse(this)[1]-40-circleOffset;})
                                .attr("font-weight", "bold")
                                .attr("text-anchor", "middle")
                                .style('fill', "black")
                                .style("font-size", "18px")
                                .text(country);
                            }
                        
                        break;
                      default:
                        break;
                      }
                    }
                  }

                function handleMouseOut() {
                    if(hover){
                        switch(view){
                        case"World":
                            svg.selectAll('path')
                                .transition().duration(300)
                                .attr('opacity', 1);
                        break;
                        case"Continent":
                            svg.selectAll('path')
                                .filter(function(d) { return d.properties.continent == cont })
                                .transition().duration(300)
                                .attr('opacity', 1);

                            svg.selectAll('circle').remove();
                            svg.selectAll('text').remove();
                            break;
                        default:
                            break;
                        }
                    }
                }
                
                function handleMouseClick(continent, iso_a3) {
                    console.log(continent + ' ' + iso_a3);
                    hover = false;
                    switch(view){
                    case"World":
                        // dont do anything if you just click the background
                        if (continent == undefined) return;

                        view = "Continent";
                        cont = continent;
                        
                        // den angeklickten Kontinent hervorheben
                        var transformString = "";
                        switch(continent){
                        case"Europe":
                            //W: 1920 / H: 943
                            //transformString = "translate(" + ((-1.1458*(width/1920))*width) + "," + ((-0.6362*(height/943))*height) + ")scale(3)";
                            transformString = "translate(" + (-0.85*width) + "," + (-0.74*height) + ")scale(3)";
                            break;
                        case"North America":
                            //transformString = "translate(" + ((-0.2083*(width/1920))*width) + "," + ((-0.4241*(height/943))*height) + ")scale(2)";
                            transformString = "translate(" + (-0.1*width) + "," + (-0.45*height) + ")scale(2)";
                            break;
                        case"South America":
                            transformString = "translate(" + (-0.35*width) + "," + (-1.27*height) + ")scale(2.5)";
                            break;
                        case"Asia":
                            transformString = "translate(" + (-1*width) + "," + (-0.9*height) + ")scale(2.5)";
                            break;
                        case"Africa":
                            transformString = "translate(" + (-0.7*width) + "," + (-1.1*height) + ")scale(2.5)";
                            break;
                        case"Oceania":
                            transformString = "translate(" + (-2.15*width) + "," + (-2.35*height) + ")scale(4)";
                            break;
                        default:
                            break;
                        }
                        //console.log(transformString);
                        svg.selectAll('path')
                        .filter(function(d) { return d.properties.continent == continent })
                        .transition().duration(300)
                        .attr("transform", transformString)
                        .attr('fill',  function(d, i) {
                            return ColorScaleYear ('21032', DataProvider.getValuebyiso(d.properties.iso_a3,year,"21032"),year);
                        })
                        .on('end', function (){
                            hover = true;
                        });
                        // alle nicht angeklickten Kontinente ausblenden
                        svg.selectAll('path')
                            .filter(function(d) { return d.properties.continent != continent })
                            .transition().duration(300)
                            .attr("transform", transformString)
                            .attr('opacity', 0);
                        break;
                    case"Continent":
                        //Add selected Country to List
                        if (continent == cont){
                            //and remove it, if it is in the List
                            var alreadyInList = false;
                            for (var i = 0; i < CompareList.length; i++) {
                                if (CompareList[i][0] == iso_a3 && CompareList[i][1] == year) {
                                    removeCountryFromList(iso_a3, year);
                                    alreadyInList = true;
                                }
                            }
                            if (alreadyInList == false) {
                                if (CompareList.length == 7) {
                                    removeCountryFromList(CompareList[0][0], CompareList[0][1]);
                                }
                                CompareList[CompareList.length] = new Array(iso_a3,year);
                            }
                            console.log(CompareList);
                            drawList();
                            hover = true;
                            break; 
                        }
                        else{
                            // scale back if you just click the background or another continent
                            view = "World";

                            // alle kreise entfernen
                            svg.selectAll('circle').remove();
                            svg.selectAll('text').remove();
                            
                            //aktuellen Kontinent in Regionen einfärben
                            svg.selectAll('path')
                                .filter(function(d) { return d.properties.continent == cont})
                                .attr('fill',  function(d, i) {
                                    return ColorScaleYear ('21032', DataProvider.getAverageForRegion(d.properties.subregion,year,"21032"),year);
                                });
                            
                            //alle Kontinente einblenden
                            svg.selectAll('path')
                                .transition().duration(300)
                                .attr("transform", "")
                                .attr('opacity', 1)
                                .on('end', function (){
                                    hover = true;
                                });

                            cont = null;
                            break;
                            }
                    default:
                        break;
                    }
                };

                // background rect for select continents 
                svg.append("rect")
                    .attr("class", "background")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("fill", "white")
                    .on("click", function(d, i) {
                        handleMouseClick();
                    });
                    
                svg.selectAll('path')
                .data(data.features)
                .enter()
                .append('path')
                .attr('d', function(d) { 
                    return path(d)
                    })
                .attr('data-country', function(d) { 
                    return d.properties.name;
                    })
                .attr('fill',  function(d, i) {
                    return ColorScaleYear('21032', DataProvider.getAverageForRegion(d.properties.subregion,year,"21032"),year);
                })
                .on("mouseover", function(d, i) {
                    handleMouseOver(d.properties.continent, d.properties.name);
                })
                .on("mouseout", function(d, i) {
                    handleMouseOut(d.properties.continent);
                })
                .on("click", function(d, i) {
                    handleMouseClick(d.properties.continent, d.properties.iso_a3);
                    });

                var sliderTime = d3.sliderBottom()
                .min(min)
                .max(max)
                .step(1000 * 60 * 60 * 24 * 365)
                .width(600)
                .tickFormat(d3.timeFormat('%Y'))
                .tickValues(dataTime)
                .default(new Date(year, 10, 3))
                .on("end", val => {
                    year = d3.timeFormat('%Y')(val);
                    console.log("New Year is: " + year);
                    //immer alles außer den aktuellen Kontinent in Regionen einfärben
                    //bei World view ist cont == null, es wird also alles in Regionen eingefärbe
                    svg.selectAll('path')
                    .filter(function(d) { return d.properties.continent != cont })
                    .attr('fill',  function(d, i) {
                        return ColorScaleYear ('21032', DataProvider.getAverageForRegion(d.properties.subregion,year,"21032"),year);
                    });

                    //bei Continent view wird der aktuelle Kontinent in Länder eingefärbt
                    if (view == "Continent"){
                        svg.selectAll('path')
                        .filter(function(d) { return d.properties.continent == cont })
                        .attr('fill',  function(d, i) {
                            return ColorScaleYear ('21032', DataProvider.getValuebyiso(d.properties.iso_a3,year,"21032"),year);
                        });
                    }
                    // alle nach region was != cont 
                    // if view = cont continent nach iso einfärben
                    //drawGeodata();
                });

                var gTime = d3
                    .select('div#slider')
                    .append('svg')
                    .append('g')
                    .attr('transform', 'translate(' + (width-616)/2 + ',30)');

                gTime.call(sliderTime);


                
                var svg_img = d3.select('div#slider').select('svg');

                var myimage = svg_img.append('image')
                    .attr('xlink:href', "data/legend_bottem.jpg")
                    .attr('width', "500")
                    .attr('height', "100")
                    .attr('transform', 'translate('+ (width-500)/2 + ',70)');
            })
            
        }
    }
}(); 
