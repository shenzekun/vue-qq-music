import { GET_HISTORY_KEY } from './mutation-types';
import { ActionTree } from 'vuex';

const getLocalStorageData = ({ commit }, payload) => {
    commit(GET_HISTORY_KEY, payload.historyKey);
};

const actions = {
    getLocalStorageData
};
export default actions;
