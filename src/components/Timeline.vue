<template>
    <b-col cols="7" offset="2" v-if="years">
        <label>{{value}} <input :max="maxYear" :min="minYear"
                                @input="$emit('change', Number.parseInt($event.target.value, 10))" step="1" type="range" v-model="value"></label>
    </b-col>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Watch } from 'vue-property-decorator';

  @Component({
    props: {
      years: Array as new () => number[],
    },
  })
  export default class Timeline extends Vue {
    public years?: number[];
    public value: number | null = null;

    @Watch('years')
    public onYearsChanged() {
      this.value = this.minYear;
      this.$emit('change', this.value);
    }

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
  input, label {
      width: 100%;
  }
</style>
