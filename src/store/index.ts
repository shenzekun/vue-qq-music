import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './action';
Vue.use(Vuex);

const state = {
    isShowPlayer: false, // 是否显示 player
    song: {}, // 歌的信息
    artist: '', // 歌的作者
    isPlay: false // 是否播放
};
export default new Vuex.Store({
    state,
    actions,
    mutations
});
