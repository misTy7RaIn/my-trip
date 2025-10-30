import { defineStore } from "pinia";

const useFavorStore = defineStore("favor", {
  state: () => ({
    favorList: []
  }),
  
  getters: {
    favorCount: (state) => state.favorList.length,
    
    isFavorite: (state) => {
      return (houseId) => {
        return state.favorList.some(item => item.houseId === houseId);
      };
    }
  },
  
  actions: {
    // 添加收藏
    addToFavor(houseData) {
      // 检查是否已经收藏
      const isExist = this.favorList.some(item => item.houseId === houseData.houseId);
      if (!isExist) {
        this.favorList.push({
          ...houseData,
          favorTime: new Date().toISOString()
        });
        this.saveFavorToLocal();
      }
    },
    
    // 取消收藏
    removeFromFavor(houseId) {
      const index = this.favorList.findIndex(item => item.houseId === houseId);
      if (index !== -1) {
        this.favorList.splice(index, 1);
        this.saveFavorToLocal();
      }
    },
    
    // 切换收藏状态
    toggleFavor(houseData) {
      if (this.isFavorite(houseData.houseId)) {
        this.removeFromFavor(houseData.houseId);
      } else {
        this.addToFavor(houseData);
      }
    },
    
    // 清空收藏
    clearFavor() {
      this.favorList = [];
      this.saveFavorToLocal();
    },
    
    // 保存到本地存储
    saveFavorToLocal() {
      localStorage.setItem('my-trip-favor', JSON.stringify(this.favorList));
    },
    
    // 从本地存储加载
    loadFavorFromLocal() {
      const favorData = localStorage.getItem('my-trip-favor');
      if (favorData) {
        try {
          this.favorList = JSON.parse(favorData);
        } catch (error) {
          console.error('加载收藏数据失败:', error);
          this.favorList = [];
        }
      }
    }
  }
});

export default useFavorStore;
