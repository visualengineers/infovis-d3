<template>
    <div v-if="data">
        <ul>
            <li>{{countryName}}</li>
            <li>{{year}}</li>
        </ul>
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
