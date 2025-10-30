<template>
  <div class="order-item">
    <div class="item-inner">
      <!-- 订单头部信息 -->
      <div class="order-header">
        <div class="order-info">
          <span class="order-id">订单号: {{ orderData.orderId }}</span>
          <span class="order-time">{{ formatCreateTime(orderData.createTime) }}</span>
        </div>
        <div class="order-status" :class="`status-${orderData.status}`">
          {{ getStatusText(orderData.status) }}
        </div>
      </div>

      <!-- 房源信息 -->
      <div class="house-info">
        <div class="house-cover">
          <img src="@/assets/img/order/sanya.jpg" alt="房源图片" />
        </div>
        
        <div class="house-details">
          <div class="house-name">{{ orderData.houseInfo?.houseName }}</div>
          <div class="house-location">
            <img src="@/assets/img/home/location.png" alt="位置" />
            <span>{{ orderData.houseInfo?.location }}</span>
          </div>
          <div class="stay-info">
            <span class="dates">{{ formatDateRange(orderData.checkInDate, orderData.checkOutDate) }}</span>
            <span class="nights">共{{ orderData.nights }}晚</span>
          </div>
        </div>
      </div>

      <!-- 客人信息 -->
      <div class="guest-info">
        <div class="guest-item">
          <span class="label">入住人:</span>
          <span class="value">{{ orderData.guestInfo?.name }}</span>
        </div>
        <div class="guest-item">
          <span class="label">联系电话:</span>
          <span class="value">{{ orderData.guestInfo?.phone }}</span>
        </div>
        <div class="guest-item">
          <span class="label">入住人数:</span>
          <span class="value">{{ orderData.guestInfo?.guestCount }}人</span>
        </div>
      </div>

      <!-- 价格信息 -->
      <div class="price-info">
        <div class="price-breakdown">
          <div class="price-item">
            <span class="label">房费 ({{ orderData.nights }}晚):</span>
            <span class="value">¥{{ orderData.houseInfo?.finalPrice * orderData.nights }}</span>
          </div>
          <div class="price-item total">
            <span class="label">总计:</span>
            <span class="value">¥{{ orderData.totalPrice }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="order-actions">
        <!-- 待支付状态的操作 -->
        <template v-if="orderData.status === ORDER_STATUS.PENDING">
          <van-button 
            size="small" 
            plain 
            @click="handleCancel"
            class="action-btn cancel-btn"
          >
            取消订单
          </van-button>
          <van-button 
            type="primary" 
            size="small" 
            @click="handlePay"
            :loading="payLoading"
            class="action-btn pay-btn"
          >
            {{ payLoading ? '支付中...' : '立即支付' }}
          </van-button>
        </template>

        <!-- 已支付状态的操作 -->
        <template v-else-if="orderData.status === ORDER_STATUS.PAID">
          <van-button 
            size="small" 
            plain 
            @click="handleContact"
            class="action-btn"
          >
            联系房东
          </van-button>
          <van-button 
            type="primary" 
            size="small" 
            @click="handleComplete"
            class="action-btn"
          >
            确认入住
          </van-button>
        </template>

        <!-- 已完成状态的操作 -->
        <template v-else-if="orderData.status === ORDER_STATUS.COMPLETED">
          <van-button 
            size="small" 
            plain 
            @click="handleReorder"
            class="action-btn"
          >
            再次预订
          </van-button>
          <van-button 
            type="primary" 
            size="small" 
            @click="handleReview"
            class="action-btn"
          >
            评价房源
          </van-button>
        </template>

        <!-- 已取消状态的操作 -->
        <template v-else-if="orderData.status === ORDER_STATUS.CANCELLED">
          <van-button 
            size="small" 
            plain 
            @click="handleDelete"
            class="action-btn delete-btn"
          >
            删除订单
          </van-button>
          <van-button 
            type="primary" 
            size="small" 
            @click="handleReorder"
            class="action-btn"
          >
            重新预订
          </van-button>
        </template>
      </div>
    </div>

    <!-- 支付确认对话框 -->
    <van-dialog
      v-model:show="showPayDialog"
      title="确认支付"
      :message="`确认支付 ¥${orderData.totalPrice} 吗？`"
      show-cancel-button
      @confirm="confirmPay"
      :confirm-button-loading="payLoading"
    />

    <!-- 取消订单对话框 -->
    <van-dialog
      v-model:show="showCancelDialog"
      title="取消订单"
      message="确定要取消这个订单吗？取消后不可恢复。"
      show-cancel-button
      @confirm="confirmCancel"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { showToast, showSuccessToast } from 'vant';
import dayjs from 'dayjs';
import { ORDER_STATUS, ORDER_STATUS_TEXT } from '@/stores/modules/order';
import { mockPayment } from '@/services';

// 定义组件属性
const props = defineProps({
  orderData: {
    type: Object,
    required: true
  }
});

// 定义事件
const emit = defineEmits(['pay', 'cancel', 'complete', 'delete', 'contact', 'review', 'reorder']);

// 响应式数据
const showPayDialog = ref(false);
const showCancelDialog = ref(false);
const payLoading = ref(false);

/**
 * 获取订单状态文本
 * @param {string} status - 订单状态
 * @returns {string} 状态文本
 */
const getStatusText = (status) => {
  return ORDER_STATUS_TEXT[status] || '未知状态';
};

/**
 * 格式化创建时间
 * @param {string} createTime - 创建时间
 * @returns {string} 格式化后的时间
 */
const formatCreateTime = (createTime) => {
  return dayjs(createTime).format('YYYY-MM-DD HH:mm');
};

/**
 * 格式化日期范围
 * @param {string} checkIn - 入住日期
 * @param {string} checkOut - 退房日期
 * @returns {string} 格式化后的日期范围
 */
const formatDateRange = (checkIn, checkOut) => {
  const checkInDate = dayjs(checkIn).format('MM月DD日');
  const checkOutDate = dayjs(checkOut).format('MM月DD日');
  return `${checkInDate} - ${checkOutDate}`;
};

/**
 * 处理支付操作
 */
const handlePay = () => {
  showPayDialog.value = true;
};

/**
 * 确认支付
 */
const confirmPay = async () => {
  payLoading.value = true;
  
  try {
    // 调用模拟支付接口
    await mockPayment(props.orderData.orderId, props.orderData.totalPrice);
    
    showSuccessToast('支付成功！');
    emit('pay', props.orderData.orderId);
    
  } catch (error) {
    showToast(error.message || '支付失败，请重试');
  } finally {
    payLoading.value = false;
    showPayDialog.value = false;
  }
};

/**
 * 处理取消订单
 */
const handleCancel = () => {
  showCancelDialog.value = true;
};

/**
 * 确认取消订单
 */
const confirmCancel = () => {
  emit('cancel', props.orderData.orderId);
  showCancelDialog.value = false;
  showSuccessToast('订单已取消');
};

/**
 * 处理确认入住
 */
const handleComplete = () => {
  emit('complete', props.orderData.orderId);
  showSuccessToast('已确认入住');
};

/**
 * 处理删除订单
 */
const handleDelete = () => {
  emit('delete', props.orderData.orderId);
  showSuccessToast('订单已删除');
};

/**
 * 处理联系房东
 */
const handleContact = () => {
  showToast('正在为您接通房东...');
  emit('contact', props.orderData);
};

/**
 * 处理评价房源
 */
const handleReview = () => {
  showToast('跳转到评价页面');
  emit('review', props.orderData);
};

/**
 * 处理重新预订
 */
const handleReorder = () => {
  showToast('跳转到房源详情页');
  emit('reorder', props.orderData.houseInfo);
};
</script>

<style lang="less" scoped>
.order-item {
  margin-bottom: 12px;

  .item-inner {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
  }

  // 订单头部
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 16px 12px;
    border-bottom: 1px solid #f5f5f5;

    .order-info {
      flex: 1;

      .order-id {
        display: block;
        font-size: 14px;
        color: #333;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .order-time {
        font-size: 12px;
        color: #999;
      }
    }

    .order-status {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;

      &.status-pending {
        background: #fff7e6;
        color: #fa8c16;
      }

      &.status-paid {
        background: #e6f7ff;
        color: #1890ff;
      }

      &.status-completed {
        background: #f6ffed;
        color: #52c41a;
      }

      &.status-cancelled {
        background: #fff1f0;
        color: #ff4d4f;
      }
    }
  }

  // 房源信息
  .house-info {
    display: flex;
    padding: 16px;
    border-bottom: 1px solid #f5f5f5;

    .house-cover {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      margin-right: 12px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .house-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .house-name {
        font-size: 15px;
        font-weight: 500;
        color: #333;
        line-height: 1.4;
        margin-bottom: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .house-location {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

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

      .stay-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .dates {
          font-size: 13px;
          color: #333;
          font-weight: 500;
        }

        .nights {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }

  // 客人信息
  .guest-info {
    padding: 12px 16px;
    background: #fafafa;
    border-bottom: 1px solid #f5f5f5;

    .guest-item {
      display: flex;
      align-items: center;
      margin-bottom: 6px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        font-size: 12px;
        color: #666;
        width: 60px;
        flex-shrink: 0;
      }

      .value {
        font-size: 12px;
        color: #333;
      }
    }
  }

  // 价格信息
  .price-info {
    padding: 12px 16px;
    border-bottom: 1px solid #f5f5f5;

    .price-breakdown {
      .price-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          font-size: 12px;
          color: #666;
        }

        .value {
          font-size: 12px;
          color: #333;
        }

        &.total {
          padding-top: 6px;
          border-top: 1px solid #f0f0f0;
          margin-top: 6px;

          .label {
            font-weight: 500;
            color: #333;
          }

          .value {
            font-size: 16px;
            font-weight: 600;
            color: #ff6b35;
          }
        }
      }
    }
  }

  // 操作按钮
  .order-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    padding: 16px;

    .action-btn {
      height: 32px;
      font-size: 13px;
      border-radius: 16px;
      min-width: 80px;

      &.cancel-btn {
        color: #ff4d4f;
        border-color: #ff4d4f;

        &:hover {
          background: #fff1f0;
        }
      }

      &.pay-btn {
        background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
        border: none;
      }

      &.delete-btn {
        color: #999;
        border-color: #d9d9d9;
      }
    }
  }
}

// 响应式设计
@media (max-width: 375px) {
  .order-item {
    .house-info {
      .house-cover {
        width: 70px;
        height: 70px;
      }

      .house-details .house-name {
        font-size: 14px;
      }
    }

    .order-actions {
      .action-btn {
        min-width: 70px;
        font-size: 12px;
      }
    }
  }
}
</style>
