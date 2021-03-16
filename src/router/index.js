import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/recom',
    name: 'Recom',
    component: () => import('../views/Recommend.vue')
  },
  {
    path: '/',
    name: 'Player',
    component: () => import('../views/Player.vue')
  },
  {
    path: '/player',
    name: 'Player',
    component: () => import('../views/Player.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }, {
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/Setting.vue')
  }, {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }, {
    path: '/search',
    name: 'Search',
    meta: {
      keepAlive: true
    },
    component: () => import('../views/Search.vue'),
    // children: [{
    //   path: '/players',
    //   component: () => import('../views/Player.vue'),
    // }]
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router