"use strict";

import Vue from 'vue';
import axios from "axios";
import VueAxios from 'vue-axios'
import store from '../store';
import vueRouter from '../router/index';
// Full config:  https://github.com/axios/axios#request-config
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
let config = {
  
  // baseURL: "http://api.music-1.yuban32.com",
  baseURL: "http://api.music.yuban32.com",
  withCredentials: true,
  // baseURL:"http://localhost:3000/",
  timeout: 60 * 1000, // Timeout

};

const _axios = axios.create(config);
function addCookie(config){
  var cookie = localStorage.getItem('cookie');
  if(cookie == null){
    // vueRouter.push('/loginQR')
      
  }else{
    /**
     * #TODO 登录后进行cookie的拼接
     * @Description get请求直接传cookie post请求则添加到body标签内
     */
    var encodeCookie = encodeURIComponent(cookie);
    var urlBefore = config.url;
    if(config.method == 'get'){
      if(urlBefore.indexOf("?")==-1){
        /**
         * @description 判断原URL是不是已经有了查询参数
         */
        config.url = `${urlBefore}?cookie=${encodeCookie}`;
      }else{
        config.url = `${urlBefore}&cookie=${encodeCookie}`;
      }
    }
    if(config.method == 'post'){
      config.data = {
        'cookie':cookie,
        ...config.data
      }
    }
  }
}
_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    addCookie(config)
    store.dispatch('SetLoding', true);
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    store.dispatch('SetLoding', false);

    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
    $http: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin, VueAxios)

export default Plugin;