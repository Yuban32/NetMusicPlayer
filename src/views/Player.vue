<template>
  <div class="player">
    <canvas id="canvas"></canvas>
    <div class="songInfo">
      <div class="cover" :class="isPlay?'cover-rotate':''">
        <img :src="musicInfo.picUrl + '?param=400y400'" />
      </div>
      <h2 class="songTitle">{{ musicInfo.musicName }} <span v-if="musicKbps!=null||musicKbps!=undefined" class="musicKbps">{{musicKbps}}K</span></h2>
      <h3 class="artist">《{{ musicInfo.album }}》</h3>
      <h3 class="album">{{ musicInfo.artist }}</h3>
    </div>
    <div class="lyricView">
      <lyricView></lyricView>
    </div>
  </div>
</template>
<script>
  // import { mapMutations } from 'vuex'
  import {
    mapGetters,
    mapState
  } from "vuex";
  import lyricView from '@/components/LyricView'
  export default {
    name: "Player",
    data() {
      return {
        dataArray: null,
        analyser: null,
        bufferLength: null,
        barHeight: null,
        ctx: null,
        WIDTH: null,
        HEIGHT: null,
        barWidth: null,
        context: null,
        coverRotate: false
      };
    },
    props: ['musicKbps'],
    methods: {
      renderFrame() {

        // 矩形
        this.analyser.getByteFrequencyData(this.dataArray);

        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        for (var i = 0, x = 0; i < this.bufferLength; i++) {
          this.barHeight = this.dataArray[i];

          var r = this.barHeight + 25 * (i / this.bufferLength);
          var g = 250 * (i / this.bufferLength);
          var b = 50;

          this.ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          this.ctx.fillRect(x, this.HEIGHT - this.barHeight, this.barWidth, this.barHeight);

          x += this.barWidth + 2;
        }
        // 圆形
        // let PI = Math.PI;
        // let cr = 175;
        // let minHeight = 2;
        // let meterWidth = 5;
        // let meterNum = 180;
        // let gradient = this.ctx.createLinearGradient(0, -cr, 0, -this.WIDTH / 2);
        // gradient.addColorStop(0, '#ccc');
        // gradient.addColorStop(0.5, '#ccc');
        // gradient.addColorStop(1, '#dad');
        // this.ctx.fillStyle = gradient;

        // this.analyser.getByteFrequencyData(this.dataArray)
        // let step = Math.round(this.dataArray.length / meterNum);
        // this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT)
        // this.ctx.save();
        // this.ctx.translate(this.WIDTH / 2, this.HEIGHT / 2);
        // for (let i = 0; i < meterNum; i++) {
        //   let value = this.dataArray[i * step];
        //   let meterHeight = value * (this.HEIGHT / 2 - cr) / 856 || minHeight;
        //   this.ctx.rotate(2 * PI / meterNum);
        //   this.ctx.fillRect(-meterWidth / 2, -cr - meterHeight, meterWidth, meterHeight);
        // }
        // this.ctx.restore();
        requestAnimationFrame(this.renderFrame);
      },
      musicVisualization() {
        let audio = document.querySelector("audio")
        // audio.pause()
        this.context = new(window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 512;
        var source = this.context.createMediaElementSource(audio);
        // audio.play()
        source.connect(this.analyser);
        this.analyser.connect(this.context.destination);

        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        // console.log(this.dataArray);
        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.ctx = canvas.getContext("2d");
        this.WIDTH = canvas.width;
        this.HEIGHT = canvas.height;

        this.barWidth = this.WIDTH / this.bufferLength * 1.5;
        this.barHeight;

        this.renderFrame();
        this.coverRotate = true
      }

    },

    watch: {
      loginStatus(val) {
        return val
      },
      showMusicVisual(val) {
        if (val) {
          if (this.$store.getters.getLoginStatus) {
              this.musicVisualization();
          }
        } else {
          if (this.loginStatus) {
            if (this.context) {
              this.context.close().then(res => {
                console.log('可视化暂停');
              })
            }
          }
        }
        return val
      },
      isPlay(val) {
        return val
      },
    },
    computed: {
      // ...mapMutations(['getMusicId']),
      ...mapState(["musicInfo"]),
      ...mapState({
        showMusicVisual: state => state.musicVisualization,
        isPlay: state => state.isPlay,
        loginStatus: state => state.loginStatus
      }),

    },
    components: {
      lyricView,
    },
    mounted() {
    }
  };
</script>
<style scoped>
  .musicKbps {
    font-size: 16px;
    border: 1px solid white;
    padding: 2px;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .cover-rotate {
    animation: rotates 5s linear infinite;
  }

  @keyframes rotates {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  #canvas {
    position: absolute;
    width:100%;
    bottom: 0;
    z-index: -1;
  }

  .songInfo {
    position: relative;
    overflow: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1.8;
  }

  h2 {
    /*  */
    width: 100%;
    white-space: nowrap;
    overflow-y: hidden;
    overflow-x: auto;
    position: relative;
  }

  .player {
    display: flex;
    position: relative;
    /* justify-content: center; */
    width: 100%;
    align-items: center;
    flex-direction: column;
    height: 100%;
  }

  .cover {
    position: relative;
    margin: 50px 0 50px 0;
    min-width: 320px;
    min-height: 320px;
    background-size: cover;
    overflow: hidden;
    border-radius: 50%;
    border: 2px solid darkgray;
  }

  .cover img {
    width: 100%;
    height: 100%;
  }

  .lyricView {
    flex: 1;
    overflow: hidden;
  }

  @media screen and (max-height:750px) {
    .songInfo {
      display: none;
    }

    .lyricView /deep/ .lyric {
      height: calc(100% - 90px);
    }

    .lyricView {
      padding: 50px 0 0 0;
    }
  }
</style>