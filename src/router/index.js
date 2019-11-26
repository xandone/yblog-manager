import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import artAdd from '../pages/artAdd.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'home',
    component: Home,
    children: [{
        path: '/',
        name: 'artAdd',
        component: artAdd,
    }, ]
}]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router