<template>
  <div class="lyric-Wrap">
    <div class="lyric">
      <ul :style="{
                transform:`translateY(${liTop}px)`
            }" >
        <li v-for="(item,index) in lyricArray" :key="index" ref="lyricLi" :class="{lyricLight:index==lyricIndex}">

          {{item.lyric}}

        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
  export default {
    name: 'LyricView',
    data() {
      return {
        lyric: '',
        lyricIndex: 0,
        liTop: 122.5,
      }
    },
    watch:{
      musicID(val,old){
        this.getLyric()
        this.lyricHandle()
        return val;
      }
    },
    methods: {
      getLyric() {
        this.axios.get('/lyric?id='+this.musicID).then(re => {
          this.lyric = re.data.lrc.lyric;
        }).catch(erorr => {
        })
        
      },
      // 歌词处理部分
      lyricHandle() {
        let audioElement = this.$store.state.audioElement;
        audioElement.addEventListener('timeupdate', () => {
          let time = parseInt(audioElement.currentTime);
          // console.log(time);
          let lyricLi = this.$refs.lyricLi;
          for (let i = 0; i < this.lyricArray.length; i++) {
            // console.log(i);
            if (i == this.lyricArray.length - 1) {
              this.lyricIndex = i;
              break;
            }
            if (time >= this.lyricArray[i].time && time < this.lyricArray[i + 1].time) {
              this.lyricIndex = i;
              try{
                this.liTop = -lyricLi[i].offsetTop + 122.5;
                // 开发的时候热重载保存后这条会报 offsetTop of undefined.....
              }catch(e){
                let error = e;
                
              }
              break;
            }
          }
        })
      }

    },
    computed: {
      ...mapState({
        musicID:state=>state.musicInfo.musicID
      }),
      lyricArray() {
        let larr = this.lyric.split('\n')
        larr.pop();
        let reg = /\[(\d+):(\d+\.\d+)\](.*)/;
        let lcArray = larr.map(lc => {
          let regResult = reg.test(lc);
          if (regResult) {
            return {
              time: (parseInt(RegExp.$1 * 60) + parseInt(RegExp.$2)).toFixed(2),
              lyric: RegExp.$3
            }
          }
        });
        return lcArray;
      },
    },
    mounted() {
      this.getLyric();
      try{
        this.lyricHandle()
      }catch(e){
        let error = e;
      }
    }
  }
</script>
<style scoped>
  .lyricLight {
    font-weight: bold;
    color: rgba(255, 255, 255, 0.8);
  }

  ul {
    transition: all 0.5s;
    height: 100%;
  }
  li{
    color: rgba(255, 255, 255, 0.5);
    font-size: 18px;

  }
  .lyric {
    overflow: hidden;
    height: 245px;
    width: 80%;
    margin: 0 auto;
    /* background-color: bisque; */
  }
  @media screen and (max-height:750px) {

}
</style>