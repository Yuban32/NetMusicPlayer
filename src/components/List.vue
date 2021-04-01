<template>
  <div>
    <ul>
      <li v-for="(item, index) in listData" :key="index">
        <div class="container" @click="sendID(item.id)">
          <div class="line"></div>
          <span class="order">{{ index + 1 }}</span>
          <img class="listImg" :src="item.picUrl" alt="" />
          <span
            >{{ item.name
            }}<span v-if="!item.album"> - {{ item.ar[0].name }}</span></span
          >
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "list",
  data() {
    return {};
  },
  methods: {
    albumDetail(id) {
      console.log(id);
      this.axios
        .get("/playlist/detail/dynamic?id=" + id)
        .then((result) => {
          console.log(result);
          result.data.playlist.forEach((v) => {
            this.albumDetail = v;
          });

          console.log(this.albumDetail);
          this.showAlbum = true;
        })
        .catch((err) => {});
    },
    sendID(id) {
      console.log(id);
      this.$emit("getMusicID", id);
    },
  },
  props: ["listData"],
};
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
  left: -50px;
  width: 20px;
  height: 100%;
  background-color: rgba(255, 0, 0, 0.479);
  transform: skewX(40deg);
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
.container:hover .PBList {
  bottom: 15px;
}
.container:hover{
  transform: translateX(50px) scale(1.2);
  

}
.container:hover .line{
  animation: container-line 1.5s ease-in-out infinite;
}
</style>
