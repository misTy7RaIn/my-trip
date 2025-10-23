<template>
  <div class="search-box">
    <div class="location">
      <div class="city" @click="cityClick">四川</div>
      <div class="position">
        <span class="text">我的位置</span>
        <!-- <img src="../../assets/img/home/icon_location.png" /> -->
        <img src="@/assets/img/home/icon_location.png" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const cityClick = () => {
  router.push("/city");
};
</script>

<style lang="less" scoped>
.location {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 20;
  .city {
    flex: 1px;
    color: #666;
    font-size: 18px;
    margin-left: 10px;
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
    .text {
      color: #666;
      position: relative;
    }
  }
}
</style>
