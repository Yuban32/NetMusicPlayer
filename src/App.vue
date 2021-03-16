<template>
  <div id="app">
    <div
      class="bg"
      :style="
        `background:url(${musicInfo.picUrl}) center no-repeat;background-size: cover`
      "
    ></div>
    <navigattion />
    <div class="viwsWrap">
      <div class="viws">
        <player v-if="isShow"></player>
        <transition @before-enter="isShowFN()">
          <router-view />
        </transition>
      </div>

      <div class="playMini" style="color: #fff">
        <div class="playBackControl">
          <font-awesome-icon
            id="backward"
            class="PBControlIcon"
            :icon="['fas', 'backward']"
          />
          <font-awesome-icon
            v-if="!isPlay"
            @click="play"
            id="play"
            class="PBControlIcon"
            :icon="['fas', 'play']"
          />
          <font-awesome-icon
            v-if="isPlay"
            @click="pause"
            id="pause"
            class="PBControlIcon"
            :icon="['fas', 'pause']"
          />
          <font-awesome-icon
            id="forward"
            class="PBControlIcon"
            :icon="['fas', 'forward']"
          />
        </div>

        <span>{{ musicInfo.musicName }}</span> -
        <span>{{ musicInfo.artist }}</span>
        <audio
          style="display:none;"
          autoplay
          :src="
            `https://music.163.com/song/media/outer/url?id=${musicInfo.musicUrl}.mp3`
          "
          loop
          @pause="onPauseHandler"
          @play="onPlayHandler"
          @ended="onEndedHandler"
          @timeupdate="audioTimeUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script>
import navigattion from "./components/nav.vue";
import player from "./views/Player.vue";
import { mapState } from "vuex";
export default {
  name: "App",
  data() {
    return {
      isShow: false,
      hash: "",
      audioElement: "",
    };
  },
  methods: {
    audioTimeUpdate(){
      let currentTime =parseInt(this.audioElement.currentTime);
      
      let duration = parseInt(this.audioElement.duration);
      console.log(currentTime,duration);
    },
    recommMusic() {
      this.axios.get("/personalized/newsong?limit=10").then((re) => {
        let data = re.data.result[0];
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
        });
        document.title = `${data.name} - ${data.song.artists[0].name} - Wick's播放器`;
        this.$store.commit("getMusicInfo", MusicInfo);
        console.log(MusicInfo);
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
      this.audioElement = document.querySelector("audio");
      // this.$store.commit("getAudioElement", this.audioElement);
        console.dir(this.audioElement.buffered);

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
      console.log(isplay);
      if (isplay) {
        this.audioElement.pause();
        this.$store.commit("isPlay", false);
        console.log(1);
      }
    },
    isShowFN() {
      const urlHash = { "#/search": true, "#/recom": true };
      const { hash } = window.location;
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
#app .playMini .playBackControl {
  background-color: antiquewhite;
}
#app .playMini .playBackControl .PBControlIcon {
  margin-left: 20px;
  font-size: 30px;
  cursor: pointer;
}
#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;;
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
#app .viws {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 90px);
  background-color: rgba(0,0,0,0.5);
  /* height: 100vh; */
  width: 100vw;
  z-index: 1;
}
#app .viws > div {
  flex: 1;
  /* height: calc(100vh - 90px); */
}
#app .playMini {
  /* position: absolute; */
  bottom: 0;
  width: 100vw;
  height: 90px;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  z-index: 2;

  background-color: blueviolet;
}
.viwsWrap{
  display: flex;
  flex-direction: column;
  /* justify-content: center;
  align-items: center; */
}
</style>
