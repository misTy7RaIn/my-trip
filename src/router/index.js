import {
    createRouter,
    createWebHashHistory
} from "vue-router";
const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
            path: "/",
            redirect: "/home"
        },
        {
            path: "/home",
            component: () => import("@/views/home/home.vue")
        },
        {
            path: "/favor",
            component: () => import("@/views/favor/favor.vue")
        },
        {
            path: "/massage",
            component: () => import("@/views/massage/massage.vue")
        },
        {
            path: "/order",
            component: () => import("@/views/order/oder.vue")
        }
    ]

})

export default router