<template>
  <div class="search-box-wrapper">
    <!-- 城市和位置 -->
    <div class="location-card">
      <div class="city" @click="cityClick">
        <span class="city-name">{{ currentCity.cityName }}</span>
        <span class="arrow">›</span>
      </div>
      <div class="position">
        <img src="@/assets/img/home/icon_location.png" />
        <span class="text">我的位置</span>
      </div>
    </div>

    <!-- 日期选择 -->
    <div class="date-card" @click="showCalender = true">
      <div class="date-item">
        <span class="label">入住</span>
        <span class="value">{{ startDate }}</span>
      </div>
      <div class="stay-duration">
        <span class="nights">{{ stayCount }}晚</span>
      </div>
      <div class="date-item">
        <div class="date-item-content">
        <span class="label">离店</span>
        <span class="value">{{ endData }}</span></div>
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
    <div class="filter-card">
      <div class="filter-item">
        <span class="filter-label">价格不限</span>
      </div>
      <div class="divider"></div>
      <div class="filter-item">
        <span class="filter-label">人数不限</span>
      </div>
    </div>

    <!-- 关键字搜索 -->
    <div class="keyword-card">
      <span class="keyword-placeholder">关键字/位置/民宿名</span>
    </div>

    <!-- 热门建议 -->
    <div class="suggests-wrapper">
      <div class="suggests-title">热门推荐</div>
      <div class="suggests-list">
        <div
          v-for="(item, index) in hotSuggests"
          :key="index"
          class="suggest-tag"
          :style="{
            color: item.tagText.color,
            background: item.tagText.background.color,
          }"
        >
          {{ item.tagText.text }}
        </div>
      </div>
    </div>

    <!-- 搜索按钮 -->
    <div class="search-btn-wrapper">
      <button class="search-btn" @click="startSearch">
        <span>开始搜索</span>
      </button>
    </div>
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
.search-box-wrapper {
  --van-calendar-popup-height: 100%;
  padding: 0 16px;
}

// 城市位置卡片
.location-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .city {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
    
    .city-name {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-right: 4px;
    }
    
    .arrow {
      font-size: 24px;
      color: #999;
      font-weight: 300;
    }
    
    &:active {
      opacity: 0.7;
    }
  }
  
  .position {
    display: flex;
    align-items: center;
    gap: 4px;
    
    img {
      width: 16px;
      height: 16px;
    }
    
    .text {
      font-size: 13px;
      color: #666;
    }
  }
}

// 日期卡片
.date-card {
  background: #fff;
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  
  .date-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    .date-item-content{
      display: flex;
      flex-direction: column;
      margin-left: 55px;
    }
    .label {
      font-size: 13px;
      color: #999;
    }
    
    .value {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .stay-duration {
    padding: 0 16px;
    
    .nights {
      font-size: 14px;
      color: #5e3ffc;
      font-weight: 600;
      white-space: nowrap;
    }
  }
}

// 筛选卡片
.filter-card {
  background: #fff;
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  
  .filter-item {
    flex: 1;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    
    .filter-label {
      font-size: 15px;
      color: #666;
    }
    
    &:active {
      opacity: 0.7;
    }
  }
  
  .divider {
    width: 1px;
    height: 20px;
    background: #e8e8e8;
  }
}

// 关键字卡片
.keyword-card {
  background: #fff;
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.3s;
  
  &:active {
    opacity: 0.7;
  }
  
  .keyword-placeholder {
    font-size: 15px;
    color: #999;
  }
}

// 热门推荐
.suggests-wrapper {
  background: #fff;
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  
  .suggests-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  }
  
  .suggests-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .suggest-tag {
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      
      &:active {
        transform: scale(0.95);
        opacity: 0.8;
      }
    }
  }
}

// 搜索按钮
.search-btn-wrapper {
  padding: 8px 0 20px;
  
  .search-btn {
    width: 100%;
    height: 50px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 25px;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: all 0.3s;
    
    &:active {
      transform: translateY(2px);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }
  }
}
</style>
