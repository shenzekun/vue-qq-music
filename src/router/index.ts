// declare function require(moduleName: string): any;
import Vue from 'vue';
import Router from 'vue-router';
import NavHeader from '../components/NavHeader.vue';
import App from '../App.vue';
import recommend from '../pages/recommend/recommend.vue';

// ts 按需加载需要@types/webpack-env 这个包
const rank = r => require.ensure([], () => r(require('../pages/rank/rank')), 'rank');
const search = r => require.ensure([], () => r(require('../pages/search/search')), 'search');

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '',
            component: recommend
        },
        {
            path: '/',
            name: 'recommend',
            component: recommend
        },
        {
            path: '/rank',
            name: 'rank',
            component: rank
        },
        {
            path: '/search',
            name: 'search',
            component: search
        }
    ]
});
