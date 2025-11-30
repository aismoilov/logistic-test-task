import { createRouter, createWebHistory } from 'vue-router'
import { OrdersPage } from '@/pages/orders'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'orders',
      component: OrdersPage,
    },
  ],
})

export default router
