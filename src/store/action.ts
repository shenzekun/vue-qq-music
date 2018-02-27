import {
    SET_HISTORY_KEY,
    GET_SONG,
    SHOW_PLAYER,
    CANCEL_PLAYER,
    SET_PLAYING_STATE
} from './mutation-types';
import { ActionTree, Action } from 'vuex';

const setLocalStorageData: Action<any, any> = ({ commit }, payload) => {
    commit(SET_HISTORY_KEY, payload);
};

const getSong: Action<any, any> = ({ commit }, payload) => {
    commit(GET_SONG, payload);
};

const showPlayer: Action<any, any> = ({ commit }) => {
    commit(SHOW_PLAYER);
};

const cancelPlayer: Action<any, any> = ({ commit }) => {
    commit(CANCEL_PLAYER);
};

const setPlayState: Action<any, any> = ({ commit }, payload) => {
    commit(SET_PLAYING_STATE, payload);
};

const actions: ActionTree<any, any> = {
    setLocalStorageData,
    getSong,
    showPlayer,
    cancelPlayer,
    setPlayState
};
export default actions;
