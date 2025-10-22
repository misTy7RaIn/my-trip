<template>
  <div class="tabbar">
    <!-- <template v-for="(item, index) in tabbarData">
      <div
        class="tabbar-item"
        :class="{ active: currentIndex === index }"
        @click="itemClick(index, item)"
      >
        <img :src="getAssetURL(item.image)" alt="" />
        <img src="../../assets/img/tabbar/tab_home.png"></img>
        <span class="text">{{ item.text }}</span>
      </div>
    </template> -->
    <van-tabbar v-model="currentIndex">
      <template v-for="(item, index) in tabbarData">
        <van-tabbar-item :to="item.path" :icon="item.icon">
          <span>{{ item.text }}</span>
          <!-- <template #icon>
        <img v-if="currentIndex !== index" :src="getAssetURL(item.image)" alt=""></img>
          <img v-else :src="getAssetURL(item.imageActive)" alt="" />
        </template> -->
        </van-tabbar-item>
      </template>
    </van-tabbar>
  </div>
</template>

<script setup>
import tabbarData from "../../assets/data/tabbar";
import { getAssetURL } from "@/utils/get-assets-img";
import { ref } from "vue";
const currentIndex = ref(0);
</script>

<style lang="less" scoped>
.tabbar {
  img {
    height: 36px;
  }
}
</style>
