import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store';
import util from '@/util/util'
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
    name: 'PlayerHome',
    component: () => import('../views/Player.vue'),
    beforeEnter:(to,from,next)=>{
      // if(router.app.$options.store.state.musicInfo.musicID==0&&router.app.$options.store.state.musicInfo.albumID==0){
      //   router.app.axios.get("/personalized/newsong?limit=10").then((re) => {
      //     let random = parseInt(Math.random() * re.data.result.length);
      //     let data = re.data.result[random];
      //     //计算总时间
      //     let duration = parseInt(data.song.duration / 1000);
      //     let totalTime = util.playTimeFormat(duration)
    
      //     // console.log(data);
      //     let MusicInfo = [];
      //     MusicInfo.push({
      //       musicID: data.id,
      //       musicName: data.name,
      //       artist: data.song.artists[0].name,
      //       artistID: data.song.artists[0].id,
      //       album: data.song.album.name,
      //       albumID: data.song.album.id,
      //       duration: data.song.duration,
      //       picUrl: data.picUrl,
      //       totalTime: totalTime
      //     });
      //     document.title = `${data.name} - ${data.song.artists[0].name}`;
      //     router.app.$options.store.commit("getMusicInfo", MusicInfo);
      //     // console.log(MusicInfo);
      //     util.mediaMetaDataHandle(MusicInfo);
      //     // 获取时间
      //     next();
      //   });
      // }
      next()
    }
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

  store.dispatch('CLEANLOADING');
  next();


  const originalPush = VueRouter.prototype.push
  const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}
})
export default router