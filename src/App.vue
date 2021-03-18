<template>
  <div id="app">
    <div class="bg" :style="
        `background:url(${musicInfo.picUrl}) center no-repeat;background-size: cover`
      "></div>
    <navigattion />
    <div class="viws-wrap">
      <div class="viws">
        <player v-if="isShow"></player>
        <transition @before-enter="isShowFN()">
          <router-view />
        </transition>
      </div>

      <div class="play-mini">
        <div class="play-button-control">
          <font-awesome-icon id="backward" class="PB-control-icon" :icon="['fas', 'backward']" />
          <font-awesome-icon v-if="!isPlay" @click="play" id="play" class="PB-control-icon" :icon="['fas', 'play']" />
          <font-awesome-icon v-if="isPlay" @click="pause" id="pause" class="PB-control-icon" :icon="['fas', 'pause']" />
          <font-awesome-icon id="forward" class="PB-control-icon" :icon="['fas', 'forward']" />
        </div>
        <div class="middle-panel">
          <div class="music-info">
            <div class="music-title">
              <span>{{ musicInfo.musicName }}</span>
              <span>{{ musicInfo.artist }}</span>
            </div>
            <div class="music-time">
              <span>{{currentTime?currentTime:'0 : 00'}} / {{musicInfo.totalTime?musicInfo.totalTime:'0 : 00'}}</span>
              
            </div>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar" ref="progressBar" :style="{width:progressBarWidth+'%'}"></div>
            <div class="buffer-bar" ref="bufferBar"></div>
          </div>
        </div>
        <div class="right-panel">

        </div>

        <audio ref="audioElement" :poster="musicInfo.picUrl + '?param=400y400'" style="display:none;" autoplay :src="
            `https://music.163.com/song/media/outer/url?id=${musicInfo.musicUrl}.mp3`
          " loop @pause="onPauseHandler" @play="onPlayHandler" @ended="onEndedHandler" @timeupdate="audioTimeUpdate" />
      </div>
    </div>
  </div>
</template>

<script>
  import navigattion from "./components/nav.vue";
  import player from "./views/Player.vue";
  import {
    mapState
  } from "vuex";
  import util from '@/util/util'
  export default {
    name: "App",
    data() {
      return {
        isShow: false,
        hash: "",
        audioElement: "",
        currentTime:0,
        totalTime:0,
        progressBarWidth:0,
      };
    },
    methods: {
      audioTimeUpdate() {
        //获取当前播放时间
        let currentTime = parseInt(this.audioElement.currentTime);
        let duration = this.audioElement.duration;
        let buffered = this.audioElement.buffered;
        // 获取元素
        let bufferBar = this.$refs.bufferBar;
        this.currentTime = util.playTimeFormat(currentTime);
        let progressScale = currentTime / duration;
        this.progressBarWidth = progressScale * 100;
        console.log(buffered);
      },
      recommMusic() {
        this.axios.get("/personalized/newsong?limit=10").then((re) => {
          let data = re.data.result[0];
          //计算总时间
          let duration = parseInt(data.song.duration/1000);
          let totalTime = util.playTimeFormat(duration)

          // console.log(data);
          let MusicInfo = [];
          MusicInfo.push({
            musicID: data.id,
            musicName: data.name,
            artist: data.song.artists[0].name,
            artistID: data.song.artists[0].id,
            album: data.song.album.name,
            albumID: data.song.album.id,
            duration: data.song.duration,
            picUrl: data.picUrl,
            totalTime:totalTime
          });
          document.title = `${data.name} - ${data.song.artists[0].name}`;
          this.$store.commit("getMusicInfo", MusicInfo);
          // console.log(MusicInfo);
          util.mediaMetaDataHandle(MusicInfo);
          // 获取时间
          
        });

      },
      onPlayHandler() {
        this.$store.commit("isPlay", true);
        console.log("播放状态");
        // console.dir(this.audioElement);
      },
      onPauseHandler() {
        this.$store.commit("isPlay", false);
        console.log("暂停状态");
      },
      onEndedHandler() {
        console.log("结束状态");
      },
      audioControls() {
        this.audioElement = this.$refs.audioElement;
      },
      play() {
        let isplay = this.$store.state.isPlay;
        if (!isplay) {
          this.audioElement
            .play()
            .then(() => {
              this.$store.commit("isPlay", true);
              console.log(2);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      },
      pause() {
        let isplay = this.$store.state.isPlay;
        // console.log(isplay);
        if (isplay) {
          this.audioElement.pause();
          this.$store.commit("isPlay", false);
          console.log(1);
        }
      },
      isShowFN() {
        const urlHash = {
          "#/search": true,
          "#/recom": true
        };
        const {
          hash
        } = window.location;
        this.isShow = Reflect.get(urlHash, hash);
      },

    },
    components: {
      navigattion,
      player,
    },
    mounted() {
      this.audioControls();


    },
    created() {
      this.recommMusic();
    },
    computed: {
      ...mapState(["musicInfo"]),
      ...mapState(["musicList"]),
      ...mapState(["isPlay"]),
      
      // getMusicCurrentTime(time){
        
      // },
    },
  };
</script>

<style>
  body {
    background-color: rgb(63, 63, 63);
    color: rgba(255, 255, 255, 0.67);
  }

  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    border-radius: 5px;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #555;
    cursor: pointer;
  }

  .order {
    display: inline-block;
    min-width: 60px;
    padding: 0 5px 0 5px;
    width: auto;
    font-size: 50px;
    text-align: center;
    font-weight: bold;
    position: relative;
    top: 12px;
    color: rgba(255, 255, 255, 0.5);
  }


  #app .play-mini .play-button-control .PB-control-icon {
    margin-left: 20px;
    font-size: 30px;
    cursor: pointer;
    transition: color 0.2s ease-in;
  }
  .PB-control-icon:hover{
    color: #fff;
  }
  #app {
    width: 100%;
    height: 100%;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    ;
    /* color: #2c3e50; */
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    z-index: 1;
    background-size: cover;
  }

  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    filter: blur(10px);
    background: url("./assets/IMG_20200311_224837.jpg") center no-repeat;
    z-index: -1;
  }
  #app .play-mini {
    /* position: absolute; */
    bottom: 0;
    width: 100vw;
    height: 90px;
    display: flex;
    /* flex-direction: column; */
    /* justify-content: center; */
    align-items: center;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.60);
  }
#app .play-mini .middle-panel{
  flex: 6;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
#app .play-mini .middle-panel .music-info{
  display: flex;
  align-items: center;
}
#app .play-mini .right-panel{
  flex: 4;
}
  #app .play-mini .play-button-control {
    width: 150px;
  }

  #app .play-mini .music-info {
    width: auto;
    text-align: left;
    margin-bottom: 5px;
    position: relative;
    font-weight: bold;
  }
  #app .play-mini .music-info span:last-child{
    margin-left: 10px;
  }
  #app .play-mini .music-info .music-time{
    position: absolute;
    right: 0;
  }
  /* 播放进度条 */
  .progress-bar-wrap{
    /* padding: 10px; */
    width: 100%;
    height: 20px;
    position: relative;
    overflow: hidden;
    /* background-color: blanchedalmond; */
  }
  .progress-bar-wrap::before{
    content: '';
    display: block;
    height: 10px;
    width: 100%;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: #ffffffb9;
  }
.progress-bar-wrap .progress-bar , .progress-bar-wrap .buffer-bar{
  height: 10px;
  width: 60%;
  border-radius: 10px;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  
}
.progress-bar-wrap .progress-bar{
  background-color: red;
  z-index: 2;
}
.progress-bar-wrap .progress-bar::before{
  content: '';
  /* box-sizing: border-box; */
  display: block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid skyblue;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  background-color: white;
}
.progress-bar-wrap .buffer-bar{
  width: 10%;
  background-color: gold;
  z-index: 1;
}
    #app .viws {
    display: flex;
    flex-direction: row;
    height: calc(100vh - 90px);
    background-color: rgba(0, 0, 0, 0.5);
    /* height: 100vh; */
    width: 100vw;
    z-index: 1;
  }

  #app .viws>div {
    flex: 1;
    /* height: calc(100vh - 90px); */
  }
  
  .viws-wrap {
    display: flex;
    flex-direction: column;
    /* justify-content: center;
  align-items: center; */
  }
</style>