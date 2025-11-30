<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="p-4">
      <OrderFilter />
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Выбор
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              ID
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Город отправки
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Город доставки
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Статус
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Дата
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Вес (кг)
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="order in orderStore.filteredOrders"
            :key="order.id"
            :class="{ 'bg-blue-50': isSelected(order.id) }"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-4 py-3" @click.stop>
              <input
                type="checkbox"
                :checked="isSelected(order.id)"
                @change="toggleSelection(order.id)"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </td>
            <td class="px-4 py-3 text-sm text-black">{{ order.id }}</td>
            <td class="px-4 py-3 text-sm text-black">{{ order.sender_city }}</td>
            <td class="px-4 py-3 text-sm text-black">{{ order.receiver_city }}</td>
            <td class="px-4 py-3 text-sm">
              <span
                :class="{
                  'bg-green-100 text-green-800': order.status === 'Новый',
                  'bg-yellow-100 text-yellow-800': order.status === 'В пути',
                  'bg-blue-100 text-blue-800': order.status === 'Доставлен'
                }"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ order.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-black">{{ formatDate(order.date) }}</td>
            <td class="px-4 py-3 text-sm text-black">{{ order.weight }}</td>
            <td class="px-4 py-3">
              <button
                @click.stop="openEditModal(order)"
                class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                title="Редактировать"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="orderStore.filteredOrders.length === 0" class="text-center py-8 text-black">
        Заказы не найдены
      </div>
    </div>

    <OrderEditModal
      :is-open="isModalOpen"
      :order="selectedOrder"
      @close="closeEditModal"
      @saved="closeEditModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useOrderStore } from '@/entities/order'
import type { Order } from '@/entities/order'
import { OrderFilter } from '@/features/order-filter'
import { OrderEditModal } from '@/features/order-edit'

const orderStore = useOrderStore()
const isModalOpen = ref(false)
const selectedOrder = ref<Order | null>(null)

function isSelected(orderId: number): boolean {
  return orderStore.selectedOrderIds.includes(orderId)
}

function toggleSelection(orderId: number) {
  orderStore.toggleOrderSelection(orderId)
}

function openEditModal(order: Order) {
  selectedOrder.value = order
  isModalOpen.value = true
}

function closeEditModal() {
  isModalOpen.value = false
  selectedOrder.value = null
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}
</script>
