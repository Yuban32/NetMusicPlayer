<template>
    <ul class="song-list-wrap">
        <li v-for="(item,index) in songList" :key="index">
            <div class="container">
              <div class="line" :class="isPlayID==item.musicID?'lineActive':''"></div>
                <span class="order">{{ index + 1 }}</span>
                <img class="listImg" :src="item.picUrl + '?param=55y55'"/>
                <span class="musicTitle">{{ item.musicName }}<span> - {{ item.artist }}</span></span>
                <font-awesome-icon @click="
                play(
                  item.musicID,
                  item.musicName,
                  item.artist,
                  item.artistID,
                  item.album,
                  item.albumID,
                  item.picUrl,
                  item.duration
                )
              " class="PBList" :icon="['fas', 'play-circle']" />
            </div>
        </li>
        <div class="more" v-if="showMore" @click="showMoreHandler">加载更多</div>
    </ul>
</template>

<script>
    import util from '@/util/util'
import { mapState } from 'vuex'
    export default {
        name: 'songlist',
        data() {
            return {
              index:1
            }
        },
        props:['songList','showMore'],
        methods: {
            showMoreHandler(){
              this.index++
              this.$emit("showMoreHandler",this.index);
            },
            play(musicID, musicName, artist, artistID, album, albumID, picUrl, duration) {
                let MusicInfo = [];
                duration = parseInt(duration / 1000);
                let totalTime = util.playTimeFormat(duration)
                MusicInfo.push({
                    musicID,
                    musicName,
                    artist,
                    artistID,
                    album,
                    albumID,
                    duration,
                    picUrl,
                    totalTime
                });

                util.mediaMetaDataHandle(MusicInfo);
                document.title = `${musicName} - ${artist} - Wick's播放器`;
                this.$store.commit("isPlay", true);
                this.$store.commit("getMusicInfo", MusicInfo);
            }
        },watch:{
          isPlayID(val){
            return val;
          }
        },computed:{
          ...mapState({
            isPlayID:state=>state.musicInfo.musicID
          })
        }
      }
</script>
<style scoped>
  .listImg{
    border-radius: 5px;
  }
  .more{
    cursor: pointer;
    height: 20px;
    user-select: none;
  }
    li{
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
}
.container {
  width: 100%;
  height: 70px;
  display: flex;
   /* css性能优化 跳过屏幕外的内容渲染 */
  content-visibility: auto;
  line-height: 50px;
  user-select: none;
  overflow: hidden;
  padding-top: 2px;
  position: relative;
  transition: all 0.2s;
  
}
.line{
  position: absolute;
  
  top: 0;
  left: -50px;
  width: 20px;
  height: 100%;
  transform: skewX(40deg);
}
.lineActive{
  animation: container-line1 1.5s ease-in-out infinite;
  background-color: rgba(255, 0, 0, 0.479);

}
@keyframes container-line {
  0%{
   width: 20px;
  }50%{
    width: 80%;
  }100%{
   width: 20px;
  }
}
@keyframes container-line1 {
  0%{
   width: 20px;
  }50%{
    width: 40%;
  }100%{
   width: 20px;
  }
}
.container:hover .PBList {
  bottom: 15px;
}
.container:hover{
  transform: translateX(10%) scale(1.2);
  

}
.container:hover .line{ 
  animation: container-line 1.5s ease-in-out infinite;
  background-color: rgba(255, 0, 0, 0.479);
}
.musicTitle {
  line-height: 35px;
  padding-left: 10px;
  transition: all 0.2s;
}
.PBList {
  position: absolute;
  bottom: -20px;
  left: 180px;
  cursor: pointer;
  transition: all 0.2s ease-in;
}
</style>