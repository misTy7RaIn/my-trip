<template>
  <div class="city">
    <div class="top">
      <van-search
        shape="round"
        show-action="true"
        v-model="searchValue"
        placeholder="城市/区域/位置"
        @cancel="cancelClick"
      />
      <van-tabs v-model:active="tabActive" color="blue">
        <template v-for="(value, key, index) in allCities" :key="key">
          <van-tab :title="value.title" :name="key"></van-tab>
        </template>
      </van-tabs>
    </div>
    <div class="content">
      <template v-for="(value, key, index) in allCities">
        <CityGroup v-show="tabActive === key" :group-data="value" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
// import { getCityAll } from "@/services/index";
import usecityStore from "@/stores/modules/city";
import { storeToRefs } from "pinia";
import CityGroup from "./cpns/city-group.vue";
const router = useRouter();

//搜索框功能
const searchValue = ref("");
const cancelClick = () => {
  router.back();
};

// tab的切换
const tabActive = ref();

//网络请求城市数据
// const allCity = ref();

// getCityAll().then((res) => {
//   allCity.value = res.data;
//   console.log(res);
// });

//从store中获取数据
const cityStore = usecityStore();
cityStore.fetchAllCitiesData();
const { allCities } = storeToRefs(cityStore);

//根据key从allcity中获取数据
const currentGrop = computed(() => allCities.value[tabActive.value]);
</script>

<style scoped>
.city {
  .top {
    position: relative;
    z-index: 9;
  }
  /* --van-tabs-line-height: 30px */
  .content {
    height: calc(100vh - 98px);
    overflow-y: auto;
  }
}
</style>
