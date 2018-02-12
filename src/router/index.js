import Vue from 'vue'
import Router from 'vue-router'
import NavHeader from '../components/NavHeader';
import App from '../App.vue'
import recommend from '../pages/recommend/recommend';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'recommend',
      component: recommend
    }
  ]
})
