import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/HelloWorld.vue'
import Electric from '../components/ElectricBus.vue'
import New from "../components/NewBusMap.vue";
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/new',
    name: "new",
    component: New
  },
  {
    path: '/electric',
    name: 'Electric Buses',
    component: Electric
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
