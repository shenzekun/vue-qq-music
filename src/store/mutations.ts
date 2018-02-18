import { GET_HISTORY_KEY } from './mutation-types';

export default {
    [GET_HISTORY_KEY](state, keyword) {
        state.historyKey = keyword;
        console.log(state.historyKey);
        localStorage.getItem(state.historyKey);
        console.log('GET_HISTORY_KEY' + keyword);
    }
};
