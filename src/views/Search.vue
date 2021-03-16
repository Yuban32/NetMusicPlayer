<template>
  <div class="search">
    <router-view></router-view>
    <div class="view">
      <div class="searchInput">
        <input
          type="text"
          placeholder="查询..."
          v-model="searchKeyWord"
          @keydown.enter="search"
        />
        <font-awesome-icon
          class="searchIcon"
          :icon="['fas', 'search']"
          @click="search"
        />
      </div>
      {{ error }}
      <div class="dataView">
        <ul @scroll="handleScroll($event)">
          <li v-for="(item, index) in songList" :key="index">
            <div class="container">
              <span class="order">{{ index + 1 }}</span>
              <img class="listImg" :src="item.picUrl + '?param=45y45'" alt="" />
              <span class="musicTitle"
                >{{ item.musicName }}<span> - {{ item.album }}</span></span
              >
              <font-awesome-icon
                @click="
                  sendInfo(
                    item.musicID,
                    item.musicName,
                    item.artist,
                    item.artistID,
                    item.album,
                    item.albumID,
                    item.duration
                  )
                "
                class="PBList"
                :icon="['fas', 'play-circle']"
              />
            </div>

            <!-- <div class="container">
              <img :src="url" alt="" />
              <span class="order">{{ index + 1 }}</span>
              <span class="musicTitle">
                {{ item.name }} - {{ item.artists[0].name }}</span
              >
              <font-awesome-icon
                class="PBList"
                :icon="['fas', 'play-circle']"
              />
            </div> -->
            <!-- @click="
                  sendInfo(
                    item.id,
                    item.name,
                    item.artists[0].name,
                    item.artists[0].id,
                    item.album.name,
                    item.album.id,
                    item.duration
                  )
                " -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
// import { mapMutations } from 'vuex';
import { mapState } from "vuex";
export default {
  name: "Search",
  data() {
    return {
      searchKeyWord: "",
      timer: "",
      songList: [],
      error: "什么都没有....",
      list: [],
      offset: 0,
    };
  },
  methods: {
    sendInfo(musicID, musicName, artist, artistID, album, albumID, duration) {
      // console.log(musicID);
      let list = [];
      let MusicInfo = [];
      this.axios.get("/album?id=" + albumID).then((response) => {
        // console.log(response);
        // 获取歌曲的封面
        let picUrl = response.data.album.picUrl;
        this.$store.commit("getPicURL", picUrl);
      });
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

      // this.songList.forEach((v) => {
      //   list.push({
      //     musicID: v.id,
      //     musicName: v.name,
      //     artis: v.artists[0].name,
      //     album: v.album.name,
      //     albumID: v.album.id,
      //     duration: v.duration,
      //   });
      //   this.$store.commit("getMusicList", list);
      // });
    },
    search() {
      if (this.searchKeyWord != "") {
        clearTimeout(this.timer);
        this.list = [];
        this.timer = setTimeout(() => {
          console.log(this.searchKeyWord);
          this.axios
            .get("https://api.wick32.cn/search?keywords=" + this.searchKeyWord)
            .then((response) => {
              // console.log(response);
              let datas = response.data.result.songs;

              datas.forEach((v, i) => {
                // console.log(i);
                this.axios
                  .get("/album?id=" + v.album.id)
                  .then((response) => {
                    // console.log(response);
                    // 获取歌曲的封面
                    let url = null;
                    url = response.data.album.picUrl;

                    this.list.push({
                      musicID: v.id,
                      musicName: v.name,
                      artist: v.artists[0].name,
                      artistID: v.artists[0].id,
                      album: v.album.name,
                      albumID: v.album.id,
                      duration: v.duration,
                      picUrl: url,
                    });
                    this.songList = this.unique(this.list);
                  })
                  .catch((err) => {
                    // console.log(err);
                  });
              });
              this.error = "";
            })
            .catch((error) => {
              // console.log(error);
              this.error = "什么都没有";
            });
        }, 200);
      }
    },
    unique(arr) {
      const res = new Map();
      return arr.filter(
        (arr) => !res.has(arr.musicID) && res.set(arr.musicID, 1)
      );
    },
    handleScroll(e) {
      // console.log(e);
      if (e.srcElement.scrollTop + e.srcElement.offsetHeight >=e.srcElement.scrollHeight) {
        this.offset++;
        if(this.offset<3){
          
        console.log(this.offset);
        this.axios.get(
            "https://api.wick32.cn/search?keywords=" +
              this.searchKeyWord +
              "&offset=" +
              this.offset
          ).then((response) => {
            let moreData = response.data.result.songs;
            moreData.forEach((v) => {
              this.axios
                  .get("/album?id=" + v.album.id)
                  .then((response) => {
                    // console.log(response);
                    // 获取歌曲的封面
                    let url = null;
                    url = response.data.album.picUrl;

                    this.songList.push({
                      musicID: v.id,
                      musicName: v.name,
                      artist: v.artists[0].name,
                      artistID: v.artists[0].id,
                      album: v.album.name,
                      albumID: v.album.id,
                      duration: v.duration,
                      picUrl: url,
                    });
                  })
                  .catch((err) => {
                    // console.log(err);
                  });
            });
          });
        }
      }
    },
  },
  computed: {
    // ...mapMutations(['getMusicId']),
    ...mapState(["musicInfo"]),
  },
};
</script>
<style scoped>
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
.PBList {
  position: absolute;
  bottom: -20px;
  left: 120px;
  cursor: pointer;
  transition: all 0.2s ease-in;
}
.musicTitle {
  line-height: 20px;
}
.search {
  display: flex;
}

.search > div {
  flex: 1;
}

.dataView {
  height: calc(100% - 30px);
}

.dataView > ul {
  /* overflow: auto; */
  overflow-y: scroll;
  height: 100%;
}

.view {
  /* background-color: antiquewhite; */
  padding: 20px 0 0 0;
  background: rgba(0, 0, 0, 0.2);
  border-left: 1px solid rgba(255, 255, 255, 0.8);
  height: calc(100% - 110px);
  overflow-y: auto;
}

.searchInput > input {
  display: inline-block;
  background: transparent;
  outline: none;
  border-top: none;
  border-right: none;
  border-left: none;
  width: 300px;
  font-size: 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.searchIcon {
  font-size: 22px;
  cursor: pointer;
}
</style>
