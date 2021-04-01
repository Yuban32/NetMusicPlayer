<template>
  <div id="app">
    <div class="bg" :style="
        `background:url(${musicInfo.picUrl}?param=1200y1200) center no-repeat;background-size: cover`
      "></div>
    <navigattion />
    <div class="viws-wrap">
      <div class="viws">
        <toast ref="toast"></toast>
        <keep-alive>
        <player v-show="playViewShow" ref="players"></player>
        </keep-alive>
        <transition enter-active-class="**animated** bounceIn" leave-active-class="**animated** bounceOut">
          <router-view v-if="!showPlayList" />
          <div class="play-list-wrap" v-if="showPlayList">
            <!-- <songlist :songList="musicList"></songlist> -->
            <albumDetail :albumDetailData="albumDetail" :albumList="musicList" :backForwardShow="showPlayList" @showAlbum="showPlayListHandle"></albumDetail>
          </div>
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
            <font-awesome-icon @click="prev_next_Handle(true)" id="backward" class="PB-control-icon"
              :icon="['fas', 'backward']" />
            <font-awesome-icon v-if="!isPlay" @click="play" id="play" class="PB-control-icon" :icon="['fas', 'play']" />
            <font-awesome-icon v-if="isPlay" @click="pause" id="pause" class="PB-control-icon"
              :icon="['fas', 'pause']" />
            <font-awesome-icon @click="prev_next_Handle(false)" id="forward" class="PB-control-icon"
              :icon="['fas', 'forward']" />
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
              <input type="range" max="100" :value="volumeValues" class="range" @mousedown="volumeHandle" ref="volume">
            </div>
            <font-awesome-icon @mouseenter="volumeShow=true" class="volume-icon" :icon="['fas','volume-up']" />
          </div>

          <div class="play-list-btn-wrap" @click="showPlayListHandle">
            {{musicList.length}}
            <font-awesome-icon class="play-list" :icon="['fas','list-ul']" />
          </div>
          <div class="play-mode-wrap" @mouseenter="playModeShow=true">
            <font-awesome-icon class="play-mode-icon" :icon="['fas',playModeIcon]"></font-awesome-icon>
            <div class="play-mode-panel" v-if="playModeShow" @mouseleave="playModeShow=false">
            <font-awesome-icon @click="setPlayModeHandler(1)" class="play-mode-panel-icon" :icon="['fas','redo-alt']"></font-awesome-icon>
            <font-awesome-icon @click="setPlayModeHandler(2)" class="play-mode-panel-icon" :icon="['fas','random']"></font-awesome-icon>
            <font-awesome-icon @click="setPlayModeHandler(3)" class="play-mode-panel-icon" :icon="['fas','angle-double-right']"></font-awesome-icon>

            </div>
          </div>
          <!-- :crossorigin="anonymous?'anonymous':'use-credentials'"  -->
          <!-- <audio ref="audioElement" style="display:block;" :src="MusicUrl
          " @pause="onPauseHandler" @play="onPlayHandler" @ended="onEndedHandler" @timeupdate="audioTimeUpdate"
            @seeked="setBufferedHandle" /> -->
          <audio ref="audioElement" autoplay style="display:block;" :src="`https://music.163.com/song/media/outer/url?id=${musicInfo.musicID}.mp3`
                    " @pause="onPauseHandler" @play="onPlayHandler" @ended="onEndedHandler" @timeupdate="audioTimeUpdate"
                      @seeked="setBufferedHandle" />
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import animate from 'animate.css'
  import navigattion from "./components/nav.vue";
  import player from "./views/Player.vue";
  import {
    mapGetters,
    mapState
  } from "vuex";
  import util from '@/util/util';
  import Toast from '@/components/Toast'
  // import SongList from '@/components/SongList'
  import AlbumDetail from '@/components/AlbumDetail'
  export default {
    name: "App",
    data() {
      return {
        albumDetail:[],
        show: false,
        audioElement: "",
        currentTime: 0,
        totalTime: 0,
        progressBarWidth: 0,
        bufferedWidth: 0,
        fastForwardPoint: 0,
        volumeShow: false,
        volumeValues: 0,
        playIndex: 0,
        playMode:1,  //1 单曲循化 2 随机播放 3 顺序播放
        playModeIcon:'redo-alt',
        playModeShow:false,
        MusicUrl:null,
        setTimeous:null,
        loginCookie:null,
        MusicVisual:null,
      };
    },
    methods: {
      // 获取真实的音乐URL地址 由于可视化失败 此方法暂时废弃
      getMusicUrl(){
        this.loginCookie = this.$store.getters.getLoginCookie
        this.axios.get(`/song/url?id=${this.musicInfo.musicID}`).then(res=>{
          // console.log(res);
          
          // this.MusicUrl = res.data.data[0].url?res.data.data[0].url+'?infoId=92001':`https://music.163.com/song/media/outer/url?id=${this.musicInfo.musicID}.mp3`
          if(res.data.data[0].url){
            this.MusicUrl = res.data.data[0].url+'?infoId=92001';
            this.MusicVisual=true;
            this.audioElement.setAttribute('crossorigin','anonymous');
            this.$store.commit('setMusicVisualization','执行');
            // this.audioElement.
          }else{
            this.MusicVisual = false;
            this.audioElement.removeAttribute('crossorigin');
            this.MusicUrl = `https://music.163.com/song/media/outer/url?id=${this.musicInfo.musicID}.mp3`
            this.$store.commit('setMusicVisualization','不执行');
          }
          // 在链接后面加入?infoId=92001 可以跨域 这个应该是网易后端开放出来给他们在知乎的团队用的 不是真正的跨域解决方案!
          
        }).catch(error=>{
          console.log(error);
        })
      },
      // 单曲
      setPlayModeHandler(flag){
        if(flag==1){
          // this.playMode = 1;
          this.$store.commit('setPlayMode',1);
          this.playModeIcon = 'redo-alt';
          this.$refs.toast.showToast('单曲循环', 3);
        }else if(flag==2){
          // this.playMode=2;
          this.playModeIcon = 'random';
          this.$refs.toast.showToast('随机播放', 3);
          this.$store.commit('setPlayMode',2);

        }else if(flag==3){
          // this.playMode=3
          this.playModeIcon = 'angle-double-right';
          this.$refs.toast.showToast('顺序播放', 3);
          this.$store.commit('setPlayMode',3);

        }

      },
      // 播放模式
      playModeHandle(){
        if(this.playMode==1){
          this.audioElement.pause();
          this.audioElement.play();
        }else if(this.playMode){
          this.randomPlayMode();
        }else if(this.playMode==3){
          this.prev_next_Handle(false)
        }
      },
      randomPlayMode(){
          let randIndex = Math.floor(Math.random()*this.musicList.length);
          let randMusic =[]
          randMusic[0] = this.musicList[randIndex]
          this.$store.commit('getMusicInfo', randMusic)
      },
      // 显示播放歌单
      showPlayListHandle() {
        this.albumDetail[0] = {
          coverImgUrl:this.musicList[0].picUrl,
          albumName:'播放列表'
        }
        this.$store.commit('setShowPlayList',this.show = !this.show)
        this.$store.commit('setPlayViewShow', true);
      },
      //监控物理媒体按键
      //这个方法调用了现代浏览器的新特性,对非chromium内核的浏览器基本上不支持!
      //这个功能最大的用处是 当你按下键盘上的多媒体物理按键的时候,屏幕左上角会弹出一个显示当前播放音视频的面板
      prev_next_mediaMetadata() {
        let data = [];
        data[0] = this.$store.state.musicInfo
        util.mediaMetaDataHandle(data)
        if ('mediaSession' in navigator) {
          navigator.mediaSession.setActionHandler('play', () => this.play());
          navigator.mediaSession.setActionHandler('pause', () => this.pause());
          navigator.mediaSession.setActionHandler('previoustrack', () => this.prev_next_Handle(true));
          navigator.mediaSession.setActionHandler('nexttrack', () => this.prev_next_Handle(false));
        }
      },
      // 上下首播放
      prev_next_Handle(flag) {
        // flag=true 上一首 
        // false下一首
        let playID = this.$store.state.musicInfo.musicID;
        if (this.musicList.length == 1) {
          // toast组件 参数1:提示信息,参数2:持续时间 单位秒
          this.$refs.toast.showToast('目前播放列表只有一首', 3);
        }
        let tempList = []
        if (flag) {
          this.musicList.filter((item, index) => {
            // console.log(item);
            if (item.musicID == playID) {
              let i = --index;
              if (i < 0) i = this.musicList.length - 1;
              tempList[0] = this.musicList[i]
              this.$store.commit('getMusicInfo', tempList)
            }
          });
        } else {
          this.musicList.filter((item, index) => {
            if (item.musicID == playID) {
              let i = ++index;
              if (i > this.musicList.length - 1) i = 0;
              tempList[0] = this.musicList[i];
              this.$store.commit('getMusicInfo', tempList)
            }else if(this.playMode==2){
              this.randomPlayMode();
            }
          })
        }
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
        // console.log(e.offsetX, progressBarWrapOffsetWidth);
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
          let random = parseInt(Math.random() * re.data.result.length);
          let data = re.data.result[random];
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
        this.prev_next_mediaMetadata()
        // console.log("播放状态");
        // console.dir(this.audioElement);
      },
      onPauseHandler() {
        this.$store.commit("isPlay", false);
        // console.log("暂停状态");
      },
      onEndedHandler() {
        // 1 单曲播放 2 随机播放 3 顺序播放
        // console.log(this.playMod);
        this.playModeHandle()
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
              // console.log(2);
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
          // console.log(1);
        }
      },
    },
    components: {
      navigattion,
      player,
      'toast': Toast,
      // 'songlist': SongList,
      'albumDetail':AlbumDetail,
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
        musicList: state => state.musicList,
        showPlayList:state=>state.showPlayList,
        MusicID:state=>state.musicInfo.musicID,
      }),
      ...mapGetters(['getPlayMode'])

      // getMusicCurrentTime(time){

      // },
    },
    watch: {
      getPlayMode(val){
        this.playMode = val
        // console.log(val);
      },
      MusicID(val){
        // this.getMusicUrl()
        return val;
      },
      musicList(val, old) {
        // console.log(val);
        // this.playList()
        return val;
      },
      showPlayList(val){
        return val;
      },MusicUrl(val){
        clearTimeout(this.setTimeous)
        setTimeout(()=>{
          this.audioElement.play()
        },1000)
        return val
      }
    }
  };
</script>

<style>

  .play-mode-wrap{
    font-size: 20px;
    position: relative;
    margin-left: 20px;
  }
  .play-mode-wrap .play-mode-icon{
    font-size: 22px;
    cursor: pointer;
  }
  .play-mode-wrap .play-mode-icon:hover{
    color: #fff;
  }

  .play-mode-wrap .play-mode-panel{
    padding: 10px 10px 0 10px;
    border: 1px solid red;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -115px;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid rgb(255, 255, 255);
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.562);
    transition: all 0.2s ease-in;
    z-index: 9;
  }
  .play-mode-wrap .play-mode-panel .play-mode-panel-icon{
    margin-bottom: 10px;
    cursor: pointer;
  }
  
  .play-mode-wrap .play-mode-panel .play-mode-panel-icon:hover{
    color: #fff;
  }
  .play-list-btn-wrap {
    /* border: 1px solid red; */
    font-size: 20px;
    /* padding: 0 0 0 20px; */
    margin-left: 20px;
    cursor: pointer;
    transition: color 0.2s;
  }

  .play-list-btn-wrap:hover,
  .volume-icon:hover {
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
  .play-list-wrap {
    width: 50%;
    height: calc(100vh - 90px);
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.3);
    overflow-x: hidden;
    content-visibility: auto;
    position: relative;
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
    /* flex: 1; */
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