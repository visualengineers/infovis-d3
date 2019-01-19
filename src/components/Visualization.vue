<template>
    <div>
        <Timeline :years="years" @change="selectedYear = $event"></Timeline>
        <div>
            <Key :regions="regions" @change="selectedRegions = $event"></Key>
            <Diagram :data="selectedData" :selected-regions="selectedRegions" @areaSelected="selectedArea = $event"></Diagram>
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

    public async created() {
      this.dataProvider = await DataProvider.loadJSON();
    }

    get years(): number[] | null {
      if (!this.dataProvider) {
        return null;
      }

      return [...new Set(this.dataProvider.data.map(d => d.Year))];
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

      return this.dataProvider.preparedData.filter(({ year }) => this.selectedYear === year);
    }

    get selectedDataSet(): DataGroup | null {
      if (!this.dataProvider) {
        return null;
      }

      return this.dataProvider.preparedData
        .find(({ year, area }) => this.selectedYear === year && this.selectedArea === area) || null;
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
