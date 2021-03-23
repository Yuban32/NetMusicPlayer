<template>
  <div class="list">
    <!-- 推荐歌单 -->
    <h1 class="recommTitle" v-show="!showAlbum">{{ recommTitle }}</h1>
    <list
      v-if="!showAlbum"
      :listData="recommAlbumList"
      @getMusicID="showRecommAblum"
    ></list>

    <!-- 详情 -->
    <albumDetail v-if="showAlbum" :albumDetail="albumDetail" @showAlbum="showAlbumHandle"></albumDetail>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import List from "./List";
import albumDetail from '@/components/AlbumDetail'
export default {
  name: "AlbumList",
  data() {
    return {
      albumList: [],
      showAlbum: false,
      albumDetail: {},
      recommTitle: "每日推荐歌单",
    };
  },
  methods: {
    showAlbumHandle(showAlbums){
      this.showAlbum = showAlbums;
    },
    showRecommAblum(id) {
      this.recommTitle = "每日推荐歌单详情";
      this.axios
        .get("/playlist/detail/dynamic?id=" + id)
        .then((result) => {
          this.albumDetail = result.data.playlist;
          // console.log(this.albumDetail);
          this.showAlbum = true;
        })
        .catch((err) => {});
      // console.log(this.albumDetail);
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
}

ul,
li {
  list-style: none;
  overflow-y: scroll;
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
