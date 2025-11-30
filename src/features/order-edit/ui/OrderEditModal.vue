<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 class="text-xl font-bold mb-4 text-black">Редактирование заказа #{{ order?.id }}</h2>

        <form @submit.prevent="saveOrder">
          <div class="mb-4">
            <label class="block text-sm font-medium text-black mb-1">Статус</label>
            <select
              v-model="formData.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            >
              <option value="Новый">Новый</option>
              <option value="В пути">В пути</option>
              <option value="Доставлен">Доставлен</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-black mb-1">Дата</label>
            <input
              v-model="formData.date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-black mb-1">Вес (кг)</label>
            <input
              v-model.number="formData.weight"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-md transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useOrderStore } from '@/entities/order'
import type { Order, OrderStatus } from '@/entities/order'

interface Props {
  isOpen: boolean
  order: Order | null
}

interface Emits {
  (e: 'close'): void
  (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const orderStore = useOrderStore()

const formData = ref<{
  status: OrderStatus
  date: string
  weight: number
}>({
  status: 'Новый',
  date: '',
  weight: 0
})

watch(
  () => props.order,
  (newOrder) => {
    if (newOrder) {
      formData.value = {
        status: newOrder.status,
        date: newOrder.date,
        weight: newOrder.weight
      }
    }
  },
  { immediate: true }
)

function closeModal() {
  emit('close')
}

function saveOrder() {
  if (!props.order) return

  const updatedOrder: Order = {
    ...props.order,
    status: formData.value.status,
    date: formData.value.date,
    weight: formData.value.weight
  }

  orderStore.updateOrder(updatedOrder)
  showNotification()
  emit('saved')
  closeModal()
}

function showNotification() {
  const notification = document.createElement('div')
  notification.className =
    'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
  notification.textContent = 'Заказ успешно обновлен'
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}
</script>
