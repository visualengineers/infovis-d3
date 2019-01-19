<template>
  <div>
    <button @click="changeYear">Change year</button>
    {{this.selectedArea}}
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

  private minimumAmenia: number | null = null;
  private maximumAmenia: number | null = null;
  private minimumProtein: number | null = null;
  private maximumProtein: number | null = null;
  private minimumGDP: number | null = null;
  private maximumGDP: number | null = null;

  private anemiaScale: d3.ScaleLinear<number, number> | null = null;
  private proteinScale: d3.ScaleLinear<number, number> | null = null;
  private gdpScale: d3.ScaleLinear<number, number> | null = null;
  private colorScale: d3.ScaleOrdinal<string, string> | null = null;

  private year = 2000;

  public async created() {
    // TODO: this should become a prop
    this.dataProvider =  await DataProvider.loadJSON();
    this.data = this.dataProvider.preparedData
      .filter(d => d.year === this.year
        && d.values.some(v => v['Item Code'] === this.anemiaCode)
        && d.values.some(v => v['Item Code'] === this.proteinCode)
        && d.values.some(v => v['Item Code'] === this.gdpCode),
      );

    const svg = d3
      .select('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.minimumAmenia = Number.parseFloat(this.dataProvider.getMinValue(this.anemiaCode)!.Value);
    this.maximumAmenia = Number.parseFloat(this.dataProvider.getMaxValue(this.anemiaCode)!.Value);

    this.minimumProtein = Number.parseFloat(this.dataProvider.getMinValue(this.proteinCode)!.Value);
    this.maximumProtein = Number.parseFloat(this.dataProvider.getMaxValue(this.proteinCode)!.Value);

    this.minimumGDP = Number.parseFloat(this.dataProvider.getMinValue(this.gdpCode)!.Value);
    this.maximumGDP = Number.parseFloat(this.dataProvider.getMaxValue(this.gdpCode)!.Value);

    this.anemiaScale = d3.scaleLinear()
      .domain([this.minimumAmenia, this.maximumAmenia])
      .range([this.padding, this.width - this.padding]);

    this.proteinScale = d3.scaleLinear()
      .domain([this.minimumProtein, this.maximumProtein])
      .range([this.height - this.padding, this.padding]);

    this.gdpScale = d3.scaleLinear()
      .domain([this.minimumGDP, this.maximumGDP])
      .range([5, 50]);

    this.colorScale = d3.scaleOrdinal(d3.schemePaired);

    const svgGroup = svg.append('g');

    const circles = svgGroup
      .selectAll('circle')
      .data(this.data)
      .enter()
        .append('circle')
        .attr('r', d =>
          this.gdpScale!(Number.parseFloat(d.values.find(v => v['Item Code'] === this.gdpCode)!.Value)),
        )
        .attr('cx', d =>
            this.anemiaScale!(Number.parseFloat(d.values.find(v => v['Item Code'] === this.anemiaCode)!.Value)),
        )
        .attr('cy', d =>
          this.proteinScale!(Number.parseInt(d.values.find(v => v['Item Code'] === this.proteinCode)!.Value, 10)),
        )
        .attr('fill', d => this.colorScale!(d.region));

    svgGroup.append('g')
      .call(d3.axisLeft(this.proteinScale))
      .attr('transform', 'translate(' + this.padding + ', 0)');

    svgGroup.append('g')
      .call(d3.axisBottom(this.anemiaScale))
      .attr('transform', 'translate(0, ' + (this.height - this.padding) + ')');
  }

  public changeYear(): void {
    // TODO: do this when data changes
    if (this.dataProvider) {
      this.year = this.year < 2012 ? ++this.year : 2000;

      this.data = this.dataProvider.preparedData
        .filter(d => d.year === this.year
          && d.values.some(v => v['Item Code'] === this.anemiaCode)
          && d.values.some(v => v['Item Code'] === this.proteinCode)
          && d.values.some(v => v['Item Code'] === this.gdpCode),
        );

      const svg = d3.select('svg');

      const svgGroup = svg.select('g');

      const circles = svgGroup
        .selectAll('circle')
        .data(this.data)
        .transition()
        .duration(500)
          .attr('r', d =>
            this.gdpScale!(Number.parseFloat(d.values.find(v => v['Item Code'] === this.gdpCode)!.Value)),
          )
          .attr('cx', d =>
              this.anemiaScale!(Number.parseFloat(d.values.find(v => v['Item Code'] === this.anemiaCode)!.Value)),
          )
          .attr('cy', d =>
            this.proteinScale!(Number.parseInt(d.values.find(v => v['Item Code'] === this.proteinCode)!.Value, 10)),
          )
          .attr('fill', d => this.colorScale!(d.region));
    }
  }
}
</script>

<style scoped lang="scss">
svg {
  width: 1000;
  height: 500;
}
</style>
