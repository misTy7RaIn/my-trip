<template>
  <div class="home">
    <HomeNavbar />
    <div class="banner">
      <img src="../../assets/img/home/banner.webp" />
    </div>
    <HomeSearchBox />
    <HomeCategories />
    <HomeContent />
  </div>
</template>

<script setup>
import useHomeStore from "@/stores/modules/home";
import HomeNavbar from "./cpns/home-navbar.vue";
import HomeSearchBox from "./cpns/home-search-box.vue";
import HomeCategories from "./cpns/home-categories.vue";
import HomeContent from "./cpns/home-content.vue";

//发送网络请求
const homeStore = useHomeStore();
homeStore.fetchHotSuggestsData();
homeStore.fetchCategoriesData();
homeStore.fetchHouselistData();
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
