<template>
  <div class="favor">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <div class="title">
        <span>我的收藏</span>
      </div>
    </div>

    <!-- 收藏内容 -->
    <div class="favor-content">
      <!-- 有收藏内容时 -->
      <div v-if="favorList.length > 0" class="favor-list">
        <div class="favor-header">
          <span class="count">共{{ favorCount }}个收藏</span>
          <van-button 
            type="danger" 
            size="small" 
            plain 
            @click="showClearDialog = true"
          >
            清空收藏
          </van-button>
        </div>
        
        <div class="list">
          <HouseItemFavor
            v-for="item in favorList"
            :key="item.houseId"
            :item-data="item"
            @remove="handleRemoveFavor"
          />
        </div>
      </div>

      <!-- 空收藏状态 -->
      <div v-else class="empty-favor">
        <div class="empty-image">
          <img src="@/assets/img/favor/empty_favorite.44731802.png" alt="暂无收藏" />
        </div>
        <div class="empty-text">
          <h3>还没有收藏任何房源</h3>
          <p>快去首页看看心仪的房源吧~</p>
        </div>
        <van-button 
          type="primary" 
          size="large" 
          round 
          @click="goToHome"
          class="go-home-btn"
        >
          去首页看看
        </van-button>
      </div>
    </div>

    <!-- 清空收藏确认对话框 -->
    <van-dialog
      v-model:show="showClearDialog"
      title="清空收藏"
      message="确定要清空所有收藏吗？此操作不可恢复。"
      show-cancel-button
      @confirm="handleClearFavor"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useFavorStore from '@/stores/modules/favor';
import HouseItemFavor from '@/components/house-item/house-item-favor.vue';

const router = useRouter();
const favorStore = useFavorStore();
const { favorList, favorCount } = storeToRefs(favorStore);

const showClearDialog = ref(false);

// 页面加载时从本地存储加载收藏数据
onMounted(() => {
  favorStore.loadFavorFromLocal();
});

// 移除单个收藏
const handleRemoveFavor = (houseId) => {
  favorStore.removeFromFavor(houseId);
};

// 清空所有收藏
const handleClearFavor = () => {
  favorStore.clearFavor();
  showClearDialog.value = false;
};

// 跳转到首页
const goToHome = () => {
  router.push('/home');
};
</script>

<style lang="less" scoped>
.favor {
  min-height: 100vh;
  background-color: #f5f5f5;

  .nav-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    height: 46px;
    background: #fff;
    
    .title {
      color: #2b0bc9;
      font-size: 16px;
      font-weight: 600;
    }
  }

  .favor-content {
    padding: 16px;

    .favor-list {
      .favor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding: 0 4px;

        .count {
          font-size: 14px;
          color: #666;
        }
      }

      .list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    }

    .empty-favor {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;

      .empty-image {
        margin-bottom: 24px;
        
        img {
          width: 120px;
          height: 120px;
          opacity: 0.6;
        }
      }

      .empty-text {
        margin-bottom: 32px;

        h3 {
          font-size: 18px;
          color: #333;
          margin-bottom: 8px;
          font-weight: 500;
        }

        p {
          font-size: 14px;
          color: #999;
          line-height: 1.5;
        }
      }

      .go-home-btn {
        width: 200px;
        height: 44px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
}
</style>