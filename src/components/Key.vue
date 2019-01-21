<template>
    <div v-if="regions">
        <label v-for="region in regions" ><span class="dot" :style="colorString(region)"></span> {{region}} <input :value="region" @change="$emit('change', checkedRegions)"
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
  
    public colorString(region: string): string {
      if (!this.regionColorScale) {
        return 'background-color:black';
      }

      return 'background-color:' + this.regionColorScale(region);
    }
  }
</script>

<style scoped lang="scss">
 label {
  display: block;
}
.dot {
  height: 15px;
  width: 15px;
  border: 1px solid black;
  border-radius: 50%;
  display: inline-block;
}
</style>
