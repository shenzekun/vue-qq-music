<template>
  <div class="tab">
      <div class="search-results">
            <div class="song-list"></div>
            <div class="search-loading">
                <i class="loading-icon"></i>
                <div class="loading-text">正在载入更多...</div>
                <div class="loading-done hide">已加载全部</div>
            </div>
      </div>
      <div class="mod-search-result" id="hot-keys">
            <h3 class="result-tit">热门搜索</h3>
            <div class="result-tags">

            </div> 
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class search extends Vue {
    mounted() {}
}
</script>

<style scoped lang="scss">

</style>
