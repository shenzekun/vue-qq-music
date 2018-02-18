<template>
  <div class="tab-contents">
      <div class="rank-view tab-content" v-show="!isLoading">
          <ul class="toplist">
              <li class="top-item" v-for="item in rankList" :key="item.id">
                <div class="top-item-media">
                <a :href='"https://y.qq.com/w/toplist.html?ADTAG=myqq&from=myqq&channel=10007100&id="+item.id+"&type=top"'>
                    <img :src="item.picUrl">
                    <span class="listen_count"><i class="icon icon-listen"></i>{{item.listenCount | dealNum}}</span>
                </a>
                </div>
                <a :href='"https://y.qq.com/w/toplist.html?ADTAG=myqq&from=myqq&channel=10007100&id="+item.id+"&type=top"'>
                    <div class="top-item-info">
                        <h3 class="top-item-title ellipsis">{{item.topTitle}}</h3>
                        <ul class="top-item-list">
                            <li class="top-item-song" v-for="(song,index) in item.songList">
                                <i class="song-index">{{index + 1}}</i>
                                <span class="song-name">{{song.songname}}</span>- {{song.singername}}
                            </li>
                        </ul>
                    </div>
                </a>
              </li>
          </ul>
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
import { TOPLIST_URL } from '../../config/api';
import mixin from '../../config/mixin';
import { rankList } from '../../service/getData';

@Component({
    mixins: [mixin]
})
export default class rank extends Vue {
    rankList = null;
    isLoading: boolean = true;
    mounted() {
        rankList()
            .then(res => {
                this.rankList = res.data.topList;
                this.isLoading = false;
            })
            .catch(err => {
                console.log(err);
            });
    }
}
</script>

<style lang="scss" scoped>
.rank-view {
    margin: 10px;
}

.toplist {
    margin-bottom: 50px;
    margin-top: 10px;
    .top-item {
        height: 100px;
        background: #fff;
        margin-bottom: 10px;
    }
    .top-item-media {
        float: left;
        position: relative;
        img {
            width: 100px;
            height: 100px;
            display: block;
        }
        .listen_count {
            position: absolute;
            left: 5px;
            bottom: 7px;
            line-height: 12px;
            color: #999494;
            font-size: 9px;
        }
        .icon {
            background-image: url('../../assets/list_sprite.png');
            background-repeat: no-repeat;
            background-size: 24px 60px;
        }
        .icon-listen {
            float: left;
            width: 10px;
            height: 10px;
            background-position: 0 -50px;
            margin-right: 5px;
        }
    }
    .top-item-info {
        position: relative;
        padding: 7px 10px 6px 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        &::after {
            content: '';
            position: absolute;
            right: 10px;
            top: 50%;
            margin-top: -4px;
            width: 6px;
            height: 6px;
            transform: rotate(315deg);
            border-right: 1px solid #b2b2b2;
            border-bottom: 1px solid #b2b2b2;
        }
    }
    .top-item-title {
        color: #000;
        font-size: 16px;
        font-weight: normal;
        margin-bottom: 6px;
    }
    .top-item-list {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.5);
        .top-item-song {
            height: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .song-index {
            float: left;
            min-width: 10px;
            text-align: center;
        }
        .song-name {
            color: #000;
            margin-left: 8px;
            margin-right: 5px;
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
