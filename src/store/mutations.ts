import { SET_HISTORY_KEY } from './mutation-types';

export default {
    [SET_HISTORY_KEY](state, keyword) {
        state.historyKey = keyword;
        localStorage.setItem('SET_HISTORY_KEY', keyword);
    }
};
