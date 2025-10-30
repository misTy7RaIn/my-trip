<template>
  <div class="order-empty">
    <!-- 空状态图标 -->
    <div class="empty-image">
      <img :src="emptyIcon" alt="暂无订单" />
    </div>
    
    <!-- 空状态文本 -->
    <div class="empty-text">
      <h3>{{ emptyTitle }}</h3>
      <p>{{ emptyDescription }}</p>
    </div>
    
    <!-- 操作按钮 -->
    <div class="empty-actions" v-if="showAction">
      <van-button 
        type="primary" 
        size="large" 
        round 
        @click="handleAction"
        class="action-btn"
      >
        {{ actionText }}
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ORDER_STATUS } from '@/stores/modules/order';

// 定义组件属性
const props = defineProps({
  // 当前订单状态
  status: {
    type: String,
    default: ORDER_STATUS.ALL
  },
  // 是否显示操作按钮
  showAction: {
    type: Boolean,
    default: true
  }
});

const router = useRouter();

/**
 * 根据不同状态显示不同的空状态内容
 */
const emptyConfig = computed(() => {
  const configs = {
    [ORDER_STATUS.ALL]: {
      icon: '/src/assets/img/order/icon-order.png',
      title: '还没有任何订单',
      description: '快去首页预订心仪的房源吧~',
      actionText: '去首页看看'
    },
    [ORDER_STATUS.PENDING]: {
      icon: '/src/assets/img/order/icon-time.png',
      title: '暂无待支付订单',
      description: '所有订单都已处理完成',
      actionText: '去预订房源'
    },
    [ORDER_STATUS.PAID]: {
      icon: '/src/assets/img/order/icon-order.png',
      title: '暂无已支付订单',
      description: '快去完成待支付的订单吧',
      actionText: '查看待支付'
    },
    [ORDER_STATUS.COMPLETED]: {
      icon: '/src/assets/img/order/icon_right_orderlist.png',
      title: '暂无已完成订单',
      description: '完成的订单会在这里显示',
      actionText: '去首页看看'
    },
    [ORDER_STATUS.CANCELLED]: {
      icon: '/src/assets/img/order/icon-order.png',
      title: '暂无已取消订单',
      description: '取消的订单会在这里显示',
      actionText: '去首页看看'
    }
  };
  
  return configs[props.status] || configs[ORDER_STATUS.ALL];
});

// 空状态图标
const emptyIcon = computed(() => emptyConfig.value.icon);

// 空状态标题
const emptyTitle = computed(() => emptyConfig.value.title);

// 空状态描述
const emptyDescription = computed(() => emptyConfig.value.description);

// 操作按钮文本
const actionText = computed(() => emptyConfig.value.actionText);

/**
 * 处理操作按钮点击
 */
const handleAction = () => {
  switch (props.status) {
    case ORDER_STATUS.PAID:
      // 跳转到待支付标签
      router.push('/order?tab=pending');
      break;
    case ORDER_STATUS.PENDING:
    case ORDER_STATUS.COMPLETED:
    case ORDER_STATUS.CANCELLED:
    case ORDER_STATUS.ALL:
    default:
      // 跳转到首页
      router.push('/home');
      break;
  }
};
</script>

<style lang="less" scoped>
.order-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px 60px;
  text-align: center;
  min-height: 400px;

  .empty-image {
    margin-bottom: 32px;
    
    img {
      width: 120px;
      height: 120px;
      opacity: 0.6;
      filter: grayscale(20%);
    }
  }

  .empty-text {
    margin-bottom: 40px;
    max-width: 280px;

    h3 {
      font-size: 18px;
      color: #333;
      margin-bottom: 12px;
      font-weight: 500;
      line-height: 1.4;
    }

    p {
      font-size: 14px;
      color: #999;
      line-height: 1.6;
      margin: 0;
    }
  }

  .empty-actions {
    .action-btn {
      width: 200px;
      height: 44px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      font-size: 16px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

// 响应式设计
@media (max-width: 375px) {
  .order-empty {
    padding: 60px 16px 40px;
    min-height: 350px;

    .empty-image img {
      width: 100px;
      height: 100px;
    }

    .empty-text {
      margin-bottom: 32px;

      h3 {
        font-size: 16px;
      }

      p {
        font-size: 13px;
      }
    }

    .empty-actions .action-btn {
      width: 180px;
      height: 40px;
      font-size: 15px;
    }
  }
}
</style>
