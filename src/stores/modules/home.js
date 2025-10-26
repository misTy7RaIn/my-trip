import { getHotSuggests, getCategories,getHouselist } from "@/services";
import { defineStore } from "pinia";

const useHomeStore = defineStore("home", {
state: () => ({
    hotSuggests: [],
    categories: [],
    currentPage : 1,
    houselist: []
    
}),
actions: {
    async fetchCategoriesData() {
        const res = await getCategories()
        this.categories = res.data
    },
    async fetchHotSuggestsData() {
        const res = await getHotSuggests()
        this.hotSuggests = res.data
    },
    async fetchHouselistData() {
        const res = await getHouselist(this.currentPage)
        this.houselist.push(...res.data)
        this.currentPage++
    }
}
})
export default useHomeStore