<template>
    <div>
        <svg class="countrytimechart"></svg>
    </div>
</template>

<script lang="ts">
  import { DataGroup } from '@/script/DataGroup.d.ts';
  import { DataPoint, ItemCodes } from '@/script/DataPoint';
  import { DiagramDomain } from '@/script/DiagramDomain';
  import * as d3 from 'd3';
  import { BaseType, ScaleLinear, ScaleTime } from 'd3';
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Watch } from 'vue-property-decorator';

  @Component({
    props: {
      data: Array as new () => DataGroup[],
      years: Array as new () => number[],
      selectedYear: Number,
      diagramDomain: Object as unknown as new () => DiagramDomain,
    },
  })
  export default class CountryTimeChart extends Vue {
    private static readonly WIDTH = 1000;
    private static readonly HEIGHT = 250;
    private static readonly PADDING = 50;

    public data?: DataGroup[];
    public years?: number[];
    public selectedYear?: number;
    public diagramDomain?: DiagramDomain;

    private yearScale: ScaleTime<number, number> | null = null;
    private anemiaScale: ScaleLinear<number, number> | null = null;
    private gdpScale: ScaleLinear<number, number> | null = null;

    @Watch('yearRange')
    @Watch('diagramDomain')
    public createDiagram() {
      if (this.years && this.diagramDomain) {
        this.yearScale = d3.scaleTime()
          .domain([new Date(Math.min(...this.years), 0, 0), new Date(Math.max(...this.years), 0, 0)])
          .range([CountryTimeChart.PADDING, CountryTimeChart.WIDTH - CountryTimeChart.PADDING]);
        this.anemiaScale = d3.scaleLinear()
          .domain([this.diagramDomain.minimumAnemia, this.diagramDomain.maximumAnemia])
          .range([CountryTimeChart.HEIGHT - CountryTimeChart.PADDING, CountryTimeChart.PADDING]);
        this.gdpScale = d3.scaleLinear()
          .domain([this.diagramDomain.minimumGDP, this.diagramDomain.maximumGDP])
          .range([CountryTimeChart.HEIGHT - CountryTimeChart.PADDING, CountryTimeChart.PADDING]);

        const svg = d3
          .select('svg.countrytimechart')
          .attr('width', CountryTimeChart.WIDTH)
          .attr('height', CountryTimeChart.HEIGHT);

        svg.selectAll('#diagram').remove();
        const diagram = svg.append('g').attr('id', 'diagram');

        diagram.append('g')
          .call(d3.axisLeft(this.anemiaScale))
          .attr('transform', `translate(${CountryTimeChart.PADDING}, 0)`)
          .style('color', '#F55');
        diagram.append('g')
          .call(d3.axisRight(this.gdpScale))
          .attr('transform', `translate(${CountryTimeChart.WIDTH - CountryTimeChart.PADDING}, 0)`)
          .style('color', '#55F');
        diagram.append('g')
          .call(d3.axisBottom(this.yearScale))
          .attr('transform', `translate(0, ${CountryTimeChart.HEIGHT - CountryTimeChart.PADDING})`);

        diagram.append('text')
          .text('Year')
          .attr('y', CountryTimeChart.HEIGHT - 20)
          .attr('x', 50)
          .style('font-size', '10px');

        diagram.append('text')
          .text('Prevalence of anemia')
          .attr('transform', `translate(15, ${CountryTimeChart.HEIGHT - CountryTimeChart.PADDING}),rotate(-90)`)
          .style('font-size', '10px');

        diagram.append('text')
          .text('Gross domestic product per capita ($)')
          .attr('transform',
            `translate(${CountryTimeChart.WIDTH}, ${CountryTimeChart.HEIGHT - CountryTimeChart.PADDING}),rotate(-90)`)
          .style('font-size', '10px');
      }
    }

    @Watch('data')
    public drawChart() {
      if (this.data && this.gdpScale && this.anemiaScale && this.yearScale) {
        const svg = d3.select('svg.countrytimechart');
        svg.selectAll('#chart').remove();
        const chart = svg.append('g').attr('id', 'chart');

        const anemiaLine = d3.line<DataPoint>()
          .x(d => this.yearScale!(new Date(d.Year, 0, 0)))
          .y(d => this.anemiaScale!(Number.parseFloat(d.Value)));
        const gdpLine = d3.line<DataPoint>()
          .x(d => this.yearScale!(new Date(d.Year, 0, 0)))
          .y(d => this.gdpScale!(Number.parseFloat(d.Value)));

        chart.append('path')
          .datum(this.data.flatMap(d => d.values.filter(p => p['Item Code'] === ItemCodes.ANEMIA_CODE)) as DataPoint[])
          .attr('fill', 'none')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 1.5)
          .attr('stroke', '#F55')
          .attr('d', anemiaLine);

        chart.append('path')
          .datum(this.data.flatMap(d => d.values.filter(p => p['Item Code'] === ItemCodes.GDP_CODE)) as DataPoint[])
          .attr('fill', 'none')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 1.5)
          .attr('stroke', '#55F')
          .attr('d', gdpLine);
      }
    }

    @Watch('selectedYear')
    private drawYearIndicator() {
      if (this.selectedYear && this.yearScale) {
        const svg = d3
          .select('svg.countrytimechart');

        const svgGroup: d3.Selection<SVGGElement, any, HTMLElement, any> = svg.select('#yearIndicator').empty()
          ? svg.append('g').attr('id', 'yearIndicator')
          : svg.select('#yearIndicator');

        const indicators = svgGroup.selectAll<SVGLineElement, Date>('line').data([new Date(this.selectedYear, 0, 0)]);

        const indicatorLine = (
          selection: d3.Selection<SVGLineElement, Date, any, any>
            | d3.Transition<SVGLineElement, Date, any, any>) => selection
          .attr('x1', y => this.yearScale!(y))
          .attr('y1', CountryTimeChart.PADDING)
          .attr('x2', y => this.yearScale!(y))
          .attr('y2', CountryTimeChart.HEIGHT - CountryTimeChart.PADDING);

        indicators.enter().append('line')
          .call(indicatorLine)
          .attr('stroke-width', 2.5)
          .attr('stroke', '#ff4700')
          .attr('fill', 'none');

        indicators.transition().duration(600)
          .call(indicatorLine);

        indicators.exit().remove();
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
