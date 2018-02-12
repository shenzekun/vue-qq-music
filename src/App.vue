<template>
  <div id="app">
    <nav-header></nav-header>
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import NavHeader from './components/NavHeader.vue';

@Component({
  components: {
    NavHeader
  }
})
export default class App extends Vue {
}
</script>

<style lang="scss">
@import './style/_var';
@import './style/reset';
body {
    background: $body-background;
}
</style>