<template>
  <div class="home">
    <HomeNavbar />
    <div class="banner">
      <img src="../../assets/img/home/banner.webp" />
    </div>
    <HomeSearchBox />
  </div>
</template>

<script setup>
import useHomeStore from "@/stores/modules/home";
import HomeNavbar from "./cpns/home-navbar.vue";
import HomeSearchBox from "./cpns/home-search-box.vue";

//发送网络请求
const homeStore = useHomeStore();
homeStore.fetchHotSuggestsData();
</script>

<style lang="less" scoped>
.home {
  .banner {
    img {
      width: 100%;
    }
  }
}
</style>
