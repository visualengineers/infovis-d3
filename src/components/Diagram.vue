<template>
    <div>
        <div>DIAGRAM: {{JSON.stringify(data)}}</div>
        <div>DIAGRAM: {{JSON.stringify(selectedRegions)}}</div>
    </div>
</template>

<script lang="ts">
  import { DataGroup } from '@/script/DataGroup';
  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component({
    props: {
      data: Array as new () => DataGroup[],
      selectedRegions: Array as new () => string[],
    },
  })
  export default class Diagram extends Vue {
    public data?: DataGroup[] | null;
    public selectedRegions?: string[];
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
