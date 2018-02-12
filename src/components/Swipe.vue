<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="list in lists" :key="list.id">
        <a :href="list.linkUrl">
          <img :src="list.picUrl">
        </a>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<style>
@import '../../node_modules/swiper/dist/css/swiper.css';
.swiper-slide img {
    height: 100%;
    width: 100%;
}
.swiper-pagination-bullet {
  width: 6px;
  height: 6px;
}
.swiper-pagination-bullet-active {
  background: white;
}
</style>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Swiper from 'swiper';

@Component
export default class Swipe extends Vue {
    @Prop({ required: true })
    lists: any;

    mounted() {
        new Swiper('.swiper-container', {
            loop: true,
            pagination: {
                el: '.swiper-pagination'
            },
            autoplay: true
        });
    }
}
</script>