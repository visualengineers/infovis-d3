<template>
    <div v-if="regions">
        <label v-for="region in regions" :key="region">{{region}} <input :value="region" @change="$emit('change', checkedRegions)"
                                                          type="checkbox" v-model="checkedRegions"></label>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Watch } from 'vue-property-decorator';

  @Component({
    props: {
      regions: Array as new () => string[],
    },
  })
  export default class Key extends Vue {
    public regions?: string[];
    public checkedRegions?: string[] = [];

    @Watch('regions')
    public onRegionsChanged() {
      this.checkedRegions = this.regions;
      this.$emit('change', this.checkedRegions);
    }
  }
</script>

<style scoped lang="scss">
 label {
  display: block;
}
</style>
