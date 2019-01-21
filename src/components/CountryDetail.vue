<template>
    <div v-if="data">
            <p> In {{year}}, {{countryName}} had ... Amenia and ... protein data</p>
    </div>
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

p {
  text-align: center;
}
  
</style>
