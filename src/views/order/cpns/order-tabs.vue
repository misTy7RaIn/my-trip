<template>
  <div class="order-tabs">
    <!-- 标签页导航 -->
    <van-tabs 
      v-model:active="activeTab" 
      @change="handleTabChange"
      swipeable
      sticky
      offset-top="46"
      class="tabs-container"
      :lazy-render="true"
    >
      <!-- 全部订单标签 -->
      <van-tab 
        :name="ORDER_STATUS.ALL" 
        :title="getTabTitle(ORDER_STATUS.ALL)"
      >
        <div class="tab-content">
          <!-- 订单列表 -->
          <div v-if="allOrders.length > 0" class="order-list">
            <OrderItem
              v-for="order in allOrders"
              :key="order.orderId"
              :order-data="order"
              @pay="handlePay"
              @cancel="handleCancel"
              @complete="handleComplete"
              @delete="handleDelete"
              @contact="handleContact"
              @review="handleReview"
              @reorder="handleReorder"
            />
          </div>
          
          <!-- 空状态 -->
          <OrderEmpty 
            v-else 
            :status="ORDER_STATUS.ALL" 
          />
        </div>
      </van-tab>

      <!-- 待支付标签 -->
      <van-tab 
        :name="ORDER_STATUS.PENDING" 
        :title="getTabTitle(ORDER_STATUS.PENDING)"
      >
        <div class="tab-content">
          <div v-if="pendingOrders.length > 0" class="order-list">
            <OrderItem
              v-for="order in pendingOrders"
              :key="order.orderId"
              :order-data="order"
              @pay="handlePay"
              @cancel="handleCancel"
            />
          </div>
          <OrderEmpty 
            v-else 
            :status="ORDER_STATUS.PENDING" 
          />
        </div>
      </van-tab>

      <!-- 已支付标签 -->
      <van-tab 
        :name="ORDER_STATUS.PAID" 
        :title="getTabTitle(ORDER_STATUS.PAID)"
      >
        <div class="tab-content">
          <div v-if="paidOrders.length > 0" class="order-list">
            <OrderItem
              v-for="order in paidOrders"
              :key="order.orderId"
              :order-data="order"
              @complete="handleComplete"
              @contact="handleContact"
            />
          </div>
          <OrderEmpty 
            v-else 
            :status="ORDER_STATUS.PAID" 
          />
        </div>
      </van-tab>

      <!-- 已完成标签 -->
      <van-tab 
        :name="ORDER_STATUS.COMPLETED" 
        :title="getTabTitle(ORDER_STATUS.COMPLETED)"
      >
        <div class="tab-content">
          <div v-if="completedOrders.length > 0" class="order-list">
            <OrderItem
              v-for="order in completedOrders"
              :key="order.orderId"
              :order-data="order"
              @review="handleReview"
              @reorder="handleReorder"
            />
          </div>
          <OrderEmpty 
            v-else 
            :status="ORDER_STATUS.COMPLETED" 
          />
        </div>
      </van-tab>

      <!-- 已取消标签 -->
      <van-tab 
        :name="ORDER_STATUS.CANCELLED" 
        :title="getTabTitle(ORDER_STATUS.CANCELLED)"
      >
        <div class="tab-content">
          <div v-if="cancelledOrders.length > 0" class="order-list">
            <OrderItem
              v-for="order in cancelledOrders"
              :key="order.orderId"
              :order-data="order"
              @delete="handleDelete"
              @reorder="handleReorder"
            />
          </div>
          <OrderEmpty 
            v-else 
            :status="ORDER_STATUS.CANCELLED" 
          />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import useOrderStore, { ORDER_STATUS } from '@/stores/modules/order';
import OrderItem from './order-item.vue';
import OrderEmpty from './order-empty.vue';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

// 从store获取数据
const { orderList, currentTab, statusCounts } = storeToRefs(orderStore);

// 当前激活的标签
const activeTab = ref(ORDER_STATUS.ALL);

/**
 * 计算各状态的订单列表
 */
const allOrders = computed(() => orderList.value);

const pendingOrders = computed(() => 
  orderList.value.filter(order => order.status === ORDER_STATUS.PENDING)
);

const paidOrders = computed(() => 
  orderList.value.filter(order => order.status === ORDER_STATUS.PAID)
);

const completedOrders = computed(() => 
  orderList.value.filter(order => order.status === ORDER_STATUS.COMPLETED)
);

const cancelledOrders = computed(() => 
  orderList.value.filter(order => order.status === ORDER_STATUS.CANCELLED)
);

/**
 * 获取标签标题（包含数量）
 * @param {string} status - 订单状态
 * @returns {string} 标签标题
 */
const getTabTitle = (status) => {
  const titles = {
    [ORDER_STATUS.ALL]: '全部',
    [ORDER_STATUS.PENDING]: '待支付',
    [ORDER_STATUS.PAID]: '已支付', 
    [ORDER_STATUS.COMPLETED]: '已完成',
    [ORDER_STATUS.CANCELLED]: '已取消'
  };
  
  const count = statusCounts.value[status] || 0;
  const title = titles[status] || '未知';
  
  // 如果有数量且不是全部标签，显示数量
  if (count > 0 && status !== ORDER_STATUS.ALL) {
    return `${title}(${count})`;
  }
  
  return title;
};

/**
 * 处理标签切换
 * @param {string} name - 标签名称
 */
const handleTabChange = (name) => {
  orderStore.setCurrentTab(name);
  
  // 更新URL参数但不刷新页面
  const query = { ...route.query };
  if (name === ORDER_STATUS.ALL) {
    delete query.tab;
  } else {
    query.tab = name;
  }
  
  router.replace({ 
    path: route.path, 
    query 
  });

  // 修复无障碍性问题：管理非活动标签页的焦点
  manageFocusForInactiveTabs();
};

/**
 * 管理非活动标签页的焦点，避免aria-hidden警告
 */
const manageFocusForInactiveTabs = () => {
  // 使用nextTick确保DOM更新完成
  nextTick(() => {
    // 查找所有非活动的标签页面板
    const inactivePanels = document.querySelectorAll('.van-tab__panel-wrapper--inactive');
    
    inactivePanels.forEach(panel => {
      // 查找面板内所有可聚焦的元素
      const focusableElements = panel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      // 将所有可聚焦元素的tabindex设置为-1
      focusableElements.forEach(element => {
        element.setAttribute('data-original-tabindex', element.getAttribute('tabindex') || '0');
        element.setAttribute('tabindex', '-1');
      });
    });

    // 恢复活动标签页的焦点能力
    const activePanels = document.querySelectorAll('.van-tab__panel-wrapper--active');
    
    activePanels.forEach(panel => {
      const focusableElements = panel.querySelectorAll('[data-original-tabindex]');
      
      focusableElements.forEach(element => {
        const originalTabindex = element.getAttribute('data-original-tabindex');
        if (originalTabindex === '0') {
          element.removeAttribute('tabindex');
        } else {
          element.setAttribute('tabindex', originalTabindex);
        }
        element.removeAttribute('data-original-tabindex');
      });
    });
  });
};

/**
 * 处理支付订单
 * @param {string} orderId - 订单ID
 */
const handlePay = (orderId) => {
  orderStore.payOrder(orderId);
};

/**
 * 处理取消订单
 * @param {string} orderId - 订单ID
 */
const handleCancel = (orderId) => {
  orderStore.cancelOrder(orderId);
};

/**
 * 处理完成订单
 * @param {string} orderId - 订单ID
 */
const handleComplete = (orderId) => {
  orderStore.completeOrder(orderId);
};

/**
 * 处理删除订单
 * @param {string} orderId - 订单ID
 */
const handleDelete = (orderId) => {
  orderStore.deleteOrder(orderId);
};

/**
 * 处理联系房东
 * @param {Object} orderData - 订单数据
 */
const handleContact = (orderData) => {
  // 这里可以实现联系房东的逻辑
  console.log('联系房东:', orderData);
};

/**
 * 处理评价房源
 * @param {Object} orderData - 订单数据
 */
const handleReview = (orderData) => {
  // 这里可以跳转到评价页面
  console.log('评价房源:', orderData);
};

/**
 * 处理重新预订
 * @param {Object} houseInfo - 房源信息
 */
const handleReorder = (houseInfo) => {
  // 这里可以跳转到房源详情页
  console.log('重新预订:', houseInfo);
};

/**
 * 初始化标签状态
 */
const initTabFromQuery = () => {
  const tabFromQuery = route.query.tab;
  if (tabFromQuery && Object.values(ORDER_STATUS).includes(tabFromQuery)) {
    activeTab.value = tabFromQuery;
    orderStore.setCurrentTab(tabFromQuery);
  } else {
    activeTab.value = ORDER_STATUS.ALL;
    orderStore.setCurrentTab(ORDER_STATUS.ALL);
  }
};

// 监听路由查询参数变化
watch(() => route.query.tab, (newTab) => {
  if (newTab && Object.values(ORDER_STATUS).includes(newTab)) {
    activeTab.value = newTab;
    orderStore.setCurrentTab(newTab);
  } else {
    activeTab.value = ORDER_STATUS.ALL;
    orderStore.setCurrentTab(ORDER_STATUS.ALL);
  }
});

// 组件挂载时初始化
onMounted(() => {
  initTabFromQuery();
  
  // 初始化时也管理焦点，避免无障碍性问题
  nextTick(() => {
    manageFocusForInactiveTabs();
  });
});
</script>

<style lang="less" scoped>
.order-tabs {
  .tabs-container {
    :deep(.van-tabs__wrap) {
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    :deep(.van-tabs__nav) {
      padding: 0 16px;
    }

    :deep(.van-tab) {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
      
      &.van-tab--active {
        color: #1890ff;
      }
    }

    :deep(.van-tabs__line) {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      height: 3px;
      border-radius: 2px;
    }

    // 修复无障碍性问题：确保隐藏的标签页内容不可聚焦
    :deep(.van-tab__panel-wrapper--inactive) {
      // 隐藏非活动标签页的交互能力
      pointer-events: none;
      
      // 移除焦点样式
      * {
        &:focus,
        &:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
      }
    }

    // 活动标签页恢复正常交互
    :deep(.van-tab__panel-wrapper--active) {
      pointer-events: auto;
    }
  }

  .tab-content {
    min-height: calc(100vh - 140px);
    background: #f5f5f5;

    .order-list {
      padding: 16px;
    }
  }
}

// 响应式设计
@media (max-width: 375px) {
  .order-tabs {
    .tabs-container {
      :deep(.van-tab) {
        font-size: 13px;
      }
    }

    .tab-content .order-list {
      padding: 12px;
    }
  }
}
</style>
