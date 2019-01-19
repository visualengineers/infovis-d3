<template>
  <div>
    <svg></svg>
  </div>
</template>

<script lang="ts">
import { DataGroup } from '@/script/DataGroup.d.ts';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import * as d3 from 'd3';
import { values } from 'd3';
import { DataProvider } from '@/script/DataProvider';
import { DataPoint } from '@/script/DataPoint';

@Component({
  props: {
    data: Array as new () => DataGroup[],
    selectedRegions: Array as new () => string[],
  },
})
export default class Diagram extends Vue {
  public data?: DataGroup[] | null;
  public selectedRegions?: string[];

  // TODO: solve this with props
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

  public async created() {
    this.dataProvider =  await DataProvider.loadJSON();

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

    const svg = d3
      .select('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const svgGroup = svg.append('g');

    svgGroup.append('g')
      .call(d3.axisLeft(this.proteinScale!))
      .attr('transform', 'translate(' + this.padding + ', 0)');

    svgGroup.append('g')
      .call(d3.axisBottom(this.anemiaScale!))
      .attr('transform', 'translate(0, ' + (this.height - this.padding) + ')');

  }

  public renderBubbles(): void {
    if (this.data && this.dataProvider && this.selectedRegions) {
      const interestingData = this.data
        .filter(d =>
          d.values.some(v => v['Item Code'] === this.anemiaCode)
          && d.values.some(v => v['Item Code'] === this.proteinCode)
          && d.values.some(v => v['Item Code'] === this.gdpCode)
          && this.selectedRegions!.includes(d.region),
        ).sort( (a, b) => {
          const aGDP = Number.parseFloat(a.values.find(v => v['Item Code'] === this.gdpCode)!.Value);
          const bGDP = Number.parseFloat(b.values.find(v => v['Item Code'] === this.gdpCode)!.Value);

          return bGDP - aGDP;
        },
        );

      const circles = d3.select('svg')
        .select('g')
        .selectAll('circle')
        .data(interestingData, d => (d as DataGroup).area);

      circles.enter()
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
        .attr('fill', d => this.colorScale!(d.region))
        .attr('stroke', '#aaa')
        .on('click', d => this.$emit('areaSelected', d.area));

      circles.transition()
        .duration(1000)
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

      circles.exit().remove();
    }
  }

  @Watch('data')
  public onDataChanged() {
    this.renderBubbles();
  }

  @Watch('selectedRegions')
  public onSelectedRegionsChanged() {
    this.renderBubbles();
  }
}
</script>

<style scoped lang="scss">
svg {
  width: 1000;
  height: 500;
}
</style>
