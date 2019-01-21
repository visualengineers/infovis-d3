<template>
    <div v-if="regions">
        <label v-for="region in regions" :style="colorString(region)">{{region}} <input :value="region" @change="$emit('change', checkedRegions)"
                                                          type="checkbox" v-model="checkedRegions"></label>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import * as d3 from 'd3';

  @Component({
    props: {
      regions: Array as new () => string[],
      regionColorScale: Object as () => d3.ScaleOrdinal<string, string>,
    },
  })
  export default class Key extends Vue {
    public regions?: string[];
    public checkedRegions: string[] = [];
    private regionColorScale?: d3.ScaleOrdinal<string, string>;
  
    public colorString(region: string): string | null {
      if (!this.regionColorScale) {
        return 'color:black';
      }

      return 'color:' + this.regionColorScale(region);
    }
  }
</script>

<style scoped lang="scss">
 label {
  display: block;
}
</style>
