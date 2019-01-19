<template>
  <div>
    <svg></svg>
  </div>
</template>

<script lang="ts">
import { DataGroup } from '@/script/DataGroup.d.ts';
import Vue from 'vue';
import Component from 'vue-class-component';
import * as d3 from 'd3';
import { values } from 'd3';
import { DataProvider } from '@/script/DataProvider';
import { DataPoint } from '@/script/DataPoint';

@Component
export default class Diagram extends Vue {
  private data: DataGroup[] | null = null;
  private dataProvider: DataProvider | null = null;

  private width = 1000;
  private height = 500;
  private padding = 50;

  private anemiaCode = '21043';
  private proteinCode = '21013';
  private gdpCode = '22013';

  public async created() {
    this.dataProvider =  await DataProvider.loadJSON();
    this.data = this.dataProvider.preparedData
      .filter(d => d.year === 2012
        && d.values.some(v => v['Item Code'] === this.anemiaCode)
        && d.values.some(v => v['Item Code'] === this.proteinCode)
        && d.values.some(v => v['Item Code'] === this.gdpCode),
      );

    const svg = d3
      .select('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const minimumAmenia = Number.parseFloat(this.dataProvider.getMinValue(this.anemiaCode)!.Value);
    const maximumAmenia = Number.parseFloat(this.dataProvider.getMaxValue(this.anemiaCode)!.Value);

    const minimumProtein = Number.parseFloat(this.dataProvider.getMinValue(this.proteinCode)!.Value);
    const maximumProtein = Number.parseFloat(this.dataProvider.getMaxValue(this.proteinCode)!.Value);

    const minimumGDP = Number.parseFloat(this.dataProvider.getMinValue(this.gdpCode)!.Value);
    const maximumGDP = Number.parseFloat(this.dataProvider.getMaxValue(this.gdpCode)!.Value);

    const anemiaScale = d3.scaleLinear()
      .domain([minimumAmenia, maximumAmenia])
      .range([this.padding, this.width - this.padding]);

    const proteinScale = d3.scaleLinear()
      .domain([minimumProtein, maximumProtein])
      .range([this.height - this.padding, this.padding]);

    const gdpScale = d3.scaleLinear()
      .domain([minimumGDP, maximumGDP])
      .range([5, 50]);

    const colorScale = d3.scaleOrdinal(d3.schemePaired);

    const svgGroup = svg.append('g');

    const circles = svgGroup
      .selectAll('circle')
      .data(this.data)
      .enter()
        .append('circle')
        .attr('r', d =>
          gdpScale(Number.parseFloat(d.values.find(v => v['Item Code'] === this.gdpCode)!.Value)),
        )
        .attr('cx', d =>
            anemiaScale(Number.parseFloat(d.values.find(v => v['Item Code'] === this.anemiaCode)!.Value)),
        )
        .attr('cy', d =>
          proteinScale(Number.parseInt(d.values.find(v => v['Item Code'] === this.proteinCode)!.Value, 10)),
        )
        .attr('fill', d => colorScale(d.region));

    svgGroup.append('g')
      .call(d3.axisLeft(proteinScale))
      .attr('transform', 'translate(' + this.padding + ', 0)');

    svgGroup.append('g')
      .call(d3.axisBottom(anemiaScale))
      .attr('transform', 'translate(0, ' + (this.height - this.padding) + ')');
  }
}
</script>

<style scoped lang="scss">
svg {
  width: 1000;
  height: 500;
}
</style>
