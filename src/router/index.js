import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store';
Vue.use(VueRouter)

const routes = [{
    path: '/recom',
    name: 'Recom',
    meta: {
      show: true
    },
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
    path: '/user',
    name: 'User',
    component: () => import('../views/User.vue'),
    beforeEnter: (to, from, next) => {
      let cookies = router.app.$options.store.getters.getLoginCookie ? router.app.$options.store.getters.getLoginCookie : document.cookie;
      if (!cookies) {
        next('/login');
      } else {
        next();
      }
    }
  }, {
    path: '/search',
    name: 'Search',
    meta: {
      show: true
    },
    component: () => import('../views/Search.vue'),

  }, {
    path: '/rank',
    name: 'RankList',
    component: () => import('../views/RankList.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  // 注册一个全局守卫,检测到某个路由显示播放页面
  let prevRoute = to.meta.show;
  if (prevRoute) {
    router.app.$options.store.commit('setPlayViewShow', true)
  } else {
    router.app.$options.store.commit('setPlayViewShow', false);
    router.app.$options.store.commit('setShowPlayList', false)
  }
  // router.app.$options.store.dispatch('setPlayShow', true).then((i) => {
  //   console.log(i);
  // })
  store.dispatch('CLEANLOADING');
  next();
  // console.log(prevRoute);
})
export default router