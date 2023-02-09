<template>
  <div class="search">
    <loading v-if="loadingStatus"></loading>
    <router-view></router-view>
    <div class="view">
      <div class="search-input">
        <input
          type="text"
          placeholder="查询..."
          v-model="searchKeyWord"
          @keydown.enter="search"
          @keydown="clearList"
        />
        <font-awesome-icon
          class="search-icon"
          :icon="['fas', 'search']"
          @click="search"
        />
      </div>
      {{ error }}

      <div class="hotSearch" v-show="hotShow">
        <div v-for="item in hot" :key="item.first">
          <p @click="hotClick($event)">{{item.first}}</p>
        </div>
      </div>
      <div class="data-view" v-show="!hotShow">
        <ul @scroll="handleScroll($event)">
          <songlist :songList="songList"></songlist>
        </ul>
      </div>
    </div>
    <!-- <div class="backForwardWrap" @click="clearList">
      <font-awesome-icon class="backForward" :icon="['fas', 'chevron-left']">BACK</font-awesome-icon>
      <span>BACK</span>
    </div> -->
  </div>
</template>
<script>
import { mapState } from "vuex";
import util from '@/util/util';
import SongList from '@/components/SongList'
import Loading from '@/components/Loading'
export default {
  name: "Search",
  data() {
    return {
      searchKeyWord: "",
      timer: "",
      songList: [],
      error: "什么都没有....",
      list: [],
      offset: 1,
      hot:null,
      hotShow:true,

    };
  },
  methods: {
    clearList(){
      this.hotShow=true;
        console.log(this.hotShow);
      
    },
    hotClick(e){
      // console.log(e.target.innerText);
      this.searchKeyWord = e.target.innerText;
      this.search();

    },
    sendInfo(musicID, musicName, artist, artistID, album, albumID, duration) {
      let list = [];
      let MusicInfo = [];
      this.axios.get("/album?id=" + albumID).then((response) => {
        // 获取歌曲的封面
        let picUrl = response.data.album.picUrl;
        duration = parseInt(duration/1000);
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
      // console.log(MusicInfo);
      this.$store.commit("getMusicInfo", MusicInfo);

      util.mediaMetaDataHandle(MusicInfo);

      });
      document.title = `${musicName} - ${artist}`;
      this.$store.commit("isPlay", true);
    },
    hotSearch(){
      this.axios.get('/search/hot').then(res=>{
        // console.log(res);
        this.hot = res.data.result.hots
        // console.log(this.hot);

      }).catch(error=>{
        console.log(error);
      })
    },
    search() {
      if (this.searchKeyWord != "") {
        clearTimeout(this.timer);
        this.list = [];
        this.timer = setTimeout(() => {
          this.axios
            .get("/search?keywords=" + this.searchKeyWord)
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
                    this.hotShow = false
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
        if(this.offset<4){
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
    ...mapState({
        loadingStatus:state=>state.LOADING
      }),
  },
  watch:{
    loadingStatus(val){
      return val;
    }
  },
  components:{
    "songlist":SongList,
    'loading':Loading,
  },created(){
    this.hotSearch()


  }
};
</script>
<style scoped>

.search {
  display: flex;
  width: 100%;
}

.search > div {
  flex: 1;
}

.data-view {
  height: 100%;
}

.data-view > ul {
  /* overflow: auto; */
  overflow-y: scroll;
  /* height: calc(100% - 90px); */
}

.view {
  /* background-color: antiquewhite; */
  padding: 20px 0 0 0;
  background: rgba(0, 0, 0, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.8);
  height: calc(100vh - 110px);
  overflow-y: auto;
}

.search-input > input {
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

.search-icon {
  font-size: 22px;
  cursor: pointer;
}
.hotSearch {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-flow: wrap;
  width: 300px;
  height: 200px;
  margin: 0 auto;
}
.hotSearch>div{
  padding: 5px;
  border: 1px solid white;
  border-radius: 10px;
  margin-right: 10px;
}
.hotSearch>div p{
  transition: all .2s;
  cursor: pointer;
}
.hotSearch div p:hover{
  color: white;
}

.backForwardWrap {
    position: fixed;
    cursor: pointer;
    font-size: 35px;
    height: 50px;
    width: 150px;
    right: -100px;
    bottom: 100px;
    background-color: rgba(122, 122, 122, 0.527);
    border-radius: 10px 0 0 10px;
    transition: all 0.2s ease-in;
    line-height: 55px;
    user-select: none;
    z-index: 9;
  }

  .backForwardWrap:hover {
    right: 0;
  }

  .backForwardWrap>span {
    margin-left: 10px;
    font-size: 30px;
    line-height: 50px;
  }
</style>
