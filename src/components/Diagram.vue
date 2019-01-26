<template>
    <div>
        <svg class="diagram"></svg>
    </div>
</template>

<script lang="ts">
  import { DataGroup } from '@/script/DataGroup.d.ts';
  import { ItemCodes } from '@/script/DataPoint';
  import { DiagramDomain } from '@/script/DiagramDomain';
  import * as d3 from 'd3';
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Watch } from 'vue-property-decorator';

  @Component({
    props: {
      data: Array as new () => DataGroup[],
      selectedRegions: Array as new () => string[],
      diagramDomain: Object as unknown as new () => DiagramDomain,
      regionColorScale: Function as unknown as new () => d3.ScaleOrdinal<string, string>,
    },
  })
  export default class Diagram extends Vue {
    private static readonly WIDTH = 800;
    private static readonly HEIGHT = 500;
    private static readonly PADDING = 50;

    public data?: DataGroup[] | null;
    public selectedRegions?: string[];
    private diagramDomain?: DiagramDomain;
    private regionColorScale?: d3.ScaleOrdinal<string, string>;

    private anemiaScale: d3.ScaleLinear<number, number> | null = null;
    private proteinScale: d3.ScaleLinear<number, number> | null = null;
    private gdpScale: d3.ScaleLinear<number, number> | null = null;
    private selectedArea: string | null = null;

    @Watch('diagramDomain')
    public createSVG() {
      if (this.diagramDomain) {
        this.anemiaScale = d3.scaleLinear()
          .domain([this.diagramDomain.minimumAnemia, this.diagramDomain.maximumAnemia])
          .range([Diagram.PADDING, Diagram.WIDTH - Diagram.PADDING]);

        this.proteinScale = d3.scaleLinear()
          .domain([this.diagramDomain.minimumProtein, this.diagramDomain.maximumProtein])
          .range([Diagram.HEIGHT - Diagram.PADDING, Diagram.PADDING]);

        this.gdpScale = d3.scaleLinear()
          .domain([this.diagramDomain.minimumGDP, this.diagramDomain.maximumGDP])
          .range([5, 50]);

        const svg = d3
          .select('svg.diagram')
          .attr('width', Diagram.WIDTH)
          .attr('height', Diagram.HEIGHT);

        const svgGroup = svg.append('g');

        svgGroup.append('g')
          .call(d3.axisLeft(this.proteinScale))
          .attr('transform', 'translate(' + Diagram.PADDING + ', 0)');

        svgGroup.append('text')
          .text('Prevalence of anemia among women of reproductive age (15-49 years)')
          .attr('y', Diagram.HEIGHT - 20)
          .attr('x', 50)
          .style('font-size', '10px');

        svgGroup.append('g')
          .call(d3.axisBottom(this.anemiaScale))
          .attr('transform', 'translate(0, ' + (Diagram.HEIGHT - Diagram.PADDING) + ')');

        svgGroup.append('text')
          .text('Average protein supply (g/cap/day) (3-year average)')
          .attr('transform', 'translate(15,' + (Diagram.HEIGHT - 50) + '),rotate(-90)')
          .style('font-size', '10px');
      }
    }

    @Watch('data')
    @Watch('selectedRegions')
    public renderBubbles(): void {
      if (this.data && this.selectedRegions) {
        const circles = d3.select('svg')
          .select('g')
          .selectAll('circle')
          .data(this.data.sort((a, b) => {
              const aGDP = Number.parseFloat(a.values.find(v => v['Item Code'] === ItemCodes.GDP_CODE)!.Value);
              const bGDP = Number.parseFloat(b.values.find(v => v['Item Code'] === ItemCodes.GDP_CODE)!.Value);

              return bGDP - aGDP;
            },
          ), d => (d as DataGroup).area);

        circles.enter()
          .append('circle')
          .attr('r', d =>
            this.gdpScale!(Number.parseFloat(d.values.find(v => v['Item Code'] === ItemCodes.GDP_CODE)!.Value)),
          )
          .attr('cx', d =>
            this.anemiaScale!(Number.parseFloat(d.values.find(v => v['Item Code'] === ItemCodes.ANEMIA_CODE)!.Value)),
          )
          .attr('cy', d =>
            this.proteinScale!(Number.parseInt(d.values.find(v => v['Item Code'] === ItemCodes.PROTEIN_CODE)!.Value, 10)),
          )
          .attr('fill', d => this.regionColorScale!(d.region))
          .attr('opacity', d => this.selectedRegions!.includes(d.region) ? 1.0 : 0.1)
          .attr('stroke', d => this.selectedArea && d.area === this.selectedArea ? '#1f7aff' : '#aaa')
          .attr('stroke-width', d => this.selectedArea && d.area === this.selectedArea ? 2 : 1)
          .on('click', d => {
            this.selectedArea = d.area;
            this.$emit('areaSelected', d.area);
            this.renderBubbles();
          });

        circles.transition()
          .duration(600)
          .attr('r', d =>
            this.gdpScale!(Number.parseFloat(d.values.find(v => v['Item Code'] === ItemCodes.GDP_CODE)!.Value)),
          )
          .attr('cx', d =>
            this.anemiaScale!(Number.parseFloat(d.values.find(v => v['Item Code'] === ItemCodes.ANEMIA_CODE)!.Value)),
          )
          .attr('cy', d =>
            this.proteinScale!(Number.parseInt(d.values.find(v => v['Item Code'] === ItemCodes.PROTEIN_CODE)!.Value, 10)),
          )
          .attr('fill', d => this.regionColorScale!(d.region))
          .attr('opacity', d => this.selectedRegions!.includes(d.region) ? 1.0 : 0.1)
          .attr('stroke', d => this.selectedArea && d.area === this.selectedArea ? '#1f7aff' : '#aaa')
          .attr('stroke-width', d => this.selectedArea && d.area === this.selectedArea ? 2 : 1);

        circles.exit().remove();
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
