import { SET_HISTORY_KEY } from './mutation-types';

const setLocalStorageData = ({ commit }, keyword) => {
    commit(SET_HISTORY_KEY, keyword);
};

const actions = {
    setLocalStorageData
};
export default actions;
