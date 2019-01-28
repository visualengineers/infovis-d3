<template>
  <div id="app">
    <b-container>
      <b-row>
        <b-col class="headline">
          <h2>Statistics</h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button-group>
              <b-button
                v-for="item in regionOptions"
                :key="item.id"
                :pressed.sync="item.state"
                v-on:click="push(item)"
                v-bind:id="item.id">
              {{ item.text }}
              </b-button>
          </b-button-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12">
          <vue-slider
              v-model="selectedYear"
              v-bind="sliderOptions"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div id="chart"></div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-row>
          X-Axis: GDP (PPP) in I$
           </b-row>
           <b-row>
          Y-Axis: Stability (Index)
           </b-row>
           <b-row>
           Size: Obesity (18 years and older) in %
           </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import vueSlider from "vue-slider-component";
import * as d3 from "d3";
import { dataProvider } from "./helper/dataprovider";

export default {
  name: "app",
  components: {
    vueSlider
  },
  data() {
    return {
      focus: "",
      height: 600,
      width: 1000,
      paddingX: 100, // should be double of the max circle size
      paddingY: 100, // should be double of the max circle size
      svg: null,
      circleSize: { min: 5, max: 50 },
      circleRadiusScale: null,
      rangeXScale: null,
      rangeYScale: null,
      values: null,
      gdp: {
        max: null,
        min: null
      },
      stability: {
        max: null,
        min: null
      },
      obesity: {
        max: null,
        min: null
      },
      selectedRegions: [],
      regionOptions: [],
      sliderOptions: {
        width: "100%",
        tooltip: "hover",
        piecewise: true,
        piecewiseLabel: true,
        data: ["0", "1"],
        piecewiseStyle: {
          backgroundColor: "#ccc",
          visibility: "visible",
          width: "12px",
          height: "12px"
        },
        piecewiseActiveStyle: {
          backgroundColor: "#3498db"
        },
        labelActiveStyle: {
          color: "#3498db"
        }
      },
      selectedYear: "0",
      yearRangeMin: null,
      setupDone: false
    };
  },
  watch: {
    selectedYear: function() {
      if (this.setupDone) {
        this.createCircles();
      }
    }
  },
  mounted: async function() {
    // here d3 implementation
    await this.init();

    // svg
    await this.buildSVG(); // build svg

    // circles
    this.createCircles();
    this.createXAxis();
    this.createYAxis();
  },
  methods: {
    init() {
      const that = this;
      return new Promise(resolve => {
        dataProvider.getValues("2016").then(response => {
          // console.log(response);
          // ------------ VALUES ------------
          this.values = response.values;

          // ------------ SLIDER ------------
          this.sliderOptions.data = response.years;
          this.selectedYear = response.years[0];

          // ------------ GDP MIN/MAX ------------
          this.gdp.max = response.gdpMax;
          this.gdp.min = response.gdpMin;

          // ------------ STABILITY MIN/MAX ------------
          this.stability.max = response.stabilityMax;
          this.stability.min = response.stabilityMin;

          // ------------ OBESITY MIN/MAX ------------
          this.obesity.max = response.obesityMax;
          this.obesity.min = response.obesityMin;

          // ------------ SCALES ------------
          this.circleRadiusScale = d3
            // .scaleSqrt()
            .scaleLinear()
            .domain([that.obesity.min, that.obesity.max])
            .range([that.circleSize.min, that.circleSize.max]);

          this.rangeXScale = d3
            .scaleLinear()
            .domain([that.gdp.min, that.gdp.max])
            .range([that.paddingX, that.width - that.paddingX]);

          this.rangeYScale = d3
            .scaleLinear()
            .domain([that.stability.min, that.stability.max])
            .range([that.height - that.paddingY, that.paddingY]);

          // ------------ REGIONS ------------
          for (let i = 0; i < response.regions.length; i++) {
            this.regionOptions.push({
              text: response.regions[i],
              value: response.regions[i],
              id: "area" + i,
              state: false
            });
          }
          // ------------ RESOLVE PROMISE ------------
          resolve();
        });
      });
    },
    buildSVG() {
      return new Promise(resolve => {
        this.svg = d3
          .select("#chart")
          .append("svg")
          .attr("width", this.width)
          .attr("height", this.height);
        this.setupDone = true;
        resolve();
      });
    },
    createCircles() {
      const that = this;
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      let filteredValues = this.values.filter(this.filterRegion);

      this.svg.selectAll("circle").remove();

      this.svg
        .selectAll("circle")
        .data(filteredValues)
        .enter()
        .append("circle")
        .style("opacity", 0)
        .attr("cx", function(d) {
          // console.log(d);
          if (
            typeof d["values"][that.selectedYear] !== "undefined" &&
            typeof d["values"][that.selectedYear]["gdpValue"] !== "undefined"
          ) {
            return that.rangeXScale(d["values"][that.selectedYear]["gdpValue"]);
          } else {
            return 5000; // quick fix! this should be adjusted
          }
        })
        .attr("cy", function(d) {
          if (
            typeof d["values"][that.selectedYear] !== "undefined" &&
            typeof d["values"][that.selectedYear]["stabilityValue"] !==
              "undefined"
          ) {
            return that.rangeYScale(
              d["values"][that.selectedYear]["stabilityValue"]
            );
          } else {
            return 5000; // quick fix! this should be adjusted
          }
        })
        .attr("r", function(d) {
          // return 30;
          if (
            typeof d["values"][that.selectedYear] !== "undefined" &&
            typeof d["values"][that.selectedYear]["obesityValue"] !==
              "undefined"
          ) {
            return that.circleRadiusScale(
              d["values"][that.selectedYear]["obesityValue"]
            );
          } else {
            return 4;
          }
        })
        .attr("fill", function(d) {
          return that.colorForRegion(d.region);
        })
        .style("stroke", "black")
        .on("mouseover", function(d) {
          that.updateName(d.area);
          tooltip
            .transition()
            .duration(200)
            .style("opacity", 0.9);
          tooltip
            .html(
              "<span>Country: " +
                d.area +
                "</span> <br> <span> GDP: " +
                d["values"][that.selectedYear]["gdpValue"] +
                " I$" +
                "</span> <br>" +
                "<span>Stability: " +
                d["values"][that.selectedYear]["stabilityValue"] +
                "</span> <br>" +
                "<span>Obesity: " +
                d["values"][that.selectedYear]["obesityValue"] +
                " %" +
                "</span>"
            )
            .style("left", `${d3.event.pageX}px`)
            .style("top", `${d3.event.pageY}px`);
        })
        .on("mouseout", function() {
          that.updateName();
          tooltip
            .transition()
            .duration(500)
            .style("opacity", 0);
        })
        .transition()
        .delay(function(d, i) {
          return i * 4;
        })
        .duration(200)
        .style("opacity", 1);
    },
    updateName(name = "") {
      this.focus = name;
    },
    filterRegion(value) {
      return this.selectedRegions.includes(value.region);
    },
    colorForRegion(region) {
      switch (region) {
        case "Northern America":
          return "#54C456";
        case "Southern America":
          return "#15B9DC";
        case "Northern Europe":
          return "#BAAA39";
        case "Southern Europe":
          return "#FC4302";
        case "Eastern Europe":
          return "#F9BA4F";
        case "Western Europe":
          return "#FF801C";
        case "Northern Africa":
          return "#CF3104";
        case "Southern Africa":
          return "#B101C4";
        case "Eastern Africa":
          return "#DF27E7";
        case "Western Africa":
          return "#E72D81";
        case "Middle Africa":
          return "#F67595";
        default:
          return "black";
      }
    },
    push(item) {
      if (this.selectedRegions.includes(item.value)) {
        this.selectedRegions.splice(
          this.selectedRegions.indexOf(item.value),
          1
        );
      } else {
        this.selectedRegions.push(item.value);
      }
      this.createCircles();
    },
    createXAxis() {
      const that = this;
      // the whole circle should be visible!
      let axisScale = d3
        .scaleLinear()
        .domain([that.gdp.min, that.gdp.max])
        .range([that.paddingX, that.width - that.paddingX]);

      let xAxis = d3.axisBottom(axisScale).ticks(10);

      that.svg
        .append("g")
        .attr("class", "x axis")
        .attr(
          "transform",
          "translate(0," + (that.height - that.paddingX / 2) + ")"
        )
        .call(xAxis);

      that.svg
        .append("text") // text label for the y axis
        .attr("x", that.width / 2)
        .attr("y", that.height - 10)
        .style("text-anchor", "middle")
        .text("GDP in I$");
    },
    createYAxis() {
      const that = this;
      let axisScale = d3
        .scaleLinear()
        .domain([that.stability.max, that.stability.min])
        .range([that.paddingY, that.height - that.paddingY]);
      let yAxis = d3.axisLeft(axisScale).ticks(10);
      that.svg
        .append("g")
        .attr("class", "y axis")
        // 0.5*margin so that it "floats in the middle, trust me, it would look shitty if we didn't do this"
        .attr("transform", "translate(" + that.paddingX / 2 + "," + 0 + ")")
        .call(yAxis);
      that.svg
        .append("text") // text label for the y axis
        .attr("x", 0 - that.height / 2)
        .attr("y", 12)
        .style("text-anchor", "middle")
        .text("Stability")
        .attr("transform", "rotate(-90)");
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.tooltip {
  position: absolute;
  width: 200px;
  height: auto;
  padding: 10px;
  background-color: white;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

.tooltip.hidden {
  display: none;
}

.tooltip p {
  margin: 0;
  font-family: Futura, serif;
  font-size: 16px;
  line-height: 20px;
}

.checkboxes {
  text-align: left;
}

.headline {
  text-align: center;
}

#area0.active {
  background-color: #54c456;
}

#area1.active {
  background-color: #15b9dc;
}

#area2.active {
  background-color: #ff801c;
}

#area3.active {
  background-color: #fc4302;
}

#area4.active {
  background-color: #baaa39;
}

#area5.active {
  background-color: #f9ba4f;
}

#area6.active {
  background-color: #e72d81;
}

#area7.active {
  background-color: #b101c4;
}

#area8.active {
  background-color: #cf3104;
}

#area9.active {
  background-color: #df27e7;
}

#area10.active {
  background-color: #f67595;
}
</style>
