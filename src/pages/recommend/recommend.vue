<template>
  <div class="tab-contents">
    <div class="rec-view tab-content" v-show="!isLoading">
            <swipe :lists="slider" v-if="slider"></swipe>
            <div class="radios">
                <h2 class="title">电台</h2>
                <div class="list">
                    <div class="list-item" v-for="radio in radioList" :key="radio.radioid">
                    <div class="list-media">
                        <img :src="radio.picUrl">
                        <span class="icon icon_play"></span>
                    </div>
                    <div class="list-info">{{radio.Ftitle}}</div>
                </div>
                </div>
            </div>
            <div class="playlists">
                <h2 class="title">热门歌单</h2>
                <div class="list">
                    <div class="list-item" v-for="list in songList" :key="list.id">
                        <a :href='"https://y.qq.com/w/taoge.html?ADTAG=myqq&from=myqq&channel=10007100&id="+list.id'>
                            <div class="list-media">
                                <img :src="list.picUrl">
                                <span class="listen_count"><span class="icon icon_listen"></span>{{list.accessnum | dealNum }}</span>
                                <span class="icon icon_play"></span>
                            </div>
                            <div class="list-info">
                                <div class="list_tit">{{list.songListDesc}}</div>
                                <div class="list-text"></div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
      </div>
      <div class="loading" v-show="isLoading">
            <img src="../../assets/loading.gif" alt="">
            <p>正在加载中.....</p>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Swipe from '../../components/Swipe.vue';
import { RECOMMEND_URL } from '../../config/api';
import { recommendList } from '../../service/getData';
import mixin from '../../config/mixin';

@Component({
    components: {
        Swipe
    },
    mixins: [mixin]
})
export default class recommend extends Vue {
    radioList = null;
    songList = null;
    slider = null;
    isLoading = true;
    mounted() {
        //获取推荐页的数据
        recommendList().then(res => {
                this.radioList = res.data.radioList;
                this.songList = res.data.songList;
                this.slider = res.data.slider;
                this.isLoading = false;
            }).catch(err => {
                console.log(err);
            });
    }
}
</script>

<style lang="scss" scoped>
.radios,
.playlists {
    margin: 14px 10px 10px;
    .title {
        color: #000;
        font-size: 16px;
        margin-bottom: 11px;
        font-weight: normal;
    }
    .list {
        display: flex;
        flex-wrap: wrap;
        .list-item {
            flex: 1;
            width: 45%;
            flex-basis: 40%;
            background-color: #fff;
            font-size: 14px;
            margin-bottom: 10px;
            &:nth-child(2n + 1) {
                margin-right: 8px;
            }
            .list-media {
                position: relative;
                margin-bottom: 5px;
            }
            .list-info {
                height: 36px;
                padding: 0 7px 5px;
                color: #000;
                .list_tit {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .listen_count {
                position: absolute;
                left: 5px;
                bottom: 7px;
                line-height: 12px;
                color: #fff;
            }
            .icon {
                background-image: url('../../assets/list_sprite.png');
                background-repeat: no-repeat;
                background-size: 24px 60px;
            }
            .icon_listen {
                float: left;
                width: 10px;
                height: 10px;
                background-position: 0 -50px;
                margin-right: 5px;
            }
            .icon_play {
                height: 24px;
                bottom: 5px;
                right: 5px;
                width: 24px;
                position: absolute;
                background-position: 0 0;
            }
            img {
                width: 100%;
                display: block;
                min-height: 145px;
            }
        }
    }
}

.tab-contents {
    position: relative;
}
.loading {
    text-align: center;
    position: absolute;
    z-index: 10;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f4f4f4;
    img {
        height: 100px;
        width: 100px;
        margin-top: 127px;
    }
}
</style>
