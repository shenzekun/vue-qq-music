import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import NavHeader from '../components/NavHeader';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'NavHeader',
      component: NavHeader
    }
  ]
})
