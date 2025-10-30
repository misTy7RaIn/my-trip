import hyRequest from "../request";

/**
 * 获取订单列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.status - 订单状态
 * @returns {Promise} 订单列表数据
 */
export function getOrderList(params = {}) {
  return hyRequest.get({
    url: "/order/list",
    params: {
      page: 1,
      pageSize: 20,
      ...params
    }
  });
}

/**
 * 获取订单详情
 * @param {string} orderId - 订单ID
 * @returns {Promise} 订单详情数据
 */
export function getOrderDetail(orderId) {
  return hyRequest.get({
    url: `/order/detail/${orderId}`
  });
}

/**
 * 创建订单
 * @param {Object} orderData - 订单数据
 * @param {Object} orderData.houseInfo - 房源信息
 * @param {string} orderData.checkInDate - 入住日期
 * @param {string} orderData.checkOutDate - 退房日期
 * @param {Object} orderData.guestInfo - 客人信息
 * @returns {Promise} 创建结果
 */
export function createOrder(orderData) {
  return hyRequest.post({
    url: "/order/create",
    data: orderData
  });
}

/**
 * 支付订单
 * @param {string} orderId - 订单ID
 * @param {Object} paymentData - 支付数据
 * @param {string} paymentData.paymentMethod - 支付方式
 * @param {number} paymentData.amount - 支付金额
 * @returns {Promise} 支付结果
 */
export function payOrder(orderId, paymentData) {
  return hyRequest.post({
    url: `/order/pay/${orderId}`,
    data: paymentData
  });
}

/**
 * 取消订单
 * @param {string} orderId - 订单ID
 * @param {string} reason - 取消原因
 * @returns {Promise} 取消结果
 */
export function cancelOrder(orderId, reason = '') {
  return hyRequest.post({
    url: `/order/cancel/${orderId}`,
    data: { reason }
  });
}

/**
 * 删除订单
 * @param {string} orderId - 订单ID
 * @returns {Promise} 删除结果
 */
export function deleteOrder(orderId) {
  return hyRequest.post({
    url: `/order/delete/${orderId}`
  });
}

/**
 * 完成订单
 * @param {string} orderId - 订单ID
 * @returns {Promise} 完成结果
 */
export function completeOrder(orderId) {
  return hyRequest.post({
    url: `/order/complete/${orderId}`
  });
}

/**
 * 获取订单统计信息
 * @returns {Promise} 统计数据
 */
export function getOrderStatistics() {
  return hyRequest.get({
    url: "/order/statistics"
  });
}

/**
 * 搜索订单
 * @param {Object} searchParams - 搜索参数
 * @param {string} searchParams.keyword - 搜索关键词
 * @param {string} searchParams.startDate - 开始日期
 * @param {string} searchParams.endDate - 结束日期
 * @param {string} searchParams.status - 订单状态
 * @returns {Promise} 搜索结果
 */
export function searchOrders(searchParams) {
  return hyRequest.get({
    url: "/order/search",
    params: searchParams
  });
}

/**
 * 模拟支付处理（用于演示）
 * @param {string} orderId - 订单ID
 * @param {number} amount - 支付金额
 * @returns {Promise} 模拟支付结果
 */
export function mockPayment(orderId, amount) {
  return new Promise((resolve, reject) => {
    // 模拟支付处理时间
    setTimeout(() => {
      // 90% 成功率的模拟支付
      if (Math.random() > 0.1) {
        resolve({
          success: true,
          message: '支付成功',
          data: {
            orderId,
            amount,
            paymentId: `PAY${Date.now()}`,
            paymentTime: new Date().toISOString()
          }
        });
      } else {
        reject({
          success: false,
          message: '支付失败，请重试',
          code: 'PAYMENT_FAILED'
        });
      }
    }, 2000); // 模拟2秒支付处理时间
  });
}
