<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-black mb-8">Управление логистическими маршрутами</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-4 overflow-hidden">
          <h2 class="text-xl font-semibold mb-4 text-black">Карта маршрутов</h2>
          <MapWidget />
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-xl font-semibold mb-4 text-black">Информация</h2>
          <div class="space-y-2 text-sm text-black">
            <p>Выберите до 2 заказов для построения маршрута</p>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded-full bg-blue-500"></div>
              <span>Точка погрузки</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded-full bg-green-500"></div>
              <span>Точка выгрузки</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-1 bg-yellow-500"></div>
              <span>Маршрут</span>
            </div>
          </div>
        </div>
      </div>

      <OrdersTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useOrderStore } from '@/entities/order'
import { MapWidget } from '@/widgets/map'
import { OrdersTable } from '@/widgets/orders-table'

const orderStore = useOrderStore()

onMounted(() => {
  orderStore.fetchOrders()
})
</script>
