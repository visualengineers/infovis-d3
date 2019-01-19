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
