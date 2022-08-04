import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

const r: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home as any },
  { path: '/about', name: 'About', component: About as any },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: r,
})

export default router
