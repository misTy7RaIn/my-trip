<template>
  <div class="tabbar">
    <template v-for="(item, index) in tabbarData">
      <div
        class="tabbar-item"
        :class="{ active: currentIndex === index }"
        @click="itemClick(index, item)"
      >
        <img :src="getAssetURL(item.image)" alt="" />
        <!-- <img src="../../assets/img/tabbar/tab_home.png"></img> -->
        <span class="text">{{ item.text }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import tabbarData from "../../assets/data/tabbar";
import { getAssetURL } from "@/utils/get-assets-img.js";
import { ref } from "vue";
import { useRouter } from "vue-router";
const currentIndex = ref(0);
const router = useRouter();
const itemClick = (index, item) => {
  currentIndex.value = index;
  router.push(item.path);
};
</script>

<style lang="less" scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  border-top: 1px solid #f3f3f3;
  .tabbar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &.active {
      color: #ff9854;
    }
    .text {
      font-size: 12px;
    }
    img {
      width: 32px;
    }
  }
}
</style>
