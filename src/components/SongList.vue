<template>
    <ul class="song-list-wrap">
        <li v-for="(item,index) in songList" :key="index">
            <div class="container">
              <div class="line"></div>
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
    </ul>
</template>

<script>
    import util from '@/util/util'
    export default {
        name: 'songlist',
        data() {
            return {

            }
        },
        props:['songList'],
        methods: {
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
                console.log(MusicInfo);
                util.mediaMetaDataHandle(MusicInfo);
                document.title = `${musicName} - ${artist} - Wick's播放器`;
                this.$store.commit("isPlay", true);
                this.$store.commit("getMusicInfo", MusicInfo);
            }
        }
    }
</script>
<style scoped>
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
  left: -1490px;
  width: 2000px;
  height: 2200px;
  background-color: rgba(255, 0, 0, 0.479);
  transform: rotate(40deg);
}
@keyframes container-line {
  0%{
   left: -1490px;
    /* width: 5px; */
  }50%{
    left: -700px;
    /* width: 150%; */
  }100%{
   left: -1490px;
    /* width: 5px; */
  }
}
.container:hover .PBList {
  bottom: 15px;
}
.container:hover{
  transform: translateX(50px) scale(1.2);
  

}
.container:hover .line{
  animation: container-line 1.5s ease-in-out infinite;
}
.musicTitle {
  line-height: 35px;
  padding-left: 10px;
  transition: all 0.2s;
}
.coverPic img {
  height: 100px;
  width: 100px;
  border-radius: 10px;
}
.PBList {
  position: absolute;
  bottom: -20px;
  left: 180px;
  cursor: pointer;
  transition: all 0.2s ease-in;
}
</style>