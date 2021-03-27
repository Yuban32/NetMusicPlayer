<template>
  <div class="list">
    <!-- 推荐歌单 -->
    <h1 class="recommTitle" v-show="!showAlbum">{{ recommTitle }}</h1>
    <list v-if="!showAlbum" :listData="recommAlbumList" @getMusicID="showRecommAblum"></list>

    <!-- 详情 -->
    
    <albumDetail v-if="showAlbum" :backForwardShow="true" :albumList='albumLists' :albumDetailData="albumDetail"
      @showAlbum="showAlbumHandle"></albumDetail>
  
  </div>
</template>
<script>
  import {
    mapMutations,
    mapState
  } from "vuex";
  import List from "./List";
  import albumDetail from '@/components/AlbumDetail'
  export default {
    name: "AlbumList",
    data() {
      return {
        albumLists: [],
        
        showAlbum: false,
        albumDetail: {},
        recommTitle: "每日推荐歌单",
      };
    },
    methods: {
      showAlbumHandle(showAlbums) {
        this.showAlbum = showAlbums;
      },
      showRecommAblum(id) {
        // console.log(id);
        let dataList = null
        this.recommTitle = "每日推荐歌单详情";
        this.axios
          .get("/playlist/detail/dynamic?id=" + id)
          .then((result) => {
            let data = result.data.playlist
            this.albumDetail = [];
            this.albumDetail.push({
              coverImgUrl: data.coverImgUrl,
              albumName: data.name,
              description: data.description,
              creatorName: data.creator.nickname
            });
            dataList = result.data.playlist.tracks
              this.albumLists = []
            dataList.forEach(item=>{
              this.albumLists.push({
                musicID: item.id,
                musicName: item.name,
                artist: item.ar[0].name,
                artistID: item.ar[0].id,
                album: item.al.name,
                albumID: item.al.id,
                duration: item.dt,
                picUrl: item.al.picUrl,
              })

            })
            this.showAlbum = true;
          })
          .catch((err) => {});
      },

    },
    computed: {
      ...mapState(["recommAlbumList"]),
    },
    components: {
      List,
      albumDetail,
    },
  };
</script>
<style scoped>
  .list {
    width: 100%;
    height: calc(100vh - 90px);
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    text-align: left;
    overflow: hidden auto;
  }

  ul,
  li {
    list-style: none;
    overflow-y: scroll;
  }
  /* 子组件宽度兼容问题 暂未找到原因 只能强制设定50%宽度 */
  .albumDetail /deep/{
    height: calc(100% - 90px);
    width: 50% !important;
  }
  .albumDetail /deep/ .backForwardWrap {
    padding-left:10px;
    right: -118px;
    bottom: 100px;
  }
  .albumDetail /deep/ .backForwardWrap:hover{
    right: 0px;
  }
  .recommTitle {
    margin: 0 auto;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    margin-bottom: 10px;
  }

  .recommTitle::before {
    content: "";
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    width: 80%;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  /* 推荐歌单 */
</style>