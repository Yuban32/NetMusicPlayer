<template>
  <div class="player">
    <div class="songInfo">
      <div class="cover">
        <img :src="musicInfo.picUrl + '?param=400y400'" />
      </div>
      <h2 class="songTitle">{{ musicInfo.musicName }}</h2>
      <h3 class="artist">《{{ musicInfo.album }}》</h3>
      <h3 class="album">{{ musicInfo.artist }}</h3>
    </div>
    <lyricView></lyricView>
  </div>
</template>
<script>
// import { mapMutations } from 'vuex'
import { mapState } from "vuex";
import lyricView from '@/views/LyricView'
export default {
  name: "Player",
  data() {
    return {};
  },
  methods: {},
  computed: {
    // ...mapMutations(['getMusicId']),
    ...mapState(["musicInfo"]),
  },components:{
    lyricView,
  }
};
</script>
<style scoped>
.songInfo {
  overflow: hidden;
  width: 50vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h2 {
  /*  */
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
}
h2::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background-color: #f5f5f5;
}
h2::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
h2::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
  cursor: pointer;
}
.player {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: column;
}
.cover {
  position: relative;
  margin: 50px 0 50px 0;
  width: 320px;
  height: 320px;
  background: url("../assets/IMG_20200311_224837.jpg") center;
  background-size: cover;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid darkgray;
}
.cover img {
  width: 100%;
  height: 100%;
  /* border-radius: 50%; */
  
}

</style>
