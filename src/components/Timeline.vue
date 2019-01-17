<template>
    <div v-if="years">
        <label>{{value}} <input @change="$emit('change', $event.target.value)" type="range" :min="minYear" :max="maxYear" step="1" v-model="value"></label>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component({
    props: {
      years: Array as new () => number[],
    },
  })
  export default class Timeline extends Vue {
    public years?: number[];
    public value: number | null = this.minYear;


    get minYear(): number | null {
      if (!this.years || this.years.length === 0) {
        return null;
      }
      return Math.min(...this.years);
    }

    get maxYear(): number | null {
      if (!this.years || this.years.length === 0) {
        return null;
      }
      return Math.max(...this.years);
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
