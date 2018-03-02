<template>
   <transition name="show-transition">
        <div id="player" v-show="isShowPlayer" :class="{show: isShowPlayer}">
            <div class="player-container">
                <div class="player-header">
                    <img :src="getAlbumCover(song.albummid)" alt="图片" class="album-cover">
                    <div class="song-info">
                        <div class="song-name" v-html="song.songname"></div>
                        <div class="song-artist" v-html="artist"></div>
                    </div>
                    <span class="icon-action icon-play" :class="[isPlay? 'icon-pause':'icon-play']" @click="onPlay"></span>
                </div>
                <div class="player-lyrics">
                    <div class="player-lyrics-lines" ref="lyricsLines">
                        <div class="player-lyrics-line" v-for="list in lyrics" v-show="lyrics.length !== 0">{{list.slice(10)}}</div>
                        <div class="player-lyrics-line" v-show="fetching">正在加载歌词,请等待...</div>
                    </div>
                </div>
                <div class="player-footer">
                    <div class="icon-list" @click="exit"></div>
                    <div class="progress">
                        <div class="progress-time progress-elapsed">{{elapsed | formatTime}}</div>
                            <div class="progress-bar">
                                <div class="progress-bar-progress" ref="$progress"></div>
                            </div>
                        <div class="progress-time progress-duration">{{song.interval | formatTime}}</div>
                    </div>
                    <div class="action">
                        <a href="#" class="btn-download">下载这首歌</a>
                    </div>
                </div>
            </div>
            <div class="player-background" :style="{backgroundImage: 'url('+getAlbumCover(song.albummid)+')'}"></div>
            <audio :src="getSongUrl(song.songmid)" ref="audio" @ended="onEnd()"></audio>
        </div><!--player-->
   </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { songUrl, lyricsUrl, albumCoverUrl } from '../config/utils';
import { Action } from 'vuex-class';
import { Prop, Watch } from 'vue-property-decorator';
import mixin from '../config/mixin';
import { getLyrics } from '../service/getData';

@Component({
    mixins: [mixin]
})
export default class Player extends Vue {
    @Prop(Object) song;

    @Prop(String) artist;

    @Action('cancelPlayer') cancelPlayer;
    @Action('setPlayState') setPlayState;
    

    fetching = false; // 是否正在加载
    isplay = false; // 是否 play

    duration = this.song.interval; //持续时间
    progress = 0; //进度条
    elapsed = 0; //当前时间
    progressIntervalId = 0; // 进度条setInterval 返回的 id

    lyrics = []; //歌词
    index = 0; // 歌词页数
    LINE_HEIGHT = 42; // 歌词的高度
    lyricIntervalId = 0; // 歌词setInterval 返回的 id

    // 使用 ref 的问题 参考 https://github.com/vuejs/vue-class-component/issues/94
    // $refs: {
    //     audio: HTMLAudioElement,
    //     lyricsLines: HTMLDivElement
    // }

    // 计算isShowPlayer
    get isShowPlayer() {
        return this.$store.state.isShowPlayer;
    }

    get isPlay() {
        return this.$store.state.isPlay;
    }

    get $audio() {
        return this.$refs.audio as HTMLAudioElement;
    }

    get $progress() {
        return this.$refs.$progress as HTMLDivElement;
    }

    get $lyricsLines() {
        return this.$refs.lyricsLines as HTMLDivElement;
    }

    created() {
        this.init();
    }

    mounted() {
        document.body.classList.add('noscroll');
    }

    // 初始化
    init() {
        this.fetching = true;
        getLyrics(this.song.songid)
            .then(res => res.lyric)
            .then(text => {
                this.index = 0;
                this.lyrics = this.formatText(text).match(/^\[\d{2}:\d{2}.\d{2}\](.+)$/gm);
            })
            .catch(err => console.error(err))
            .then(() => (this.fetching = false));
    }

    // 播放音频
    onPlay() {
        this.isplay = !this.isplay;
        // 如果是 play
        if (this.isplay) {
            if (this.fetching) return;
            this.$audio.play();
            this.setPlayState(true);
            this.startLyrics();
            this.startProgress();
        } else { // 如果是 pause
            this.$audio.pause();
            this.setPlayState(false); // 设置 play 的状态
            this.pauseLyrics();
            this.pauseProgress();
        }
    }

    // 当一首歌播放结束的时候重新播放
    onEnd() {
        this.$audio.play();
        this.restartProgress();
        this.restartLyrics();
    }

    startLyrics() {
        this.pauseLyrics();
        this.lyricIntervalId = setInterval(this.updateLyrics.bind(this), 1000);
    }

    // 暂停歌词
    pauseLyrics() {
        clearInterval(this.lyricIntervalId);
    }

    //更新歌词
    updateLyrics() {
        let _this = this;
        this.$audio.ontimeupdate = function(e) {
            for (let i = 0, l = _this.lyrics.length; i < l; i++) {
                if (
                    _this.$audio.currentTime /*当前播放的时间*/ >
                    _this.getSeconds(_this.lyrics[i]) - 0.5
                ) {
                    _this.$lyricsLines.children[_this.index].classList.remove('active');
                    _this.$lyricsLines.children[i].classList.add('active');
                    _this.index = i;
                }
            }
        };
        if (this.index > 2) {
            let y = -(this.index - 2) * this.LINE_HEIGHT;
            this.$lyricsLines.style.transform = `translateY(${y}px)`;
        }
    }

    // 重置歌词
    resetLyrics() {
         this.pauseLyrics();
         this.$lyricsLines.children[this.index].classList.remove('active');
         this.index = 0;
         this.$lyricsLines.style.transform = `translateY(0)`;
         if (this.lyrics.length) {
             this.$lyricsLines.children[this.index].classList.add('active');
         }
    }

    // 重新开始歌词
    restartLyrics() {
         this.resetLyrics();
         this.startLyrics();
    }

    // 启动进度条
    startProgress() {
        this.pauseProgress();
        this.progressIntervalId = setInterval(this.updateProgress.bind(this), 50);
    }

    // 暂停进度条
    pauseProgress() {
        clearInterval(this.progressIntervalId);
    }

    // 更新进度条
    updateProgress() {
        this.elapsed += 0.05;
        this.progress = this.elapsed / this.duration;
        this.$progress.style.transform = `translateX(${this.progress * 100 - 100}%)`;
    }

    //重置进度条
    resetProgress(duration?: number) {
        let $progress = this.pauseProgress();
        this.elapsed = 0;
        this.progress = 0;
        this.$progress.style.transform = 'translate(-100%)';
        if (duration) {
            this.duration = +duration;
        }
    }

    // 重新开始进度条
    restartProgress() {
        this.resetProgress();
        this.startProgress();
    }

    // 获取图片地址
    getAlbumCover(id: number) {
        return albumCoverUrl(id);
    }

    // 获取歌词的地址
    getSongUrl(id: number) {
        return songUrl(id);
    }

    //退出 player
    exit() {
        this.cancelPlayer();
        this.setPlayState(false);
        document.body.classList.remove('noscroll');
    }

    //获取秒数
    getSeconds(line) {
        return +line.replace(
            /^\[(\d{2}):(\d{2}\.\d{2}).*/,
            (match, p1, p2) => +p1 * 60 + parseFloat(<any>+p2)
        );
    }

    //格式化文本 类似[xx:xx.xx]xxxxx
    formatText(text) {
        let div = document.createElement('div');
        div.innerHTML = text;
        return div.innerText;
    }
}
</script>

<style lang="scss" scoped>
@import '../style/_var';
@import '../style/utils.scss';
.show-transition-enter-active {
    transition: transform .3s;
}
.show-transition-leave-active {
    transition: transform .3s;
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
    transition: all .5s;
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
            @include ellipsis;
        }
        .song-artist {
            font-size: 14px;
            height: 21px;
            color: #fff;
            @include ellipsis;
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
            padding: 0 15px;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.6);
            text-align: center;
            @include ellipsis;
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
