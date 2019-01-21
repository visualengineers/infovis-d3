<template>
  <div id="app">
    <Visualization/>
  </div>
</template>

<script lang="ts">
import Visualization from '@/components/Visualization.vue';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  components: {
    Visualization,
  },
})
export default class App extends Vue {
}
</script>

<style lang="scss">
</style>
