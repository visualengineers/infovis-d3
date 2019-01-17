<template>
    <div v-if="yearHierarchy">
        <ul>
            <li>{{countryName}}</li>
            <li>{{year}}</li>
        </ul>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { DataGroup } from '@/script/DataGroup.d.ts'

  @Component({
    props: {
      dataGroup: Object as unknown as (new() => DataGroup),
    },
  })
  export default class CountryDetail extends Vue {
    public dataGroup?: DataGroup;

    get countryName(): string | null {
      if (!this.dataGroup) {
        return null;
      }

      return this.dataGroup.area;
    }

    get year(): number | null {
      if (!this.dataGroup) {
        return null;
      }

      return this.dataGroup.year;
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
