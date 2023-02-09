<template>
  <div class="about-wrap">
    <div class="about"  v-if="!playViewShow" :style="!playViewShow?'width:50%':'width:0px'">
      <div class="text">
        <h1>Yuban32音乐播放器 <a target="_blank" href="https://github.com/Mashiro10032/NetMusicPlayer"><font-awesome-icon :icon="['fab','github']" class="github-icon" /></a></h1>
      <p>这是一款音乐播放器，搜索数据来自网易云音乐</p>
      <p>本项目使用了Vue cli 4.x脚手架、Vue2、VueX、Vue-Router3开发的</p>
      <p>本项目也不做任何兼容性处理，理论上现代较新的浏览器版本都支持（万恶的IE除外）</p>
      <p>后端部分用的是<a href="https://github.com/Binaryify/NeteaseCloudMusicApi">NeteaseCloudMusicApi</a>
      </p>
      <p>所有的数据都存储在本地，播放器不做任何数据的存储等！</p>
      <p>由于项目开发时间不久，如果遇到一些BUG的话还请发个<a href="https://github.com/Mashiro10032/NetMusicPlayer/issues">Issues</a></p>
      <p>喜欢的可以点击GitHub图标给项目点个Star~</p>
      </div>
    </div>
    <div class="backForwardWrap" v-if="playViewShow" @click="playViewShowHandler">
      <font-awesome-icon class="backForward" :icon="['fas', 'chevron-left']">BACK</font-awesome-icon>
      <span>BACK</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data(){
    return{

    }
  },
  methods:{
    playViewShowHandler(){
      this.$store.commit('setPlayViewShow', false);
    }
  },
  watch:{
    playViewShow(val){
      return val;
    }
  },
  computed:{
    ...mapState({
      playViewShow:state=>state.playViewShow,
    })
  }
}
</script>
<style scoped>
.about-wrap{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
}
.about{
  padding: 20px;
  border: 1px solid white;
  border-radius: 15px;
}
  a{
    text-decoration: underline;
    transition: all 0.2s;
  }
  a:hover{
    color: white;
  }
  .github-icon{
    font-size: 40px;
  }
    .backForwardWrap {
    position: fixed;
    cursor: pointer;
    font-size: 35px;
    height: 50px;
    width: 150px;
    right: -100px;
    bottom: 100px;
    background-color: rgba(122, 122, 122, 0.527);
    border-radius: 10px 0 0 10px;
    transition: all 0.2s ease-in;
    line-height: 55px;
    user-select: none;
    z-index: 9;
  }

  .backForwardWrap:hover {
    right: 0;
  }

  .backForwardWrap>span {
    margin-left: 10px;
    font-size: 30px;
    line-height: 50px;
  }
</style>