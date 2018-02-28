<template>
  <div class="tab-contents">
     <div class="search-view tab-content" @click="onClick($event)">
          <div class="search-bar">
            <div class="input-wrap">
                <input type="text" id="search" placeholder="搜索歌曲、歌单、专辑" v-model.trim="keyword"
                @keyup="enter($event)"
                >
                <span class="icon-search"></span>
                <span class="icon-delete" v-show="isShowDelete">删除</span>
            </div>
            <div class="search-cancel" v-show="isShowCancel">取消</div>
          </div>
          <div class="record-keys" v-if="history.length > 0 && isShowHistory">
            <li v-for="item in history">
                <div class="record-main">
                    <span class="icon icon-clock"></span>
                    <span class="record-con ellipsis">{{item}}</span>
                    <span class="icon icon-close"></span>
                </div>
            </li>
            <p class="record-delete">清除搜索记录</p>
          </div>
          <div class="search-results" v-show="isShowSearchResults">
                <div class="song-list">
                    <div class="song-item" 
                        v-for="list in searchResult" :key="list.songid"
                        @click="showPlayerDetail(list)"
                        >
                        <i class="icon icon-music"></i>
                        <div class="song-name" v-html="list.songname"></div>
                        <div class="song-artist"><span v-for="artist in list.singer" v-html="artist.name+'&nbsp;'"></span></div>
                    </div>
                </div>
                <div class="search-loading show" v-show="fetching">
                    <i class="loading-icon"></i>
                    <div class="loading-text">正在载入更多...</div>
                </div>
                <div class="search-loading show" v-show="!isLoad">
                    <div class="loading-done">已加载全部</div>
                </div>
          </div>
          <div class="mod-search-result" id="hot-keys" v-show="!isShowHistory && !isShowSearchResults">
               <h3 class="result-tit">热门搜索</h3>
               <div class="result-tags">
                  <a :href="data.special_url" class="tag tag-hot" v-if="data.special_url">{{data.special_key}}</a>
                  <div class="tag tag-keyword" v-for="hotkey in hotkeys" :key="hotkey.n">{{hotkey.k}}</div>
               </div>
          </div>
     </div> <!-- search-view -->
     <player :song="song" :artist="artist" v-if="isShowPlayer"></player>
  </div> <!-- tab-contents -->
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { hotList, searchList } from '../../service/getData';
// import { mapState, mapMutations, mapActions } from 'vuex';
// import * as actions from '../../store/action';
import { Action } from 'vuex-class';
import { Watch } from 'vue-property-decorator';
import Player from '../../components/Player.vue';

@Component({
    components: {
        Player
    }
})
export default class search extends Vue {
    hotkeys = null; //获取黑色的 hotkey
    data = ''; //获取红色的 hotkey
    keyword = ''; // 获取用户的搜索内容
    getLastKeyword = ''; // 获取用户上一次的搜索内容
    fetching = false; //正在 fetch
    isLoad = true; //能否继续加载数据
    page = 1; //默认页数为1
    isShowCancel = false; // 是否显示取消
    isShowDelete = false; // 是否显示取消
    isShowHistory = false; // 是否显示历史记录
    isShowSearchResults = false; //是否显示搜索结果
    songsObject = {}; // 存放歌曲,用来判断是否搜索改变了
    searchResult = null; //搜索结果
    history = []; // 放历史记录

    @Action('setLocalStorageData') setLocalStorageData;
    @Action('showPlayer') showPlayer;
    @Action('getSong') getSong;

    // 计算 song
    get song() {
        return this.$store.state.song;
    }

    // 计算artist
    get artist() {
        return this.$store.state.artist;
    }

    // 计算 isShowPlayer
    get isShowPlayer() {
        return this.$store.state.isShowPlayer;
    }

    created() {
        hotList().then(res => {
            let hotkey = res.data.hotkey;
            this.data = res.data;
            this.hotkeys = this.shuffle(hotkey, 6);
        });
    }

    mounted() {
        window.addEventListener('scroll', this.onScroll.bind(this));
        this.history = localStorage.getItem('SET_HISTORY_KEY')
            ? localStorage.getItem('SET_HISTORY_KEY').split(',')
            : [];
    }

    // 用户按 enter 时
    enter(e) {
        if (this.keyword) {
            this.isShowDelete = true;
        } else {
            this.isShowDelete = false;
            this.reset();
        }
        if (e.keyCode !== 13) return;
        this.isShowHistory = false;
        this.isShowSearchResults = true;
        this.addHistory(this.keyword);
        this.search(this.keyword);
    }

    // 点击事件
    onClick(e) {
        //如果点击到了输入按钮
        if (e.target.matches('#search')) {
            this.isShowCancel = true;
            this.isShowHistory = true;
        }

        //如果点击到了取消按钮
        if (e.target.matches('.search-cancel')) {
            this.isShowCancel = false;
            this.isShowDelete = false;
            this.isShowHistory = false;
            this.reset();
        }

        //如果点击到了删除按钮
        if (e.target.matches('.icon-delete')) {
            this.isShowDelete = false;
            this.reset();
        }

        // 如果匹配到了清除搜索记录
        if (e.target.matches('.record-delete')) {
            this.history = [];
            this.setLocalStorageData(this.history);
        }

        //如果匹配到了单条记录的删除按钮
        if (e.target.matches('.icon .icon-close')) {
            let index = this.history.indexOf(e.target.previousElementSibling.innerHTML);
            this.history.splice(index, 1);
            this.setLocalStorageData(this.history);
        }

        //如果点到了热门搜索的关键词或者点到了搜索记录的歌
        if (e.target.matches('.tag-keyword') || e.target.matches('.record-con')) {
            this.keyword = e.target.innerHTML;
            this.isShowDelete = true;
            this.isShowCancel = true;
            this.isShowHistory = false;
            this.isShowSearchResults = true;
            this.addHistory(this.keyword);
            this.search(this.keyword);
        }
    }

    // 搜索
    search(keyword, page?: number) {
        //刚进来时 keyword为 undefined ，因为没有 enter
        if (keyword === undefined) keyword = '';
        if (keyword === '') return;
        //如果已经搜索过，并且没有改动 keyword 那么直接返回
        if (this.getLastKeyword === keyword && this.songsObject[page || this.page]) return;
        if (this.getLastKeyword !== keyword) this.reset();
        if (this.fetching || !this.isLoad) return;
        this.getLastKeyword = keyword;
        this.loading();
        searchList(keyword, page || this.page)
            .then(res => {
                this.page = res.data.song.curpage;
                this.songsObject[this.page] = res.data.song.list;
                if (this.searchResult) {
                    this.searchResult = this.searchResult.concat(res.data.song.list);
                } else {
                    this.searchResult = res.data.song.list;
                }
                this.isLoad = res.message !== 'no results';
            })
            .then(() => this.accomplish())
            .catch(err => {
                console.log(err);
            });
    }

    // 滚动事件
    onScroll(e) {
        if (this.isLoad) {
            if (
                document.documentElement.clientHeight + pageYOffset >
                document.body.scrollHeight - 100
            ) {
                this.search(this.keyword, this.page + 1);
            }
        } else {
            return window.removeEventListener('scroll', this.onScroll.bind(this));
        }
    }

    // 全部渲染完成，没有歌了
    accomplish() {
        this.fetching = false;
    }

    // 显示正在加载动画
    loading() {
        this.fetching = true;
    }

    // 重置
    reset() {
        this.page = 1;
        this.isLoad = true;
        this.songsObject = {};
        this.searchResult = null;
    }

    // 添加历史
    addHistory(keyword) {
        let index = this.history.indexOf(keyword);
        if (index === -1) {
            this.history.unshift(keyword);
            this.setLocalStorageData(this.history);
        }
    }

    //洗牌
    shuffle(array, count: number) {
        let arr = [];
        let len = Math.min(count, array.length);
        for (let i = 0; i < len; i++) {
            let temp = array;
            let random = Math.floor(Math.random() * temp.length);
            arr[i] = temp[random];
            array.splice(random, 1);
        }
        return arr;
    }

    // 显示 player 的信息
    showPlayerDetail(list) {
        this.showPlayer();
        this.getSong({ ...list });
    }
}
</script>

<style scoped lang="scss">
@mixin ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.search-bar {
    display: flex;
    background: #f4f4f4;
    padding: 10px;
    .input-wrap {
        flex: 1;
        position: relative;
        border-radius: 3px;
        background: #fff;
        padding: 8px 12px 8px 35px;
    }
    .icon-delete {
        position: absolute;
        top: 9px;
        right: 12px;
        width: 18px;
        height: 18px;
        background: #b1b1b1;
        border-radius: 99px;
        text-indent: -9999px;
        &::after {
            width: 2px;
            height: 10px;
            margin-left: -1px;
            margin-top: -5px;
        }
        &::before {
            width: 10px;
            height: 2px;
            margin-left: -5px;
            margin-top: -1px;
        }
        &::after,
        &::before {
            content: '';
            display: block;
            position: absolute;
            left: 50%;
            top: 50%;
            border-radius: 8px;
            background: #fff;
            -webkit-transform: rotate(45deg);
        }
    }

    .search-cancel {
        margin-top: 8px;
        font-size: 14px;
        color: #555;
        padding-left: 10px;
    }
    #search {
        outline: none;
        height: 20px;
        flex: 1;
        line-height: 20px;
        width: 100%;
        color: rgba(0, 0, 0, 0.3);
        border: 0;
        font-size: 14px;
    }
    input::-webkit-input-placeholder {
        /* WebKit browsers*/
        color: #ccc;
    }
    input:-moz-placeholder {
        /* Mozilla Firefox 4 to 18*/
        color: #ccc;
    }
    input::-moz-placeholder {
        /* Mozilla Firefox 19+*/
        color: #ccc;
    }
    input:-ms-input-placeholder {
        /* Internet Explorer 10+*/
        color: #ccc;
    }
    .icon-search {
        position: absolute;
        width: 18px;
        height: 18px;
        top: 11px;
        left: 10px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJlSURBVFhH7ZfRShRRHMb3Jkqzm7wJSrqIIDBxX6C0a62H6C7oqq4ixYreQMmMHkXbjLQeIYgyQuqiyIuotKDt923fyLCszv/MzF5EDnzs2T3/7zffOXNm5myjcXDUOAOtVquJ7qOn6AP6ZamtQ33NGk/ZG8VJJtEaagf1XJ7agwEdRI9zIT7RnkdT6Iz7VaO2flPf51z9I9oDtQQDNIxeGv6Nz9voaBFcNa79bu8LsYp8+/Z75FmYN3w/nwqUB204lFiDqYzd+txlek37RFkQ3pNIjDZaKsXBeMkATfloKUjOBGMMifUbXUzmYVp3oFvJ5j0M8GbNXEtiYtJzRtOru6lwAUfhsIZQdveNR30NTPccaD5sChbCXTD7btDSUCAdmqGpsClYCHPa7CdBSyeQXgEKNBI2BQthnjX7Y9DSCfTTpkNhU7AQ7jGzd4KWvgc67EDbKYH6eclOO9BmSqBsUU+HTcFCwJcdaCVo6Vyy7LZfCJuChbAfONCdoKUTKHsw6iE2FDYWFIqFthxoLImLSZsr3fqzScZ9isUyczWZiXEC6UWoF2LaaHqcDcY4+mHmheRAMmBe8oje8nmqFOQvZwS9N2uxLEcgbUuzDdpGmZnyzLxzGG3yqm1lARxH2VZEUz6DChc6NXoia83I087pRukZyozAjqCHvv6Cf0GL6Ao655MrgNr6TX1bDqF1qO/Xcv7qobymJoA+6xpxfvtd7vvqdxcw7au1h3iwbufn0dj6hb6ibbsjvtzx8w9b30jvwqf/QqibVQZYm7drpg5C7TmzuZnSI6JZ2yWoAnKo61UY/5f3Dy7dC4CdAEhQAAAAAElFTkSuQmCC);
        background-size: cover;
        background-repeat: no-repeat;
        z-index: 3;
        text-indent: -999px;
    }
}
.record-keys {
    background: #fff;
    li {
        border-top: 1px solid #ededed;
        padding: 0 15px;
        list-style: none;
        .record-main {
            position: relative;
            display: block;
            height: 44px;
            line-height: 44px;
            .icon-clock {
                position: absolute;
                left: 0;
                top: 12px;
                width: 20px;
                height: 20px;
                background-image: url(../../assets/clock_ic.png);
                background-repeat: no-repeat;
                background-size: cover;
                text-indent: -999px;
            }
            .record-con {
                position: absolute;
                left: 40px;
                right: 50px;
                display: block;
                height: 44px;
                line-height: 44px;
                color: #000;
                font-size: 14px;
                @include ellipsis;
            }
            .icon-close {
                position: absolute;
                right: 0;
                top: 12px;
                width: 20px;
                height: 20px;
            }
            .icon-close:before,
            .icon-close:after {
                position: absolute;
                left: 0;
                top: 0;
                content: '';
                background: rgba(0, 0, 0, 0.6);
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
            }
            .icon-close:before {
                width: 17px;
                height: 1px;
                top: 8px;
            }
            .icon-close:after {
                width: 1px;
                height: 17px;
                left: 8px;
            }
        }
    }
    .record-delete {
        text-align: center;
        font-size: 12px;
        height: 44px;
        line-height: 44px;
        color: #47c88a;
    }
}

.mod-search-result {
    background: #fff;
    padding: 15px 15px 10px 15px;
    & .result-tit {
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: bold;
    }
    & .result-tags {
        font-size: 0;
    }
    & .tag {
        display: inline-block;
        font-size: 14px;
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        color: #000;
        border: 1px solid rgba(0, 0, 0, 0.6);
        border-radius: 99px;
        word-break: keep-all;
        margin-bottom: 10px;
        margin-right: 14px;
    }
    & .tag-hot {
        color: #fc4524;
        border-color: #fc4524;
    }
}
.search-results {
    .song-item {
        display: block;
        position: relative;
        height: 55px;
        padding-left: 56px;
        overflow: hidden;
        background: #fff;
        border-bottom: 1px solid #ddd;
    }
    .song-name {
        margin: 10px 0 2px;
        line-height: 18px;
        font-size: 16px;
        font-weight: normal;
        color: #000;
        @include ellipsis;
    }
    .song-artist {
        color: #808080;
        font-size: 12px;
        @include ellipsis;
    }
    .icon-music {
        left: 18px;
        top: 18px;
        width: 22px;
        height: 20px;
        position: absolute;
        background-position: 0 0;
        background-size: cover;
        background-repeat: no-repeat;
        background-image: url('../../assets/search_sprite.png');
    }
}

.search-loading {
    height: 55px;
    text-align: center;
    position: relative;
    display: block;
    align-items: center;
    justify-content: center;
    &.show {
        display: flex;
    }
    .loading-icon {
        width: 20px;
        height: 20px;
        position: relative;
        background-size: cover;
        background-image: url('../../assets/icon_loading.png');
        animation: loading 1s infinite;
    }
    .loading-text {
        margin-left: 5px;
    }
    .loading-done,
    .loading-text {
        color: #808080;
        font-size: 12px;
    }
}

@keyframes loading {
    0% {
        transform: rotate(0deg);
    }
    8.32% {
        transform: rotate(0deg);
    }
    8.33% {
        transform: rotate(30deg);
    }
    16.66% {
        transform: rotate(30deg);
    }
    16.67% {
        transform: rotate(60deg);
    }
    24.99% {
        transform: rotate(60deg);
    }
    33.32% {
        transform: rotate(90deg);
    }
    25% {
        transform: rotate(90deg);
    }
    33.33% {
        transform: rotate(120deg);
    }
    41.66% {
        transform: rotate(120deg);
    }
    41.67% {
        transform: rotate(150deg);
    }
    49.99% {
        transform: rotate(150deg);
    }
    50% {
        transform: rotate(180deg);
    }
    58.32% {
        transform: rotate(180deg);
    }
    58.33% {
        transform: rotate(210deg);
    }
    66.65% {
        transform: rotate(210deg);
    }
    66.66% {
        transform: rotate(240deg);
    }
    74.99% {
        transform: rotate(240deg);
    }
    75% {
        transform: rotate(270deg);
    }
    83.32% {
        transform: rotate(270deg);
    }
    83.33% {
        transform: rotate(300deg);
    }
    91.66% {
        transform: rotate(300deg);
    }
    91.67% {
        transform: rotate(330deg);
    }
    99.99% {
        transform: rotate(330deg);
    }
}
.tab-contents {
    position: relative;
}
</style>
