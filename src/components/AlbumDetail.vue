<template>
  <div class="albumDetail">
    <div class="description">
      <div class="coverPic">
        <img
          :src="albumDetailData[0].coverImgUrl?albumDetailData[0].coverImgUrl+'?param=100y100':albumDetailData[0].picUrl+'?param=100y100'" />
      </div>
      <div class="infosWrap">
        <div class="infos">
          <h2 class="infosTitle">{{ albumDetailData[0].albumName }}</h2>
          <p>{{ albumDetailData[0].creatorName?'By:'+albumDetailData[0].creatorName:'' }}</p>
          <p>{{ albumDetailData[0].description }}</p>
        </div>

        <span v-if="albumDetailData[0].creatorName" class="addAll" @click="addAll">
          <font-awesome-icon :icon="['fas', 'list-ul']" title="添加全部" ></font-awesome-icon>
          添加全部
        </span>
        <!-- <span v-if="!albumDetailData[0].creatorName" class="addAll">
          <font-awesome-icon :icon="['fas','trash-alt']"></font-awesome-icon>
          删除全部
        </span> -->
      </div>
    </div>
    <!-- 渲染出来的歌单详细数据 -->
    <songList :songList="albumList" :showMore="showMore" @showMoreHandler="showMoreHandler"></songList>

    <div class="backForwardWrap" @click="sendBack" v-if="backForwardShow">
      <font-awesome-icon class="backForward" :icon="['fas', 'chevron-left']">BACK</font-awesome-icon>
      <span>BACK</span>
    </div>
  </div>
</template>

<script>
  import util from '@/util/util'
  import SongList from '@/components/SongList'
  export default {
    data() {
      return {
        showAlbums: false,
        songList: this.albumList
      }
    },
    props: ['albumDetailData', 'albumList', 'backForwardShow','showMore'],
    methods: {
      showMoreHandler(e){
        this.$emit('showMoreHandler',e)
      },
      sendBack() {
        this.$emit('showAlbum', this.showAlbums);
        // console.log(123);
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
        // console.log(musicID);
        // util.mediaMetaDataHandle(MusicInfo);
        document.title = `${musicName} - ${artist} - Yuban32播放器`;
        this.$store.commit("isPlay", true);
        this.$store.commit("getMusicInfo", MusicInfo);
      },
      removeAll() {
        console.log(21);
        this.albumList.splice(0, this.albumList.length)
      },
      addAll(){
        // console.log(123);
        this.$store.commit('addMusicList',this.albumList)
      }
    },
    components: {
      'songList': SongList
    },
    mounted() {
      // console.log(this.albumList);
    }
  }
</script>

<style scoped>
  /* 歌单详情 */
  .albumDetail .description {
    display: flex;
    flex-direction: row;
    /* border-bottom: 1px solid rgba(255, 255, 255, 0.2); */
    box-shadow: 0px 10px 5px rgba(0, 0, 0, 0.733);
    background-color: rgba(0, 0, 0, 0.5);
    padding: 20px 20px 10px 20px;
    overflow: hidden;
    margin-bottom: 10px;
    height: 150px;
    width: 100%;
  }

  @media screen and (max-width: 850px) {
    .albumDetail .description {
      height: 210px;
    }
  }

  li {
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

  .container:hover .PBList {
    bottom: 15px;
  }

  .container:hover {
    transform: translateX(50px) scale(1.2)
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


  .albumDetail {
    position: absolute;
    width: 100%;
    height: calc(100%);
    overflow-y: scroll;
    overflow-x: hidden;

  }

  .backForwardWrap {
    position: fixed;
    cursor: pointer;
    font-size: 35px;
    height: 50px;
    width: 150px;
    right: -30px;
    bottom: 0;
    background-color: rgba(122, 122, 122, 0.527);
    border-radius: 10px 0 0 10px;
    transition: all 0.2s ease-in;
    line-height: 55px;
    user-select: none;
    z-index: 9;
  }

  .backForwardWrap:hover {
    right: 70px;
  }

  .backForwardWrap>span {
    margin-left: 10px;
    font-size: 30px;
    line-height: 50px;
  }

  .infosWrap {
    height: 130px;
    width: 100%;
    text-align: left;
  }

  .infos {
    width: 75%;
    margin-left: 20px;
    height: 125px;
    overflow: auto;
  }

  .addAll {
    margin-top: 20px;
    cursor: pointer;
    margin-left: 20px;
  }

  .list .albumList {
    width: 100%;
    height: calc(100vh - 90px);
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .list .albumList li {
    width: 100%;
    height: 50px;
    margin-top: 5px;
  }

  .list .albumList li div {
    width: 100%;
    height: 50px;
    display: flex;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
    line-height: 50px;
    padding: 0 0 0 10px;
    cursor: pointer;
    user-select: none;
  }

  .list .listImg {
    display: block;
    width: auto;
    height: auto;
    border-radius: 10px;
    margin-right: 5px;
  }
</style>