<template>
    <div v-if="yearHierarchy">
        <ul>
            <li>{{countryName}}</li>
            <li>{{year}}</li>
        </ul>
    </div>
</template>

<script lang="ts">
  import { YearHierarchy } from '@/script/DataHierarchy';
  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component({
    props: {
      yearHierarchy: Object as any as (new () => YearHierarchy),
    },
  })
  export default class CountryDetail extends Vue {
    public yearHierarchy?: YearHierarchy;

    get countryName(): string | null {
      if (!this.yearHierarchy) {
        return null;
      }

      return this.yearHierarchy.elements[0].Area;
    }

    get year(): string | null {
      if (!this.yearHierarchy) {
        return null;
      }

      return this.yearHierarchy.value;
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
