<template>
  <div class="search-box">
    <div class="location">
      <div class="city" @click="cityClick">{{ currentCity.cityName }}</div>
      <div class="position">
        <span class="text">我的位置</span>
        <!-- <img src="../../assets/img/home/icon_location.png" /> -->
        <img src="@/assets/img/home/icon_location.png" />
      </div>
    </div>
    <div class="section date-range" @click="showCalender = true">
      <div class="start">
        <div class="data">
          <span class="tip">入住</span>
          <span class="time">{{ startDate }}</span>
        </div>
        <div class="stay">住{{ stayCount }}晚</div>
      </div>

      <div class="stay"></div>
      <div class="end">
        <div class="data">
          <span class="tip">离店</span>
          <span class="time">{{ endData }}</span>
        </div>
      </div>
    </div>
  </div>
  <van-calendar
    v-model:show="showCalender"
    type="range"
    :round="false"
    :show-confirm="true"
    @confirm="onConfirm"
  />

  <!-- 价格/人数选择 -->
  <div class="section price-counter bottom-gray-line">
    <div class="start">价格不限</div>
    <div class="end">人数不限</div>
  </div>

  <!-- 关键字 -->
  <div class="section keyword bottom-gray-line">关键字/位置/民俗名</div>

  <!-- 热门建议 -->
  <div class="section hut-suggests">
    <template v-for="(item, index) in hotSuggests" :key="index">
      <div
        class="item"
        :style="{
          color: item.tagText.color,
          background: item.tagText.background.color,
        }"
      >
        {{ item.tagText.text }}
      </div>
    </template>
  </div>
  <div class="section search-btn">
    <div class="btn" @click="startSearch">搜索</div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import usecityStore from "@/stores/modules/city";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { formatMonthDay, getDiffDays } from "@/utils/foramt_data";
import useHomeStore from "@/stores/modules/home";

const router = useRouter();
const cityStore = usecityStore();
const cityClick = () => {
  router.push("/city");
};
//获取我的城市信息
const { currentCity } = storeToRefs(cityStore);

//获取日期
const nowDate = new Date();
const startDate = ref(formatMonthDay(nowDate));
const newDate = new Date();
newDate.setDate(nowDate.getDate() + 1);
const endData = ref(formatMonthDay(newDate));
const stayCount = ref(getDiffDays(nowDate, newDate));

const showCalender = ref();
const onConfirm = (value) => {
  const selectStartDate = value[0];
  const selectEndDate = value[1];
  startDate.value = formatMonthDay(selectStartDate);
  endData.value = formatMonthDay(selectEndDate);
  stayCount.value = getDiffDays(selectStartDate, selectEndDate);
  showCalender.value = false;
};

//热门建议
const homeStore = useHomeStore();
const { hotSuggests } = storeToRefs(homeStore);

//开始搜索
const startSearch = () => {
  router.push({
    path: "/search",
    query: {
      startDate: startDate.value,
      endData: endData.value,
      currentCity: currentCity.value.cityName,
    },
  });
};
</script>

<style lang="less" scoped>
.search-box {
  --van-calendar-popup-height: 100%;
}
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

.date-range {
  height: 44px;
  .stay {
    flex: 1;
    text-align: center;
    font-size: 12px;
    color: #666;
  }
}
.section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0 20px;
  color: #999;
  height: 44px;
  .start {
    flex: 1;
    display: flex;
    height: 44px;
    align-items: center;
  }
  .end {
    min-width: 30%;
    padding-left: 20px;
  }
  .data {
    display: flex;
    flex-direction: column;

    .tip {
      font-size: 12px;
      color: #999;
    }

    .time {
      margin-top: 3px;
      color: #333;
      font-size: 15px;
      font-weight: 500;
    }
  }
}
.price-counter {
  .start {
    border-right: 1px solid #f2f2f2;
  }
}
.hut-suggests {
  margin: 10 0px;
  height: auto;
  .item {
    padding: 3px 5px;
    margin: 4px;
    border-radius: 14px;
    font-size: 12px;
  }
}
.search-btn {
  margin-top: 10px;
  .btn {
    width: 342px;
    height: 38px;
    max-height: 50px;
    font-weight: 500;
    font-size: 18px;
    line-height: 38px;
    text-align: center;
    border-radius: 20px;
    color: #fff;
    background-image: linear-gradient(90deg, #3f3ff587, #5e3ffc);
  }
}
</style>
