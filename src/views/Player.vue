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
    <div class="lyricView">
    <lyricView></lyricView>
    </div>
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
  flex: 1.8;
}
h2 {
  /*  */
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
}

.player {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: column;
  height: 100%;
}
.cover {
  position: relative;
  margin: 50px 0 50px 0;
  width: 320px;
  height: 320px;
  background-size: cover;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid darkgray;
}
.cover img {
  width: 100%;
  height: 100%;
  /* border-radius: 50%; */
  vertical-align: m;
}
.lyricView{
  flex: 1;
  /* background-color: azure; */
}
</style>
