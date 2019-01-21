<template>
    <div>
    <div class="header">
    <h1>Hello, World in data</h1>
     </div>
     <b-row>
        <b-col class="slider"><Timeline :years="years" @change="selectedYear = $event"></Timeline></b-col>
      </b-row>

      <b-row>
        <b-col cols="2" class="key">
          <Key :regions="regions" @change="selectedRegions = $event"></Key>
        </b-col>
        <b-col cols="7">
          <Diagram :data="selectedData" :selected-regions="selectedRegions" @areaSelected="selectedArea = $event" :diagramDomain="diagramDomain"></Diagram>
        </b-col>
        <b-col cols="3"><CountryDetail :data="selectedDataSet"></CountryDetail></b-col>

      </b-row>
     
      <div class="copy">
        &copy; 2019 Belegarbeit PBO von Oliver von Seydlitz, Leo Lindhorst, Duc Hung Nguyen, Denis Keiling
      </div>
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
 .key {
  padding-top: 50px;
  padding-left: 50px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.header {
  text-align: center;
}
.slider {
  text-align: center;
  width: 100%;
}
.copy {        
  text-align: center;
}
</style>
