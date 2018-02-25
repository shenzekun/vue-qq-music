<template>
   <transition name="show">
        <div id="player" v-show="isShowPlayer" :class="{show: isShowPlayer}">
            <div class="player-container">
                <div class="player-header">
                    <img src="" alt="" class="album-cover">
                    <div class="song-info">
                        <div class="song-name"></div>
                        <div class="song-artist"></div>
                    </div>
                    <span class="icon-action icon-play"></span>
                </div>
                <div class="player-lyrics">
                    <div class="player-lyrics-lines">
                        <div class="player-lyrics-line"></div>
                    </div>
                </div>
                <div class="player-footer">
                    <div class="icon-list"></div>
                    <div class="progress">
                        <div class="progress-time progress-elapsed"></div>
                            <div class="progress-bar">
                                <div class="progress-bar-progress"></div>
                            </div>
                        <div class="progress-time progress-duration"></div>
                    </div>
                    <div class="action">
                        <a href="#" class="btn-download">下载这首歌</a>
                    </div>
                </div>
            </div>
            <div class="player-background"></div>
            <audio src="" ref="audio" @ended="onEnd()"></audio>
        </div><!--player-->
   </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { songUrl, lyricsUrl, albumCoverUrl } from '../config/utils';

@Component
export default class Player extends Vue {
    fetching = false; // 是否正在加载
    duration = 0; //持续时间
    progress = 0; //进度条
    elapsed = 0; //当前时间
    isShowPlayer = false;//是否显示 player

    // 使用 ref 的问题 参考 https://github.com/vuejs/vue-class-component/issues/94
    // $refs: {
    //     audio: HTMLAudioElement
    // }

    mounted() {
        console.log(this.$refs.audio);
    }

    onEnd() {
        (this.$refs.audio as HTMLAudioElement).play()
    }

    getSeconds(line) {
        return +line.replace(
            /^\[(\d{2}):(\d{2}\.\d{2}).*/,
            (match, p1, p2) => +p1 * 60 + parseFloat(<any>+p2)
        );
    }
}
</script>

<style scoped lang="scss">
@import '../style/_var';

.show-enter-active {
    transition: all .5s;
}
.show-leave-active {
    transition: all .5s;
}

#player {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transform: translateX(-100%);
    &.show {
        opacity: 1;
        transform: translateX(0);
    }
    .player-container {
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.6);
        z-index: 9;
    }
    .player-header {
        display: flex;
        padding: 15px;
        align-items: center;
        background: rgba(0, 0, 0, 0.1);
        .album-cover {
            width: 80px;
            height: 80px;
            margin-right: 15px;
        }
        .song-info {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            max-width: calc(100% - 150px);
        }
        .song-name {
            font-size: 18px;
            color: #fff;
            font-weight: normal;
            height: 30px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .song-artist {
            font-size: 14px;
            height: 21px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #fff;
        }
        .icon-action {
            width: 44px;
            height: 44px;
            border: 1px solid #fff;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.1);
            opacity: 0.6;
            background-image: url('../assets/list_sprite.png');
            margin-right: 10px;
            background-repeat: no-repeat;
        }
        .icon-play {
            background-position: -2px -2px;
        }
        .icon-pause {
            background-position: -2px -53px;
        }
    }
    .player-lyrics {
        flex: 1;
        overflow: hidden;
        margin: 36px 0 60px 0;
        color: rgba(255, 255, 255, 0.6);
        max-height: calc(100% - 205px);
        .player-lyrics-lines {
            overflow: hidden;
            transition: 0.5s;
        }
        .player-lyrics-line {
            height: 42px;
            line-height: 42px;
            overflow: hidden;
            padding: 0 15px;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.6);
            text-align: center;
        }
        .active {
            color: $color-primary;
        }
    }
    .player-footer {
        position: relative;
        .icon-list {
            top: -40px;
            width: 40px;
            height: 40px;
            position: absolute;
            right: 20px;
            background-image: url(../assets/sprite_play.png);
            background-repeat: no-repeat;
            background-size: 40px 380px;
            background-position: 8px 10px;
        }
        .progress {
            display: flex;
            align-items: center;
        }
        .progress-bar {
            flex: 1;
            overflow: hidden;
            background-color: rgba(255, 255, 255, 0.2);
            .progress-bar-progress {
                width: 100%;
                height: 2px;
                transform: translateX(-100%);
                background: $color-primary;
            }
        }
        .progress-time {
            z-index: 1;
            width: 55px;
            font-size: 12px;
            color: #808080;
            line-height: 40px;
            text-align: center;
            letter-spacing: 1px;
        }
        .action {
            height: 65px;
            margin-top: 10px;
        }
        .btn-download {
            display: block;
            height: 45px;
            line-height: 45px;
            margin: 0 50px;
            padding: 0 55px;
            overflow: hidden;
            border-radius: 999px;
            background-color: $color-primary;
            color: #fff;
            text-align: center;
            font-size: 20px;
            white-space: nowrap;
            background-image: url(../assets/sprite_play.png);
            background-repeat: no-repeat;
            background-size: 43px 380px;
            background-position: 6px -321px;
        }
    }
    .player-background {
        position: absolute;
        top: 0;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-size: cover;
        filter: blur(15px);
        background-position: bottom center;
        transform: scale(1.15);
    }
}
</style>
