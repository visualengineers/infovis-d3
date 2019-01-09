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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
