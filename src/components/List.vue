<template>
  <div>
    <ul>
      <li v-for="(item, index) in listData" :key="index">
        <div class="container" @click="sendID(item.id)">
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
      // console.log(id);
      this.$emit("getMusicID", id);
    },
  },
  props: ["listData"],
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
  padding: 2px 0 0 10px;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
}

.listImg {
  display: block;
  width: 45px;
  height: 45px;
  border-radius: 10px;
  margin-right: 5px;
}
</style>
