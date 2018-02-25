import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './action';
Vue.use(Vuex);

const state = {
    historyKey: '',
    isShowPlayer: false,
    song: '',
    artist: ''
};
export default new Vuex.Store({
    state,
    actions,
    mutations
});
