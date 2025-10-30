<template>
  <div class="order">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <div class="title">
        <span>我的订单</span>
      </div>
      <!-- 右侧操作按钮 -->
      <div class="nav-actions">
        <van-icon 
          name="search" 
          size="18" 
          @click="handleSearch"
          class="search-icon"
        />
        <van-icon 
          name="ellipsis" 
          size="18" 
          @click="showMoreActions = true"
          class="more-icon"
        />
      </div>
    </div>

    <!-- 订单统计信息 -->
    <div class="order-stats" v-if="orderCount > 0">
      <div class="stats-item">
        <div class="stats-number">{{ orderCount }}</div>
        <div class="stats-label">总订单</div>
      </div>
      <div class="stats-item">
        <div class="stats-number">{{ statusCounts.pending || 0 }}</div>
        <div class="stats-label">待支付</div>
      </div>
      <div class="stats-item">
        <div class="stats-number">{{ statusCounts.paid || 0 }}</div>
        <div class="stats-label">已支付</div>
      </div>
      <div class="stats-item">
        <div class="stats-number">{{ statusCounts.completed || 0 }}</div>
        <div class="stats-label">已完成</div>
      </div>
    </div>

    <!-- 订单标签页内容 -->
    <div class="order-content">
      <!-- 下拉刷新 -->
      <van-pull-refresh 
        v-model="refreshing" 
        @refresh="handleRefresh"
        success-text="刷新成功"
        class="pull-refresh"
      >
        <!-- 订单标签页组件 -->
        <OrderTabs />
      </van-pull-refresh>
    </div>

    <!-- 更多操作弹出层 -->
    <van-action-sheet
      v-model:show="showMoreActions"
      :actions="moreActions"
      @select="handleMoreAction"
      cancel-text="取消"
      title="更多操作"
    />

    <!-- 搜索弹出层 -->
    <van-popup 
      v-model:show="showSearchPopup" 
      position="top" 
      :style="{ height: '100%' }"
    >
      <div class="search-container">
        <div class="search-header">
          <van-icon 
            name="arrow-left" 
            size="18" 
            @click="showSearchPopup = false"
          />
          <van-field
            v-model="searchKeyword"
            placeholder="搜索订单号、房源名称"
            clearable
            @keyup.enter="performSearch"
            class="search-field"
          />
          <van-button 
            type="primary" 
            size="small" 
            @click="performSearch"
          >
            搜索
          </van-button>
        </div>
        
        <!-- 搜索结果 -->
        <div class="search-results" v-if="searchResults.length > 0">
          <OrderItem
            v-for="order in searchResults"
            :key="order.orderId"
            :order-data="order"
          />
        </div>
        
        <!-- 搜索空状态 -->
        <div class="search-empty" v-else-if="hasSearched">
          <van-empty description="未找到相关订单" />
        </div>
      </div>
    </van-popup>

    <!-- 加载状态 -->
    <van-loading 
      v-if="loading" 
      type="spinner" 
      color="#1989fa"
      class="loading-overlay"
    >
      加载中...
    </van-loading>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { showToast, showSuccessToast } from 'vant';
import useOrderStore from '@/stores/modules/order';
import useHomeStore from '@/stores/modules/home';
import OrderTabs from './cpns/order-tabs.vue';
import OrderItem from './cpns/order-item.vue';

// 获取订单store
const orderStore = useOrderStore();
const { orderList, loading, refreshing, statusCounts } = storeToRefs(orderStore);

// 响应式数据
const showMoreActions = ref(false);
const showSearchPopup = ref(false);
const searchKeyword = ref('');
const searchResults = ref([]);
const hasSearched = ref(false);

/**
 * 计算订单总数
 */
const orderCount = computed(() => orderList.value.length);

/**
 * 更多操作选项
 */
const moreActions = [
  { 
    name: 'refresh', 
    text: '刷新订单',
    icon: 'replay'
  },
  { 
    name: 'regenerate', 
    text: '重新生成订单',
    icon: 'refresh'
  },
  { 
    name: 'clear', 
    text: '清空已取消订单',
    icon: 'delete-o'
  },
  { 
    name: 'export', 
    text: '导出订单',
    icon: 'share-o'
  }
];

/**
 * 处理搜索按钮点击
 */
const handleSearch = () => {
  showSearchPopup.value = true;
  searchKeyword.value = '';
  searchResults.value = [];
  hasSearched.value = false;
};

/**
 * 执行搜索
 */
const performSearch = () => {
  if (!searchKeyword.value.trim()) {
    showToast('请输入搜索关键词');
    return;
  }

  hasSearched.value = true;
  const keyword = searchKeyword.value.toLowerCase().trim();
  
  // 在订单列表中搜索
  searchResults.value = orderList.value.filter(order => {
    return (
      order.orderId.toLowerCase().includes(keyword) ||
      order.houseInfo?.houseName?.toLowerCase().includes(keyword) ||
      order.houseInfo?.location?.toLowerCase().includes(keyword)
    );
  });

  if (searchResults.value.length === 0) {
    showToast('未找到相关订单');
  }
};

/**
 * 处理下拉刷新
 */
const handleRefresh = async () => {
  try {
    await orderStore.refreshOrders();
    showSuccessToast('刷新成功');
  } catch (error) {
    showToast('刷新失败，请重试');
  }
};

/**
 * 处理更多操作
 * @param {Object} action - 操作项
 */
const handleMoreAction = (action) => {
  showMoreActions.value = false;
  
  switch (action.name) {
    case 'refresh':
      handleRefresh();
      break;
    case 'regenerate':
      handleRegenerateOrders();
      break;
    case 'clear':
      handleClearCancelledOrders();
      break;
    case 'export':
      handleExportOrders();
      break;
    default:
      break;
  }
};

/**
 * 清空已取消的订单
 */
const handleClearCancelledOrders = () => {
  const cancelledCount = statusCounts.value.cancelled || 0;
  
  if (cancelledCount === 0) {
    showToast('没有已取消的订单');
    return;
  }

  // 这里可以添加确认对话框
  // 暂时直接清空
  orderStore.orderList = orderStore.orderList.filter(
    order => order.status !== 'cancelled'
  );
  orderStore.saveOrdersToLocal();
  
  showSuccessToast(`已清空 ${cancelledCount} 个已取消订单`);
};

/**
 * 重新生成订单数据
 */
const handleRegenerateOrders = async () => {
  try {
    // 清空现有订单
    orderStore.clearAllOrders();
    
    // 确保houselist数据是最新的
    const homeStore = useHomeStore();
    await homeStore.fetchHouselistData();
    
    // 重新生成订单
    orderStore.initMockOrders();
    
    showSuccessToast('订单已重新生成');
  } catch (error) {
    showToast('重新生成订单失败');
    console.error('重新生成订单失败:', error);
  }
};

/**
 * 导出订单数据
 */
const handleExportOrders = () => {
  if (orderCount.value === 0) {
    showToast('没有订单可导出');
    return;
  }

  // 这里可以实现导出功能
  // 暂时只显示提示
  showToast('导出功能开发中...');
};

/**
 * 页面初始化
 */
onMounted(async () => {
  // 从本地存储加载订单数据
  orderStore.loadOrdersFromLocal();
  
  // 如果没有订单数据，初始化模拟数据（用于演示）
  if (orderStore.orderList.length === 0) {
    // 确保houselist数据已加载
    const homeStore = useHomeStore();
    if (homeStore.houselist.length === 0) {
      console.log('正在加载房源数据...');
      await homeStore.fetchHouselistData();
    }
    
    // 初始化订单数据
    orderStore.initMockOrders();
  }
});
</script>

<style lang="less" scoped>
.order {
  min-height: 100vh;
  background-color: #f5f5f5;

  // 导航栏样式
  .nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 46px;
    padding: 0 16px;
    background: #fff;
    border-bottom: 1px solid #f2f2f2;
    position: sticky;
    top: 0;
    z-index: 100;
    
    .title {
      color: #2b0bc9;
      font-size: 16px;
      font-weight: 600;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 16px;

      .search-icon,
      .more-icon {
        color: #666;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }
    }
  }

  // 订单统计信息
  .order-stats {
    display: flex;
    background: #fff;
    margin: 8px 16px;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    .stats-item {
      flex: 1;
      text-align: center;
      position: relative;

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 24px;
        background: #f0f0f0;
      }

      .stats-number {
        font-size: 20px;
        font-weight: 600;
        color: #1890ff;
        margin-bottom: 4px;
      }

      .stats-label {
        font-size: 12px;
        color: #666;
      }
    }
  }

  // 订单内容区域
  .order-content {
    .pull-refresh {
      min-height: calc(100vh - 140px);
    }
  }

  // 搜索容器
  .search-container {
    height: 100%;
    background: #f5f5f5;

    .search-header {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: #fff;
      border-bottom: 1px solid #f2f2f2;
      gap: 12px;

      .search-field {
        flex: 1;
        
        :deep(.van-field__control) {
          background: #f5f5f5;
          border-radius: 20px;
          padding: 8px 16px;
          border: none;
        }
      }
    }

    .search-results {
      padding: 16px;
    }

    .search-empty {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
    }
  }

  // 加载遮罩
  .loading-overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }
}

// 响应式设计
@media (max-width: 375px) {
  .order {
    .nav-bar {
      padding: 0 12px;
      
      .title {
        font-size: 15px;
      }

      .nav-actions {
        gap: 12px;
      }
    }

    .order-stats {
      margin: 6px 12px;
      padding: 12px;

      .stats-item {
        .stats-number {
          font-size: 18px;
        }

        .stats-label {
          font-size: 11px;
        }
      }
    }
  }
}
</style>
