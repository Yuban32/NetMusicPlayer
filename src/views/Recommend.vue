<template>
  <div class="recommend">
    <albumList></albumList>
  </div>
</template>

<script>
import AlbumList from "../components/AlbumList.vue";
import { mapMutations } from "vuex";
export default {
  name: "Recommend",
  data() {
    return {
      dataList: [],
    };
  },
  methods: {
    ...mapMutations(["getRecommAlbum"]),
    recommAblum() {
      // let dataList = {};
      this.axios
        .get("/personalized?limit=15")
        .then((response) => {
          // console.log(response);
          response.data.result.forEach((v) => {
            this.dataList.push({
              name: v.name,
              id: v.id,
              picUrl: v.picUrl,
              copywriter: v.copywriter,
              album: true,
            });
            // console.log(v);
          });
          // console.log(this.dataList);
          this.getRecommAlbum(this.dataList);
          // data.forEach((v,i)=>{
          // })
        })
        .catch((err) => {});
    },
  },
  created() {
    this.recommAblum();
  },
  components: {
    AlbumList,
  },
};
</script>
<style scoped>
.recommend {
  background-color: rgba(63, 63, 63, 0.671);
}
</style>
