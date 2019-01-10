<template>
  <pre v-if="dataProvider">There are {{preparedData.length}} regions.
{{regionsText}}

By the way, Germany had {{getValue('Germany', '2016', '21042')}} percent of obese people in 2016.
Northern Africa had an average index of {{ getAverageForRegion('Northern Africa', '2016', '21032')}} for political stability in 2016,
while Western Europe had {{ getAverageForRegion('Western Europe', '2016', '21032') }}.
The best index was {{ getMaxValue('21032').Value }} in {{ getMaxValue('21032').Area }} in the year {{ getMaxValue('21032').Year }}.
  </pre>
</template>

<script lang="ts">
  import { DataHierarchy } from '@/script/DataHierarchy';
  import { DataPoint } from '@/script/DataPoint';
  import { DataProvider } from '@/script/DataProvider';
  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component
  export default class Visualization extends Vue {
    public dataProvider: DataProvider | null = null;

    public async created() {
      this.dataProvider = await DataProvider.loadJSON();
    }

    public getValue(area: DataPoint['Area'],
                    year: DataPoint['Year'],
                    code: DataPoint['Item Code']): DataPoint['Value'] | undefined {
      if (!this.dataProvider) {
        return undefined;
      }

      return this.dataProvider.getValue(area, year, code);
    }

    public getMaxValue(code: DataPoint['Item Code']): DataPoint | undefined {
      if (!this.dataProvider) {
        return undefined;
      }

      return this.dataProvider.getMaxValue(code);
    }

    public getAverageForRegion(region: DataPoint['Region'],
                               year: DataPoint['Year'],
                               code: DataPoint['Item Code']): number | undefined {
      if (!this.dataProvider) {
        return undefined;
      }

      return this.dataProvider.getAverageForRegion(region, year, code);
    }

    get preparedData(): DataHierarchy {
      return this.dataProvider ? this.dataProvider.preparedData : [];
    }

    get regionsText(): string {
      return (this.dataProvider ? this.dataProvider.preparedData : [])
        .reduce((acc, region) => acc + '\n' + `${region.value} has ${region.elements.length} countries.`, '');
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
