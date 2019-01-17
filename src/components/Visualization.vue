<template>
    <div>
        <Timeline :years="years" @change="selectedYear = $event"></Timeline>
        <div>
            <Key></Key>
            <Diagram></Diagram>
        </div>
        <CountryDetail :year-hierarchy="selectedCountryYear"></CountryDetail>
    </div>
</template>

<script lang="ts">
  import CountryDetail from '@/components/CountryDetail.vue';
  import Diagram from '@/components/Diagram.vue';
  import Key from '@/components/Key.vue';
  import Timeline from '@/components/Timeline.vue';
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
    private selectedArea: string | null = 'Germany';
    public selectedYear: string | null = null;

    public async created() {
      this.dataProvider = await DataProvider.loadJSON();
    }

    get years(): number[] | undefined {
      if (!this.dataProvider) {
        return undefined;
      }

      return [...new Set(this.dataProvider.data.map(d => Number(d.Year)))];
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
