<template>
  <b-jumbotron > 
    <div v-if="data"> 
      <h2> {{countryName}}, {{year}} </h2>
      <p> Prevalence of anemia: {{anemia}}% </p>
      <p> Protein intake: {{proteinIntake}} (g/cap/day) </p>
      <p> GDP: {{gdp}} (Trumps$) </p>
    </div>
    <div v-else>
      <p> Pick the country and slide the year to see more cool stuffs </p>
    </div>
  </b-jumbotron>
</template>

<script lang="ts">
  import { DataGroup } from '@/script/DataGroup.d.ts';
  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component({
    props: {
      data: Object as unknown as (new() => DataGroup),
    },
  })
  export default class CountryDetail extends Vue {
    public data?: DataGroup;

    get anemia(): string | null {
      if (!this.data) {
        return null;
      }
      return this.data.values.find(v => v['Item Code'] === '21043')!.Value;
    }

    get proteinIntake(): string | null {
      if (!this.data) {
        return null;
      }
      return this.data.values.find(v => v['Item Code'] === '21013')!.Value;
    }

    get gdp(): string | null {
      if (!this.data) {
        return null;
      }
      return this.data.values.find(v => v['Item Code'] === '22013')!.Value;
    }

    get countryName(): string | null {
      if (!this.data) {
        return null;
      }
      return this.data.area;
    }

    get year(): number | null {
      if (!this.data) {
        return null;
      }
      return this.data.year;
    }
  }
</script>
<style scoped lang="scss">
</style>
