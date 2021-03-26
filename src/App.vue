<template>
  <div id="app">
    <div class="bg" :style="
        `background:url(${musicInfo.picUrl}?param=1200y1200) center no-repeat;background-size: cover`
      "></div>
    <navigattion />
    <div class="viws-wrap">
      <div class="viws">
        <player v-if="playViewShow"></player>
        <transition @before-enter="isShowFN()">
          <router-view />
        </transition>
      </div>
      <div class="play-mini">
        <div class="music-info">
          <div class="music-title">
            <span @click="playShowHandle">{{ musicInfo.musicName }}</span>
            <span>{{ musicInfo.artist }}</span>
          </div>
          <div class="music-time">
            <span>{{currentTime?currentTime:'0 : 00'}} / {{musicInfo.totalTime?musicInfo.totalTime:'0 : 00'}}</span>
          </div>
        </div>

        <div class="bottom-panel">
          <div class="play-button-control">
            <font-awesome-icon @click="prevMusicHandle" id="backward" class="PB-control-icon" :icon="['fas', 'backward']" />
            <font-awesome-icon v-if="!isPlay" @click="play" id="play" class="PB-control-icon" :icon="['fas', 'play']" />
            <font-awesome-icon v-if="isPlay" @click="pause" id="pause" class="PB-control-icon"
              :icon="['fas', 'pause']" />
            <font-awesome-icon @click="nextMusicHandle" id="forward" class="PB-control-icon" :icon="['fas', 'forward']" />
          </div>

          <div class="progress-bar-wrap" @mousedown="fastForward" ref="progressBarWrap">
            <div class="progress-bar" ref="progressBar" :style="{width:progressBarWidth+'%'}">
              <div class="ball"></div>
            </div>
            <div class="buffer-bar" ref="bufferBar" :style="{width:bufferedWidth+'%'}"></div>
          </div>

         
            <div class="volume-wrap" @mouseleave="volumeShow=false">
              <div class="volume" v-show="volumeShow">
                {{parseInt(volumeValues)}}
                <input type="range" max="100" :value="volumeValues" class="range" @mousedown="volumeHandle"
                  ref="volume">
              </div>
              <font-awesome-icon @mouseenter="volumeShow=true" class="volume-icon" :icon="['fas','volume-up']" />
            </div>

            <div class="play-list-wrap">
              <div class="music-list" v-show="listShow">
                <p v-for="item in musicList" :key="item.musicID" :style="`color:${musicInfo.musicID==item.musicID?'red':''}`">
                  {{item.musicName}}
                </p>
              </div>
              {{musicList.length}}
              <font-awesome-icon @click="listShow=!listShow" class="play-list" :icon="['fas','list-ul']" />
          </div>
          <audio ref="audioElement" style="display:block;" autoplay :src="`https://music.163.com/song/media/outer/url?id=${musicInfo.musicUrl}.mp3`
          " loop @pause="onPauseHandler" @play="onPlayHandler" @ended="onEndedHandler" @timeupdate="audioTimeUpdate"
            @seeked="setBufferedHandle" />

        </div>

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
        currentTime: 0,
        totalTime: 0,
        progressBarWidth: 0,
        bufferedWidth: 0,
        fastForwardPoint: 0,
        volumeShow: false,
        volumeValues: 0,
        playIndex:0,
        listShow:false
      };
    },
    methods: {
      // 播放列表 测试
      prevMusicHandle() {
        let playID = this.$store.state.musicInfo.musicID;
        console.log(playID);
        let prevMusic = []
        let tempList = []
        this.musicList.filter((item,index)=>{
          // console.log(item);
          if(item.musicID==playID){
            let i = --index;
            if(i<0) i = this.musicList.length-1;
            prevMusic[0] = this.musicList[i] 
            this.$store.commit('getMusicInfo',prevMusic)
          }
        });

        // console.log(this.musicList);
      },
      nextMusicHandle(){
        let playID = this.$store.state.musicInfo.musicID;
        let nextMusic = [];
        this.musicList.filter((item,index)=>{
          if(item.musicID==playID){
            let i = ++index;
            if(i>this.musicList.length-1) i = 0;
            nextMusic[0] = this.musicList[i];
            this.$store.commit('getMusicInfo',nextMusic)
          }
        })
      },
      // 是否显示播放界面
      playShowHandle() {
        this.$store.commit('setPlayViewShow', true);
      },
      // 调解音量
      volumeHandle() {
        let volumeValue = this.$refs.volume.value;
        this.audioElement.volume = volumeValue / 100;
        this.volumeValues = this.audioElement.volume * 100;
        document.onmousemove = () => {
          volumeValue = this.$refs.volume.value;
          this.audioElement.volume = volumeValue / 100;
          this.volumeValues = this.audioElement.volume * 100;
        }
        // 解绑
        document.onmouseup = () => {
          document.onmousemove = null;
        }

      },
      audioTimeUpdate() {
        //获取当前播放时间
        let currentTime = parseInt(this.audioElement.currentTime);
        let duration = this.audioElement.duration;
        let buffered = this.audioElement.buffered;
        // 获取元素
        let bufferBar = this.$refs.bufferBar;
        this.currentTime = util.playTimeFormat(currentTime);
        let progressScale = currentTime / duration;
        // console.log(progressScale);
        this.progressBarWidth = (progressScale * 100).toFixed(2);
        // console.log(buffered);
        this.setBufferedHandle()
        // this.fastForward();

      },
      fastForward(e) {
        let progressBarWrapOffsetWidth = e.target.offsetWidth;
        let jumpPoint = parseInt((e.offsetX / progressBarWrapOffsetWidth) * 100);
        console.log(e.offsetX, progressBarWrapOffsetWidth);
        let mouseX = 0;
        this.audioElement.currentTime = Math.floor((jumpPoint / 100) * this.audioElement.duration);

        document.onmousemove = (ev) => {
          mouseX = ev.offsetX;
          if (mouseX < progressBarWrapOffsetWidth) {
            mouseX = parseInt((mouseX / progressBarWrapOffsetWidth) * 100)

          } else {
            mouseX = 100;
          }
          if (mouseX < 0) {
            mouseX = 0;
          }
          // console.log(mouseX);
          this.audioElement.currentTime = Math.floor((mouseX / 100) * this.audioElement.duration);
        }
        document.onmouseup = () => {
          document.onmousemove = null;
        }
        // console.log(jumpPoint);
        // console.log(this.fastForwardPoint);
      },
      setBufferedHandle() {
        let currentTime = parseInt(this.audioElement.currentTime);
        let duration = this.audioElement.duration;
        let timeRanges = this.audioElement.buffered;
        let time = 0;
        if (currentTime !== Number(time)) {
          time = currentTime;
          this.bufferedWidth = parseInt(timeRanges.end(timeRanges.length - 1) * 100 / duration * 100) / 100;
          // console.log(this.bufferedWidth);
        }
      },
      recommMusic() {
        this.axios.get("/personalized/newsong?limit=10").then((re) => {
          let data = re.data.result[0];
          //计算总时间
          let duration = parseInt(data.song.duration / 1000);
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
            totalTime: totalTime
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
        this.$store.commit('getAudioElement', this.audioElement);
        this.volumeHeight = (this.audioElement.volume * 100).toFixed(2);
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
          "#/recom": true,
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
      this.volumeValues = this.audioElement.volume * 100;


    },
    created() {
      this.recommMusic();
    },
    computed: {
      ...mapState(["musicInfo"]),
      ...mapState(["musicList"]),
      ...mapState(["isPlay"]),
      ...mapState({
        playViewShow: state => state.playViewShow,
        musicList: state => state.musicList
      })

      // getMusicCurrentTime(time){

      // },
    },
    watch: {
      musicList(val, old) {
        // console.log(val);
        // this.playList()
        return val;
      }
    }
  };
</script>

<style>
.music-list{
  position: fixed;
  top: 50%;
  left: 50%;
  border: 1px solid red;
  padding: 10px;
  background-color: #080808c0;
}
.play-list-wrap{
  /* border: 1px solid red; */
  font-size: 20px;
  /* padding: 0 0 0 20px; */
  margin-left: 20px;
  cursor: pointer;
  transition: color 0.2s;
}
.play-list-wrap:hover ,.volume-icon:hover{
  color: white;
}
  .volume-wrap .volume {
    position: absolute;
    height: 125px;
    width: 45px;
    left: -10px;
    top: -50px;
    padding: 10px 0 0 0;
    border: 1px solid rgb(255, 255, 255);
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.418);
  }

  .volume-wrap .volume .range {
    display: inline-block;
    width: 90px;
    left: -23px;
    top: 70px;
    position: absolute;
    transform: rotateZ(270deg);
    cursor: pointer;

  }

  .volume-wrap {
    height: 110px;
    width: 30px;
    position: relative;
    top: -50px;
    margin-left: 30px;
  }

  .volume-wrap .volume-icon {
    font-size: 20px;
    position: absolute;
    left: 50%;
    bottom: -5px;
    transform: translateX(-50%);
    transition: color 0.2s;
  }


  #app .play-button-control .PB-control-icon {
    margin-left: 20px;
    font-size: 30px;
    cursor: pointer;
    transition: color 0.2s ease-in;
  }

  .PB-control-icon:hover {
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
    z-index: -1;
  }

  #app .play-mini {
    bottom: 0;
    width: 100vw;
    height: 90px;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    padding: 10px 0 0 10px;
    box-sizing: border-box;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.60);
  }

  #app .play-mini .bottom-panel {
    /* flex: 1; */
    height: 60px;
    top: -5px;
    width: 96%;
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    /* border: 1px solid red; */
  }

  #app .play-mini .music-info {
    display: flex;
    align-items: center;
    width: 60%;
    height: 30px;
    text-align: left;
    margin-bottom: 5px;
    position: relative;
    font-weight: bold;
    margin: 0 50px;
    /* border: 1px solid red; */
  }

  #app .play-mini .music-info .music-title {
    cursor: pointer;
    user-select: none;
    text-decoration: underline;
  }

  #app .play-mini .music-info .music-time {
    position: absolute;
    right: 0;
  }

  #app .play-mini .play-button-control {
    width: 200px;
  }

  #app .play-mini .music-info span:last-child {
    margin-left: 10px;
  }


  /* 播放进度条 */
  .progress-bar-wrap {
    width: 54%;
    height: 20px;
    position: relative;
    overflow: hidden;
    user-select: none;
  }

  .progress-bar-wrap::before {
    content: '';
    display: block;
    height: 10px;
    width: 100%;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.604);
  }

  .progress-bar-wrap .progress-bar,
  .progress-bar-wrap .buffer-bar {
    height: 10px;
    width: 60%;
    border-radius: 10px;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;

  }

  .progress-bar-wrap .progress-bar {
    background-color: rgb(0, 161, 214);
    z-index: 2;
  }

  .progress-bar-wrap:hover .ball {
    opacity: 1 !important;
  }

  .progress-bar-wrap .progress-bar .ball {
    /* box-sizing: border-box; */
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid skyblue;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    background-color: white;
    opacity: 0;
    transition: opacity 0.5s;
  }

  .progress-bar-wrap .buffer-bar {
    width: 10%;
    background-color: #717171;
    z-index: 1;
  }

  #app .viws {
    display: flex;
    flex-direction: row;
    height: calc(100vh - 90px);
    background-color: rgba(0, 0, 0, 0.5);

    width: 100vw;
    z-index: 1;
  }

  #app .viws>div {
    flex: 1;
  }

  .viws-wrap {
    display: flex;
    flex-direction: column;
  }

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
    min-width: 90px;
    padding: 0 5px 0 5px;
    width: auto;
    font-size: 50px;
    text-align: center;
    font-weight: bold;
    position: relative;
    top: 12px;
    color: rgba(255, 255, 255, 0.5);
  }
</style>