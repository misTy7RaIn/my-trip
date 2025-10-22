<template>
  <div class="home">
    <HomeNavbar />
    <div class="banner">
      <img src="../../assets/img/home/banner.webp" />
    </div>
    <div class="location">
      <div class="city">四川</div>
      <div class="position">
        <span class="text">我的位置</span>
        <img src="../../assets/img/home/icon_location.png" />
      </div>
    </div>
  </div>
</template>

<script setup>
import HomeNavbar from "./cpns/home-navbar.vue";
</script>

<style lang="less" scoped>
.home {
  .banner {
    img {
      width: 100%;
    }
  }
}
.location {
  display: flex;
  align-items: center;
  height: 74px;
  padding: 0 20;
  .city {
    flex: 1px;
  }
  .position {
    width: 74px;
    font-size: 12px;
    display: flex;
    align-items: center;
    img {
      width: 18px;
      height: 18px;
      margin-left: 5px;
    }
  }
}
</style>
