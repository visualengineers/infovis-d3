<template>
    <div v-if="regions">
        <label v-for="region in regions">{{region}}<input :value="region" @change="$emit('change', checkedRegions)"
                                                          type="checkbox" v-model="checkedRegions"></label>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component({
    props: {
      regions: Array as new () => string[],
    },
  })
  export default class Key extends Vue {
    public regions?: string[];
    public checkedRegions: string[] = [];
  }
</script>

<style scoped lang="scss">
 label {
  display: block;
}
</style>
