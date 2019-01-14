<template>
    <div v-if="years">
        <input @change="$emit('change', $event.target.value)" type="range" list="steps">

        <datalist id="steps" style="display: inline">
            <option v-for="year in sortedYears" :value="year" :label="year"></option>
        </datalist>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component({
    props: {
      years: Array as number[],
    }
  })
  export default class Timeline extends Vue {
    public years?: number[];

    get sortedYears(): number[] {
      return (this.years || []).sort();
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
