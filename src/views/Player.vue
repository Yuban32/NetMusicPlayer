<template>
  <div class="player">
    <div class="songInfo">
      <canvas id="canvas"></canvas>
      <div class="cover">
        <img :src="musicInfo.picUrl + '?param=400y400'" />
      </div>
      <h2 class="songTitle">{{ musicInfo.musicName }}</h2>
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
    mapState
  } from "vuex";
  import lyricView from '@/components/LyricView'
  export default {
    name: "Player",
    data() {
      return {
        dataArray:null,
        analyser:null,
        bufferLength:null,
        barHeight:null,
        ctx:null,
        WIDTH:null,
        HEIGHT:null,
        barWidth:null,
      };
    },
    methods: {
      renderFrame() {
          requestAnimationFrame(this.renderFrame);

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
        },
      musicVisualization(flag) {
        
        let audio = this.$store.state.audioElement;
        audio.pause()
        var context = new(window.AudioContext || window.webkitAudioContext)();
        this.analyser = context.createAnalyser();
        this.analyser.fftSize = 512;
        var source = context.createMediaElementSource(audio);
        audio.play()
        source.connect(this.analyser);
        this.analyser.connect(context.destination);

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
      }
      
    },
    
    watch:{
        showMusicVisual(val){
          if(val){
            // this.musicVisualization();
            // console.log('执行可视化');
          }
          return val
        }
      },
    computed: {
      // ...mapMutations(['getMusicId']),
      ...mapState(["musicInfo"]),
      ...mapState({
        showMusicVisual:state=>state.musicVisualization
      })
    },
    components: {
      lyricView,
    }
  };
</script>
<style scoped>
  #canvas{
    position: absolute;
    /* background-color: antiquewhite; */
    bottom: 90px;
    width: 50%;
  }
  .songInfo {
    overflow: hidden;
    width: 50vw;
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
  }

  .player {
    display: flex;
    /* justify-content: center; */
    align-items: center;
    flex-direction: column;
    height: 100%;
  }

  .cover {
    position: relative;
    margin: 50px 0 50px 0;
    width: auto;
    min-height: auto;
    background-size: cover;
    overflow: hidden;
    border-radius: 50%;
    border: 2px solid darkgray;
  }

  .cover img {
    width: 320px;
    height: 320px;
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