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
    <div class="albumDetail" v-if="showAlbum">
      <div class="description">
        <div class="coverPic">
          <img :src="albumDetail.coverImgUrl" />
        </div>
        <div class="infosWrap">
          <div class="infos">
            <h2 class="infosTitle">{{ albumDetail.name }}</h2>
            <p>By:{{ albumDetail.creator.nickname }}</p>
            <p>{{ albumDetail.description }}</p>
          </div>

          <span class="addAll">
            <font-awesome-icon
              :icon="['fas', 'list-ul']"
              title="添加全部"
            ></font-awesome-icon>
            添加全部
          </span>
        </div>
      </div>
      <!-- 渲染出来的歌单详细数据 -->
      <ul>
        <li v-for="(item, index) in albumDetail.tracks" :key="index">
          <div class="container">
            <span class="order">{{ index + 1 }}</span>
            <img
              class="listImg"
              :src="item.al.picUrl + '?param=45y45'"
              alt=""
            />
            <span class="musicTitle"
              >{{ item.name }}<span> - {{ item.ar[0].name }}</span></span
            >
            <font-awesome-icon
              @click="
                play(
                  item.id,
                  item.name,
                  item.ar[0].name,
                  item.ar[0].id,
                  item.al.name,
                  item.al.id,
                  item.al.picUrl,
                  item.dt
                )
              "
              class="PBList"
              :icon="['fas', 'play-circle']"
            />
          </div>
        </li>
      </ul>
      <div class="backForwardWrap" @click="showAlbum = !showAlbum">
        <font-awesome-icon class="backForward" :icon="['fas', 'chevron-left']"
          >BACK</font-awesome-icon
        >
        <span>BACK</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import List from "./List";
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
    showRecommAblum(id) {
      this.recommTitle = "每日推荐歌单详情";
      this.axios
        .get("/playlist/detail/dynamic?id=" + id)
        .then((result) => {
          this.albumDetail = result.data.playlist;
          console.log(this.albumDetail);
          this.showAlbum = true;
        })
        .catch((err) => {});
      console.log(this.albumDetail);
    },
    play(
      musicID,
      musicName,
      artist,
      artistID,
      album,
      albumID,
      picUrl,
      duration
    ) {
      this.axios.get("/album?id=" + albumID).then((response) => {
        // console.log(response);
        // 获取歌曲的封面
        let picUrl = response.data.album.picUrl;
        this.$store.commit("getPicURL", picUrl);
      });
      let MusicInfo = [];
      MusicInfo.push({
        musicID,
        musicName,
        artist,
        artistID,
        album,
        albumID,
        duration,
      });
      document.title = `${musicName} - ${artist}`;
      this.$store.commit("isPlay", true);
      this.$store.commit("getMusicInfo", MusicInfo);
    },
  },
  computed: {
    ...mapState(["recommAlbumList"]),
  },
  components: {
    List,
  },
};
</script>
<style scoped>
.list {
  width: 100%;
  height: calc(100vh - 90px);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.521);
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
}
@media screen and (max-width: 850px) {
  .albumDetail .description {
    height: 210px;
  }
}
.container {
  width: 100%;
  height: 50px;
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  line-height: 50px;

  user-select: none;
  overflow: hidden;
  padding-top: 2px;
  position: relative;
}
.container:hover .PBList {
  bottom: 5px;
}
.musicTitle {
  line-height: 20px;
}
.coverPic img {
  height: 100px;
  width: 100px;
  border-radius: 10px;
}
.PBList {
  position: absolute;
  bottom: -20px;
  left: 120px;
  cursor: pointer;
  transition: all 0.2s ease-in;
}
/* 推荐歌单 */

.albumDetail {
  position: relative;
}
.backForwardWrap {
  position: fixed;
  cursor: pointer;
  font-size: 35px;
  height: 50px;
  width: 150px;
  right: -118px;
  bottom: 100px;
  background-color: rgba(122, 122, 122, 0.527);
  border-radius: 10px 0 0 10px;
  transition: all 0.2s ease-in;
  line-height: 55px;
  padding-left: 10px;
  user-select: none;
}
.backForwardWrap:hover {
  right: 0px;
}

.backForwardWrap > span {
  margin-left: 10px;
  font-size: 30px;
  line-height: 50px;
}
.infosWrap {
  height: 130px;
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
  width: 45px;
  height: 45px;
  border-radius: 10px;
  margin-right: 5px;
}
</style>
