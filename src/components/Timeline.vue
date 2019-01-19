<template>
    <div v-if="years">
        <label>{{value}} <input :max="maxYear" :min="minYear"
                                @change="$emit('change', Number.parseInt($event.target.value, 10))" step="1" type="range" v-model="value"></label>
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
    public value: number | null = null;

    public mounted() {
      // TODO does not work yet
      console.log('Creted', this.minYear)
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
