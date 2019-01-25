<template>
    <div>
        <svg class="countrytimechart"></svg>
    </div>
</template>

<script lang="ts">
  import { DataGroup } from '@/script/DataGroup.d.ts';
  import { DataPoint, ItemCodes } from '@/script/DataPoint';
  import * as d3 from 'd3';
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Watch } from 'vue-property-decorator';

  @Component({
    props: {
      data: Array as new () => DataGroup[],
      years: Array as new () => number[],
    },
  })
  export default class CountryTimeChart extends Vue {
    private static readonly WIDTH = 1000;
    private static readonly HEIGHT = 250;
    private static readonly PADDING = 50;

    public data?: DataGroup[];
    public years?: number[];

    @Watch('data')
    @Watch('yearRange')
    public createSVG() {
      if (this.data && this.years) {
        const yearScale = d3.scaleTime()
          .domain([new Date(Math.min(...this.years), 0, 0), new Date(Math.max(...this.years), 0, 0)])
          .range([CountryTimeChart.PADDING, CountryTimeChart.WIDTH - CountryTimeChart.PADDING]);

        const anemiaValues = this.data
          .flatMap(d => d.values.filter(p => p['Item Code'] === ItemCodes.ANEMIA_CODE))
          .map(p => Number.parseFloat(p.Value));
        const anemiaScale = d3.scaleLinear()
          .domain([Math.min(...anemiaValues), Math.max(...anemiaValues)])
          .range([CountryTimeChart.HEIGHT - CountryTimeChart.PADDING, CountryTimeChart.PADDING]);

        const gdpValues = this.data
          .flatMap(d => d.values.filter(p => p['Item Code'] === ItemCodes.GDP_CODE))
          .map(p => Number.parseFloat(p.Value));
        const gdpScale = d3.scaleLinear()
          .domain([Math.min(...gdpValues), Math.max(...gdpValues)])
          .range([CountryTimeChart.HEIGHT - CountryTimeChart.PADDING, CountryTimeChart.PADDING]);

        const svg = d3
          .select('svg.countrytimechart')
          .attr('width', CountryTimeChart.WIDTH)
          .attr('height', CountryTimeChart.HEIGHT);

        svg.selectAll('g').remove();
        const svgGroup = svg.append('g');

        svgGroup.append('g')
          .call(d3.axisLeft(anemiaScale))
          .attr('transform', `translate(${CountryTimeChart.PADDING}, 0)`)
          .style('color', '#F55');
        svgGroup.append('g')
          .call(d3.axisRight(gdpScale))
          .attr('transform', `translate(${CountryTimeChart.WIDTH - CountryTimeChart.PADDING}, 0)`)
          .style('color', '#55F');
        svgGroup.append('g')
          .call(d3.axisBottom(yearScale))
          .attr('transform', `translate(0, ${CountryTimeChart.HEIGHT - CountryTimeChart.PADDING})`);

        svgGroup.append('text')
          .text('Year')
          .attr('y', CountryTimeChart.HEIGHT - 20)
          .attr('x', 50)
          .style('font-size', '10px');

        svgGroup.append('text')
          .text('Prevalence of anemia')
          .attr('transform', `translate(15, ${CountryTimeChart.HEIGHT - CountryTimeChart.PADDING}),rotate(-90)`)
          .style('font-size', '10px');

        svgGroup.append('text')
          .text('Gross domestic product per capita ($)')
          .attr('transform',
            `translate(${CountryTimeChart.WIDTH}, ${CountryTimeChart.HEIGHT - CountryTimeChart.PADDING}),rotate(-90)`)
          .style('font-size', '10px');

        const anemiaLine = d3.line<DataPoint>()
          .x(d => yearScale(new Date(d.Year, 0, 0)))
          .y(d => anemiaScale(Number.parseFloat(d.Value)));
        const gdpLine = d3.line<DataPoint>()
          .x(d => yearScale(new Date(d.Year, 0, 0)))
          .y(d => gdpScale(Number.parseFloat(d.Value)));

        svgGroup.append('path')
          .datum(this.data.flatMap(d => d.values.filter(p => p['Item Code'] === ItemCodes.ANEMIA_CODE)) as DataPoint[])
          .attr('fill', 'none')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 1.5)
          .attr('stroke', '#F55')
          .attr('d', anemiaLine);

        svgGroup.append('path')
          .datum(this.data.flatMap(d => d.values.filter(p => p['Item Code'] === ItemCodes.GDP_CODE)) as DataPoint[])
          .attr('fill', 'none')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 1.5)
          .attr('stroke', '#55F')
          .attr('d', gdpLine);
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
