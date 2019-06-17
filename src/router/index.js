import Vue from 'vue'
// import store from '../vuex'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "page-login" */ '@/pages/login')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "page-login" */ '@/pages/login')
    },
    {
      path: '/oauth2callback',
      name: 'oauth2callback',
      component: () => import(/* webpackChunkName: "page-oauth2callback" */ '@/pages/oauth2callback')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import(/* webpackChunkName: "page-blog" */ '@/pages/blog')
    }
  ]
})

router.beforeEach((to, from, next) => {
  let refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken && to.name !== 'oauth2callback' && to.name !== 'login') {
    next('/login')
    return
  }
  next()
})

export default router
