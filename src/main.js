import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import md5 from 'js-md5'

Vue.prototype.$md5 = md5;
//引入axios
import './axios/axios'
//引入fontawesome
// 引入fontawesome核心依赖
import {
  library
} from '@fortawesome/fontawesome-svg-core'
import {
  fas
} from '@fortawesome/free-solid-svg-icons'
import {
  far
} from '@fortawesome/free-regular-svg-icons'
import {
  fab
} from '@fortawesome/free-brands-svg-icons'
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText
} from '@fortawesome/vue-fontawesome'

// 添加fontawesome到lib
library.add(fas, far, fab)
// 挂载fontawesome组件
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')