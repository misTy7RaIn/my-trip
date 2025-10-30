<template>
  <div class="house-item-favor">
    <div class="item-inner">
      <div class="cover">
        <img :src="itemData?.image?.url" alt="" />
      </div>
      <div class="info">
        <div class="location">
          <img src="@/assets/img/home/location.png" alt="" />
          <span>{{ itemData.location }}</span>
        </div>
        <div class="name">{{ itemData.houseName }}</div>
        <div class="summary">{{ itemData.summaryText }}</div>
        <div class="price-row">
          <div class="price">
            <div class="new">¥ {{ itemData.finalPrice }}</div>
            <div class="old">¥ {{ itemData.productPrice }}</div>
            <div class="tip" v-if="itemData.priceTipBadge">
              {{ itemData.priceTipBadge.text }}
            </div>
          </div>
          <div class="favor-time">
            收藏于 {{ formatFavorTime(itemData.favorTime) }}
          </div>
        </div>
      </div>
      <div class="actions">
        <van-button 
          type="danger" 
          size="small" 
          plain 
          @click="handleRemove"
          class="remove-btn"
        >
          取消收藏
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';

const props = defineProps({
  itemData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['remove']);

// 格式化收藏时间
const formatFavorTime = (favorTime) => {
  if (!favorTime) return '';
  return dayjs(favorTime).format('MM月DD日');
};

// 处理移除收藏
const handleRemove = () => {
  emit('remove', props.itemData.houseId);
};
</script>

<style lang="less" scoped>
.house-item-favor {
  .item-inner {
    display: flex;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .cover {
      width: 120px;
      height: 120px;
      flex-shrink: 0;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .info {
      flex: 1;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .location {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        
        img {
          width: 12px;
          height: 12px;
          margin-right: 4px;
        }

        span {
          font-size: 12px;
          color: #666;
        }
      }

      .name {
        font-size: 15px;
        font-weight: 500;
        color: #333;
        margin-bottom: 6px;
        line-height: 1.3;
        
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .summary {
        font-size: 12px;
        color: #999;
        margin-bottom: 8px;
        line-height: 1.4;
        
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      .price-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .price {
          display: flex;
          align-items: baseline;
          gap: 6px;

          .new {
            color: #ff9645;
            font-size: 16px;
            font-weight: 600;
          }

          .old {
            color: #999;
            font-size: 12px;
            text-decoration: line-through;
          }

          .tip {
            background: linear-gradient(270deg, #f66, #ff9f9f);
            color: #fff;
            padding: 2px 6px;
            border-radius: 6px;
            font-size: 10px;
          }
        }

        .favor-time {
          font-size: 11px;
          color: #999;
        }
      }
    }

    .actions {
      display: flex;
      align-items: center;
      padding: 12px 16px;

      .remove-btn {
        height: 32px;
        font-size: 12px;
        border-radius: 16px;
        min-width: 80px;
      }
    }
  }
}
</style>
