// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/';
import VueLazyload from 'vue-lazyload';

Vue.config.productionTip = false;

Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: require('./assets/default_pic.jpg'),
    loading: require('./assets/default_pic.jpg'),
    attempt: 1
});

const init = new Vue({
    router,
    store,
    components: { App },
    template: '<App/>'
}).$mount('#app');
