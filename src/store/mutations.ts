import { SET_HISTORY_KEY, GET_SONG, SHOW_PLAYER, CANCEL_PLAYER, SET_PLAYING_STATE } from './mutation-types';
import { Mutation, MutationTree } from 'vuex';

const mutations: MutationTree<any> = {
    // 缓存搜索历史
    [SET_HISTORY_KEY](state, keyword) {
        localStorage.setItem('SET_HISTORY_KEY', keyword);
    },
    // 获取歌曲
    [GET_SONG](state, payload) {
        state.song = payload;
        state.song.singer.forEach(singer => {
            state.artist = singer.name;
        });
    },
    // 显示 player
    [SHOW_PLAYER](state) {
        state.isShowPlayer = true;
    },
    // 不显示 player
    [CANCEL_PLAYER](state) {
        state.isShowPlayer = false;
    },
    // 播放状态（true/false)
    [SET_PLAYING_STATE](state, flag) {
        state.isPlay = flag;
    }
};

export default mutations;
