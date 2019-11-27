import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import jokeList from '../pages/jokeList.vue'
import artAdd from '../pages/artAdd.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'home',
    component: Home,
    children: [{
        path: '/jokeList',
        name: 'jokeList',
        component: jokeList,
        meta: ['段子管理', '段子列表'],
    }, {
        path: '/artAdd',
        name: 'artAdd',
        component: artAdd,
        meta: ['段子管理', '新增段子'],
    }]
}]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router