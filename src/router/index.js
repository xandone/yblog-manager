import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import artList from '../pages/artList.vue'
import artAdd from '../pages/artAdd.vue'
import essayList from '../pages/essayList.vue'
import essayAdd from '../pages/essayAdd.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'home',
    component: Home,
    children: [{
        path: '/artList',
        name: 'artList',
        component: artList,
        meta: ['文章管理', '文章列表'],
    }, {
        path: '/artAdd',
        name: 'artAdd',
        component: artAdd,
        meta: ['文章管理', '发布文章'],
    }, {
        path: '/essayList',
        name: 'essayList',
        component: essayList,
        meta: ['杂文管理', '杂文列表'],
    }, {
        path: '/essayAdd',
        name: 'essayAdd',
        component: essayAdd,
        meta: ['杂文管理', '发布杂文'],
    }]
}]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router