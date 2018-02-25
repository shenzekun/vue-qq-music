import { SET_HISTORY_KEY, GET_SONG } from './mutation-types';
import { ActionTree, Action } from 'vuex';

const setLocalStorageData: Action<any, any> = ({ commit }, payload) => {
    commit(SET_HISTORY_KEY, payload);
};

const getSong: Action<any, any> = ({ commit }, payload) => {
    commit(GET_SONG, payload);
};

const actions: ActionTree<any, any> = {
    setLocalStorageData,
    getSong
};
export default actions;
