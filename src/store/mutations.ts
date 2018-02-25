import { SET_HISTORY_KEY, GET_SONG } from './mutation-types';
import { Mutation, MutationTree } from 'vuex';

interface IGetKeyWord {
    keyword: string;
}
interface IGetSong {
    song: any;
    artist: string;
}
const mutations: MutationTree<any> = {
    [SET_HISTORY_KEY](state, payload: IGetKeyWord) {
        state.historyKey = payload.keyword;
        localStorage.setItem('SET_HISTORY_KEY', payload.keyword);
    },
    [GET_SONG](state, payload: IGetSong) {
        state.isShowPlayer = true;
        state.song = payload.song;
        state.artist = payload.artist;
    }
};

export default mutations;
