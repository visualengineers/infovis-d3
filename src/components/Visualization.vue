<template>
    <div>
        <Timeline :years="years" @change="selectedYear = $event"></Timeline>
        <div>
            <Key :regions="regions" @change="selectedRegions = $event"></Key>
            <Diagram :data="selectedData" :selected-regions="selectedRegions" @areaSelected="selectedArea = $event" :diagramDomain="diagramDomain"></Diagram>
        </div>
        <CountryDetail :data="selectedDataSet"></CountryDetail>
    </div>
</template>

<script lang="ts">
  import CountryDetail from '@/components/CountryDetail.vue';
  import Diagram from '@/components/Diagram.vue';
  import Key from '@/components/Key.vue';
  import Timeline from '@/components/Timeline.vue';
  import { DataGroup } from '@/script/DataGroup';
  import { DataProvider } from '@/script/DataProvider';
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { DiagramDomain } from '@/script/DiagramDomain';

  @Component({
    components: {
      CountryDetail,
      Diagram,
      Key,
      Timeline,
    },
  })
  export default class Visualization extends Vue {
    public dataProvider: DataProvider | null = null;
    public selectedYear: number | null = null;
    public selectedRegions: string[] = [];
    private selectedArea: string | null = 'Germany';

    private anemiaCode = '21043';
    private proteinCode = '21013';
    private gdpCode = '22013';

    public async created() {
      this.dataProvider = await DataProvider.loadJSON();
    }

    get years(): number[] | null {
      if (!this.dataProvider) {
        return null;
      }

      return [...new Set(
        this.dataProvider.preparedData.filter(d =>
          d.values.some(v => v['Item Code'] === this.anemiaCode)
          && d.values.some(v => v['Item Code'] === this.proteinCode)
          && d.values.some(v => v['Item Code'] === this.gdpCode),
        )
        .map(d => d.year),
      )];
    }

    get regions(): string[] | null {
      if (!this.dataProvider) {
        return null;
      }

      return [...new Set(this.dataProvider.data.map(d => d.Region))];
    }

    get selectedData(): DataGroup[] | null {
      if (!this.dataProvider) {
        return null;
      }

      return this.dataProvider.preparedData.filter(({ year }) => this.selectedYear === year)
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
    }

    get selectedDataSet(): DataGroup | null {
      if (!this.dataProvider) {
        return null;
      }

      return this.dataProvider.preparedData
        .find(({ year, area }) => this.selectedYear === year && this.selectedArea === area) || null;
    }

    get diagramDomain(): DiagramDomain | null {
      if (!this.dataProvider) {
        return null;
      }

      return {
        minimumAnemia: Number.parseFloat(this.dataProvider.getMinValue(this.anemiaCode)!.Value),
        maximumAnemia: Number.parseFloat(this.dataProvider.getMaxValue(this.anemiaCode)!.Value),
        minimumProtein: Number.parseFloat(this.dataProvider.getMinValue(this.proteinCode)!.Value),
        maximumProtein: Number.parseFloat(this.dataProvider.getMaxValue(this.proteinCode)!.Value),
        minimumGDP: Number.parseFloat(this.dataProvider.getMinValue(this.gdpCode)!.Value),
        maximumGDP: Number.parseFloat(this.dataProvider.getMaxValue(this.gdpCode)!.Value),
      };
    }
  }
</script>

<style scoped lang="scss">
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
