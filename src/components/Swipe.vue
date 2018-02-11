<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swp-page swiper-slide" v-for="list in lists" :key="list.id">
        <a class="js-no-follow" v-bind:href="list.clickUrl">
          <img class="goods-main-photo fadeIn" :src="list.image">
        </a>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<style scoped>
.swiper-slide img {
    height: 100%;
    width: 100%;
}
</style>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';

@Component
export default class Swipe extends Vue {
    name: 'swipe';
    @Prop({ required: true })
    list: any;

    mounted() {
        new Swiper('.swiper-container', {
            loop: true,
            pagination: {
                el: '.swiper-pagination'
            }
        });
    }
}
</script>