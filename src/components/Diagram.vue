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
import { DiagramDomain } from '@/script/DiagramDomain';

@Component({
  props: {
    data: Array as new () => DataGroup[],
    selectedRegions: Array as new () => string[],
    diagramDomain: Object as () => DiagramDomain,
    regionColorScale: Object as () => d3.ScaleOrdinal<string, string>,
  },
})
export default class Diagram extends Vue {
  public data?: DataGroup[] | null;
  public selectedRegions?: string[];
  private diagramDomain?: DiagramDomain;
  private regionColorScale?: d3.ScaleOrdinal<string, string>;

  private width = 1000;
  private height = 500;
  private padding = 50;

  private anemiaCode = '21043';
  private proteinCode = '21013';
  private gdpCode = '22013';

  private anemiaScale: d3.ScaleLinear<number, number> | null = null;
  private proteinScale: d3.ScaleLinear<number, number> | null = null;
  private gdpScale: d3.ScaleLinear<number, number> | null = null;

  @Watch('diagramDomain')
  public createSVG() {
    if (this.diagramDomain) {
      this.anemiaScale = d3.scaleLinear()
        .domain([this.diagramDomain.minimumAnemia, this.diagramDomain.maximumAnemia])
        .range([this.padding, this.width - this.padding]);

      this.proteinScale = d3.scaleLinear()
        .domain([this.diagramDomain.minimumProtein, this.diagramDomain.maximumProtein])
        .range([this.height - this.padding, this.padding]);

      this.gdpScale = d3.scaleLinear()
        .domain([this.diagramDomain.minimumGDP, this.diagramDomain.maximumGDP])
        .range([5, 50]);

      const svg = d3
        .select('svg')
        .attr('width', this.width)
        .attr('height', this.height);

      const svgGroup = svg.append('g');

      svgGroup.append('g')
        .call(d3.axisLeft(this.proteinScale))
        .attr('transform', 'translate(' + this.padding + ', 0)');

      svgGroup.append('text')
        .text('Prevalence of anemia among women of reproductive age (15-49 years)')
        .attr('y', this.height - 20)
        .attr('x', 50)
        .style('font-size', '10px');

      svgGroup.append('g')
        .call(d3.axisBottom(this.anemiaScale))
        .attr('transform', 'translate(0, ' + (this.height - this.padding) + ')');

      svgGroup.append('text')
        .text('Average protein supply (g/cap/day) (3-year average)')
        .attr('transform', 'translate(15,' + (this.height - 50) + '),rotate(-90)')
        .style('font-size', '10px');
    }
  }

  public renderBubbles(): void {
    if (this.data && this.selectedRegions) {
      const circles = d3.select('svg')
        .select('g')
        .selectAll('circle')
        .data(this.data, d => (d as DataGroup).area);

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
        .attr('fill', d => this.regionColorScale!(d.region))
        .attr('opacity', d => this.selectedRegions!.includes(d.region) ? 1.0 : 0.1)
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
        .attr('fill', d => this.regionColorScale!(d.region))
        .attr('opacity', d => this.selectedRegions!.includes(d.region) ? 1.0 : 0.1);

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

</style>
