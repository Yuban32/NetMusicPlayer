<template>
  <div id="navWrap">
    <transition-group name="nav" tag="ul" id="nav">
      <!-- <router-link tag="li" to="/login" key="login" @click="fn()">
        <div class="icon-wrap">
          <font-awesome-icon class="navIcon" :icon="['far', 'user']" />
        </div>
        登录
      </router-link> -->
      <router-link key="recoms" tag="li" to="/recom">
        <div class="icon-wrap">
          <font-awesome-icon class="navIcon" :icon="['fas', 'stream']" />
        </div>
        推荐
      </router-link>
      <router-link key="search" tag="li" to="/search">
        <div class="icon-wrap">
          <font-awesome-icon class="navIcon" :icon="['fas', 'search']" />
        </div>
        搜索
      </router-link>
      <router-link key="rank" tag="li" to="/rank">
        <div class="icon-wrap">
          <font-awesome-icon class="navIcon" :icon="['fas', 'list-ul']" />
        </div>
        榜单</router-link>
      <router-link key="settings" tag="li" to="/setting">
        <div class="icon-wrap">
          <font-awesome-icon class="navIcon" :icon="['fas', 'cog']" />
        </div>
        设置
      </router-link>
      <router-link key="abouts" tag="li" to="/about">
        <div class="icon-wrap">
          <font-awesome-icon class="navIcon" :icon="['fas', 'info-circle']" />
        </div>
        关于
      </router-link>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: "Nav",
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>
<style scoped>
#navWrap {
  background: transparent;
  z-index: 3;
}
#nav {
  padding: 70px 0 0 0;
  background-color: rgba(0, 0, 0, 0.68);
  width: 70px;
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.5s;
}
#nav:hover {
  width: 200px;
  padding: 70px 0 0 50px;
}
#nav li {
  margin-top: 10px;
  width: 200px;
  height: 50px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  color: #d0c5c2;
  font-size: 1.5rem;
  user-select: none;
  min-width: 150px;
  transition: all 0.5s;
}
#nav li:hover {
  transform: scale(1.05);
  color: #ffffff;
}
#nav li.router-link-exact-active {
  color: #ffffff;
}

#nav .navIcon {
  font-size: 3rem;
}

#nav .icon-wrap {
  margin: 10px;
  min-width: 50px;
  min-height: 50px;
  /* border: 1px solid blue; */
}
</style>