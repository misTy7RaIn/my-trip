import { defineStore } from "pinia";
import useHomeStore from "./home";

/**
 * 订单状态枚举
 */
export const ORDER_STATUS = {
  ALL: 'all',           // 全部订单
  PENDING: 'pending',   // 待支付
  PAID: 'paid',         // 已支付
  COMPLETED: 'completed', // 已完成
  CANCELLED: 'cancelled'  // 已取消
};

/**
 * 订单状态中文映射
 */
export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: '待支付',
  [ORDER_STATUS.PAID]: '已支付',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消'
};

/**
 * 订单管理Store
 */
const useOrderStore = defineStore("order", {
  state: () => ({
    // 订单列表
    orderList: [],
    // 当前选中的订单状态标签
    currentTab: ORDER_STATUS.ALL,
    // 加载状态
    loading: false,
    // 是否正在刷新
    refreshing: false
  }),
  
  getters: {
    /**
     * 获取订单总数
     */
    orderCount: (state) => state.orderList.length,
    
    /**
     * 根据状态筛选订单
     */
    filteredOrders: (state) => {
      if (state.currentTab === ORDER_STATUS.ALL) {
        return state.orderList;
      }
      return state.orderList.filter(order => order.status === state.currentTab);
    },
    
    /**
     * 获取各状态订单数量
     */
    statusCounts: (state) => {
      const counts = {
        [ORDER_STATUS.ALL]: state.orderList.length,
        [ORDER_STATUS.PENDING]: 0,
        [ORDER_STATUS.PAID]: 0,
        [ORDER_STATUS.COMPLETED]: 0,
        [ORDER_STATUS.CANCELLED]: 0
      };
      
      state.orderList.forEach(order => {
        if (counts[order.status] !== undefined) {
          counts[order.status]++;
        }
      });
      
      return counts;
    },
    
    /**
     * 检查是否有指定状态的订单
     */
    hasOrdersInStatus: (state) => {
      return (status) => {
        if (status === ORDER_STATUS.ALL) {
          return state.orderList.length > 0;
        }
        return state.orderList.some(order => order.status === status);
      };
    }
  },
  
  actions: {
    /**
     * 设置当前选中的标签
     * @param {string} tab - 标签状态
     */
    setCurrentTab(tab) {
      this.currentTab = tab;
    },
    
    /**
     * 创建新订单
     * @param {Object} orderData - 订单数据
     */
    createOrder(orderData) {
      const newOrder = {
        orderId: this.generateOrderId(),
        ...orderData,
        status: ORDER_STATUS.PENDING,
        createTime: new Date().toISOString(),
        payTime: null
      };
      
      this.orderList.unshift(newOrder); // 新订单放在最前面
      this.saveOrdersToLocal();
      return newOrder;
    },
    
    /**
     * 更新订单状态
     * @param {string} orderId - 订单ID
     * @param {string} status - 新状态
     */
    updateOrderStatus(orderId, status) {
      const order = this.orderList.find(item => item.orderId === orderId);
      if (order) {
        order.status = status;
        
        // 如果是支付操作，记录支付时间
        if (status === ORDER_STATUS.PAID) {
          order.payTime = new Date().toISOString();
        }
        
        this.saveOrdersToLocal();
      }
    },
    
    /**
     * 删除订单
     * @param {string} orderId - 订单ID
     */
    deleteOrder(orderId) {
      const index = this.orderList.findIndex(item => item.orderId === orderId);
      if (index !== -1) {
        this.orderList.splice(index, 1);
        this.saveOrdersToLocal();
      }
    },
    
    /**
     * 取消订单
     * @param {string} orderId - 订单ID
     */
    cancelOrder(orderId) {
      this.updateOrderStatus(orderId, ORDER_STATUS.CANCELLED);
    },
    
    /**
     * 支付订单
     * @param {string} orderId - 订单ID
     */
    payOrder(orderId) {
      this.updateOrderStatus(orderId, ORDER_STATUS.PAID);
    },
    
    /**
     * 完成订单
     * @param {string} orderId - 订单ID
     */
    completeOrder(orderId) {
      this.updateOrderStatus(orderId, ORDER_STATUS.COMPLETED);
    },
    
    /**
     * 清空所有订单
     */
    clearAllOrders() {
      this.orderList = [];
      this.saveOrdersToLocal();
    },
    
    /**
     * 生成订单ID
     * @returns {string} 订单ID
     */
    generateOrderId() {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `ORDER${timestamp}${random}`;
    },
    
    /**
     * 保存订单到本地存储
     */
    saveOrdersToLocal() {
      try {
        localStorage.setItem('my-trip-orders', JSON.stringify(this.orderList));
      } catch (error) {
        console.error('保存订单数据失败:', error);
      }
    },
    
    /**
     * 从本地存储加载订单
     */
    loadOrdersFromLocal() {
      try {
        const orderData = localStorage.getItem('my-trip-orders');
        if (orderData) {
          this.orderList = JSON.parse(orderData);
        }
      } catch (error) {
        console.error('加载订单数据失败:', error);
        this.orderList = [];
      }
    },
    
    /**
     * 刷新订单列表
     */
    async refreshOrders() {
      this.refreshing = true;
      
      try {
        // 模拟网络请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 重新加载本地数据
        this.loadOrdersFromLocal();
        
        // 这里可以添加从服务器获取订单的逻辑
        // const orders = await getOrderList();
        // this.orderList = orders;
        
      } catch (error) {
        console.error('刷新订单失败:', error);
      } finally {
        this.refreshing = false;
      }
    },
    
    /**
     * 初始化模拟订单数据（用于演示）
     * 房源信息来源于houselist
     */
    initMockOrders() {
      if (this.orderList.length === 0) {
        // 获取homeStore中的houselist数据
        const homeStore = useHomeStore();
        const houselist = homeStore.houselist;
        
        // 如果houselist为空，使用默认房源数据
        if (!houselist || houselist.length === 0) {
          console.warn('Houselist为空，使用默认房源数据');
          this.createDefaultOrders();
          return;
        }

        // 从houselist中选择房源创建订单
        const selectedHouses = this.selectRandomHouses(houselist, 3);
        const mockOrders = this.createOrdersFromHouses(selectedHouses);
        
        this.orderList = mockOrders;
        this.saveOrdersToLocal();
      }
    },

    /**
     * 从houselist中随机选择房源
     * @param {Array} houselist - 房源列表
     * @param {number} count - 选择数量
     * @returns {Array} 选中的房源数据
     */
    selectRandomHouses(houselist, count) {
      const availableHouses = houselist.filter(item => item.data && item.data.houseId);
      const selectedHouses = [];
      
      for (let i = 0; i < Math.min(count, availableHouses.length); i++) {
        const randomIndex = Math.floor(Math.random() * availableHouses.length);
        const selectedHouse = availableHouses.splice(randomIndex, 1)[0];
        selectedHouses.push(selectedHouse.data);
      }
      
      return selectedHouses;
    },

    /**
     * 根据房源数据创建订单
     * @param {Array} houses - 房源数据数组
     * @returns {Array} 订单数据数组
     */
    createOrdersFromHouses(houses) {
      const orderTemplates = [
        {
          status: ORDER_STATUS.PENDING,
          checkInDate: '2024-01-15',
          checkOutDate: '2024-01-18',
          nights: 3,
          createTime: '2024-01-10T10:30:00.000Z',
          payTime: null,
          guestInfo: {
            name: '张三',
            phone: '138****8888',
            guestCount: 2
          }
        },
        {
          status: ORDER_STATUS.PAID,
          checkInDate: '2024-01-08',
          checkOutDate: '2024-01-10',
          nights: 2,
          createTime: '2024-01-05T14:20:00.000Z',
          payTime: '2024-01-05T14:25:00.000Z',
          guestInfo: {
            name: '李四',
            phone: '139****9999',
            guestCount: 4
          }
        },
        {
          status: ORDER_STATUS.COMPLETED,
          checkInDate: '2023-12-20',
          checkOutDate: '2023-12-23',
          nights: 3,
          createTime: '2023-12-15T09:15:00.000Z',
          payTime: '2023-12-15T09:20:00.000Z',
          guestInfo: {
            name: '王五',
            phone: '137****7777',
            guestCount: 2
          }
        }
      ];

      return houses.map((house, index) => {
        const template = orderTemplates[index] || orderTemplates[0];
        const totalPrice = house.finalPrice * template.nights;
        
        return {
          orderId: this.generateOrderId(),
          houseInfo: {
            houseId: house.houseId,
            houseName: house.houseName,
            image: house.image,
            location: house.location,
            finalPrice: house.finalPrice,
            productPrice: house.productPrice,
            summaryText: house.summaryText,
            priceTipBadge: house.priceTipBadge
          },
          checkInDate: template.checkInDate,
          checkOutDate: template.checkOutDate,
          nights: template.nights,
          totalPrice: totalPrice,
          status: template.status,
          createTime: template.createTime,
          payTime: template.payTime,
          guestInfo: template.guestInfo
        };
      });
    },

    /**
     * 创建默认订单数据（当houselist为空时使用）
     */
    createDefaultOrders() {
      const mockOrders = [
        {
          orderId: 'ORDER1698765432001',
          houseInfo: {
            houseId: 'house_001',
            houseName: '【网红民宿】三亚海棠湾豪华海景房',
            image: { url: 'https://pic.tujia.com/upload/house/day_210315/thumb_1_201503151058074692.jpg' },
            location: '三亚·海棠湾',
            finalPrice: 588,
            productPrice: 688,
            summaryText: '豪华海景房，设施齐全，交通便利'
          },
          checkInDate: '2024-01-15',
          checkOutDate: '2024-01-18',
          nights: 3,
          totalPrice: 1764,
          status: ORDER_STATUS.PENDING,
          createTime: '2024-01-10T10:30:00.000Z',
          payTime: null,
          guestInfo: {
            name: '张三',
            phone: '138****8888',
            guestCount: 2
          }
        },
        {
          orderId: 'ORDER1698765432002',
          houseInfo: {
            houseId: 'house_002',
            houseName: '【温泉度假】北京怀柔山景别墅',
            image: { url: 'https://pic.tujia.com/upload/house/day_210315/thumb_1_201503151058074692.jpg' },
            location: '北京·怀柔',
            finalPrice: 388,
            productPrice: 488,
            summaryText: '山景别墅，温泉度假，环境优美'
          },
          checkInDate: '2024-01-08',
          checkOutDate: '2024-01-10',
          nights: 2,
          totalPrice: 776,
          status: ORDER_STATUS.PAID,
          createTime: '2024-01-05T14:20:00.000Z',
          payTime: '2024-01-05T14:25:00.000Z',
          guestInfo: {
            name: '李四',
            phone: '139****9999',
            guestCount: 4
          }
        },
        {
          orderId: 'ORDER1698765432003',
          houseInfo: {
            houseId: 'house_003',
            houseName: '【古城民宿】丽江古城特色客栈',
            image: { url: 'https://pic.tujia.com/upload/house/day_210315/thumb_1_201503151058074692.jpg' },
            location: '丽江·古城区',
            finalPrice: 268,
            productPrice: 328,
            summaryText: '古城特色客栈，文化底蕴深厚'
          },
          checkInDate: '2023-12-20',
          checkOutDate: '2023-12-23',
          nights: 3,
          totalPrice: 804,
          status: ORDER_STATUS.COMPLETED,
          createTime: '2023-12-15T09:15:00.000Z',
          payTime: '2023-12-15T09:20:00.000Z',
          guestInfo: {
            name: '王五',
            phone: '137****7777',
            guestCount: 2
          }
        }
      ];
      
      this.orderList = mockOrders;
      this.saveOrdersToLocal();
    }
  }
});

export default useOrderStore;
