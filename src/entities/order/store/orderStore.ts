import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { http } from '@/shared/lib'
import type { Order, OrderFilters } from '../model/order'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const selectedOrderIds = ref<number[]>([])
  const filters = ref<OrderFilters>({
    status: '',
    dateFrom: '',
    dateTo: '',
    city: ''
  })
  const isLoading = ref(false)

  const filteredOrders = computed(() => {
    return orders.value.filter((order) => {
      if (filters.value.status && order.status !== filters.value.status) return false
      
      if (filters.value.dateFrom && order.date < filters.value.dateFrom) return false
      if (filters.value.dateTo && order.date > filters.value.dateTo) return false

      if (filters.value.city) {
        const searchTerm = filters.value.city.toLowerCase()
        const matchesSender = order.sender_city.toLowerCase().includes(searchTerm)
        const matchesReceiver = order.receiver_city.toLowerCase().includes(searchTerm)
        if (!matchesSender && !matchesReceiver) return false
      }

      return true
    })
  })

  const selectedOrders = computed(() => {
    return orders.value.filter((order) => selectedOrderIds.value.includes(order.id))
  })

  async function fetchOrders() {
    isLoading.value = true
    try {
      const data = await http.get<Order[]>('/mock/orders.json')
      orders.value = data
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      isLoading.value = false
    }
  }

  function toggleOrderSelection(orderId: number) {
    const index = selectedOrderIds.value.indexOf(orderId)
    if (index > -1) {
      selectedOrderIds.value.splice(index, 1)
    } else {
      if (selectedOrderIds.value.length >= 2) {
        selectedOrderIds.value.shift()
      }
      selectedOrderIds.value.push(orderId)
    }
  }

  function updateOrder(updatedOrder: Order) {
    const index = orders.value.findIndex((o) => o.id === updatedOrder.id)
    if (index !== -1) {
      orders.value[index] = updatedOrder
    }
  }

  function setFilters(newFilters: Partial<OrderFilters>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters() {
    filters.value = {
      status: '',
      dateFrom: '',
      dateTo: '',
      city: ''
    }
  }

  return {
    orders,
    selectedOrderIds,
    filters,
    isLoading,
    filteredOrders,
    selectedOrders,
    fetchOrders,
    toggleOrderSelection,
    updateOrder,
    setFilters,
    resetFilters
  }
})
