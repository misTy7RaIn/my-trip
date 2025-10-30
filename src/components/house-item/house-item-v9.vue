<template>
  <div class="house-item">
    <div class="item-inner">
      <div class="cover">
        <img :src="itemData.image.url" alt="" />
        <div class="favor-btn" @click="handleFavorClick">
          <van-icon 
            :name="isFavorited ? 'like' : 'like-o'" 
            :color="isFavorited ? '#ff4757' : '#fff'"
            size="20"
          />
        </div>
      </div>
      <div class="info">
        <div class="summary">{{ itemData.summaryText }}</div>
        <div class="name">{{ itemData.houseName }}</div>
        <div class="price">
          <van-rate
            :model-value="itemScore"
            color="#fff"
            :size="15"
            readonly
            allow-half
          />
          <div class="new">¥ {{ itemData.finalPrice }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import useFavorStore from '@/stores/modules/favor';

const props = defineProps({
  itemData: {
    type: Object,
    default: () => ({}),
  },
});

const favorStore = useFavorStore();

const itemScore = computed(() => {
  return Number(props.itemData.commentScore);
});

// 检查当前房源是否已收藏
const isFavorited = computed(() => {
  return favorStore.isFavorite(props.itemData?.houseId);
});

// 处理收藏点击
const handleFavorClick = (event) => {
  event.stopPropagation(); // 阻止事件冒泡
  favorStore.toggleFavor(props.itemData);
};
</script>

<style lang="less" scoped>
.house-item {
  width: 50%;

  .item-inner {
    position: relative;
    margin: 5px;
    background: #fff;
    border-radius: 6px;
    overflow: hidden;

    .cover {
      position: relative;
      
      img {
        width: 100%;
      }

      .favor-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 32px;
        height: 32px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        backdrop-filter: blur(4px);

        &:hover {
          background: rgba(0, 0, 0, 0.5);
          transform: scale(1.1);
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }

    .info {
      position: absolute;
      bottom: 0;
      padding: 8px 10px;
      color: #fff;

      .summary {
        font-size: 12px;
      }

      .name {
        margin: 5px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .price {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
      }
    }
  }
}
</style>
