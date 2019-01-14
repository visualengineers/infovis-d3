<template>
    <div>KEY</div>
</template>

<script lang="ts">
import { DataProvider } from '@/script/DataProvider';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class Key extends Vue {
  public dataProvider: DataProvider | null = null;



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
