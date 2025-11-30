<template>
  <div class="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg shadow">
    <div class="flex-1 min-w-[200px]">
      <label class="block text-sm font-medium text-black mb-1">Статус</label>
      <select
        v-model="localFilters.status"
        @change="applyFilters"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      >
        <option value="">Все</option>
        <option value="Новый">Новый</option>
        <option value="В пути">В пути</option>
        <option value="Доставлен">Доставлен</option>
      </select>
    </div>

    <div class="flex-1 min-w-[200px]">
      <label class="block text-sm font-medium text-black mb-1">Дата от</label>
      <input
        v-model="localFilters.dateFrom"
        @input="applyFilters"
        type="date"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
    </div>

    <div class="flex-1 min-w-[200px]">
      <label class="block text-sm font-medium text-black mb-1">Дата до</label>
      <input
        v-model="localFilters.dateTo"
        @input="applyFilters"
        type="date"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
    </div>

    <div class="flex-1 min-w-[200px] relative">
      <label class="block text-sm font-medium text-black mb-1">Поиск по городу</label>
      <input
        v-model="localFilters.city"
        @input="applyCityFilter"
        type="text"
        placeholder="Введите название города"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
      <div v-if="isSearching" class="absolute right-3 top-9 animate-spin">
        <svg class="w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>

    <div class="flex items-end">
      <button
        @click="resetFilters"
        class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-md transition"
      >
        Сбросить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useOrderStore } from '@/entities/order'
import type { OrderFilters } from '@/entities/order'

const orderStore = useOrderStore()

const localFilters = ref<OrderFilters>({
  status: '',
  dateFrom: '',
  dateTo: '',
  city: ''
})

const isSearching = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function applyFilters() {
  orderStore.setFilters(localFilters.value)
}

function applyCityFilter() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  isSearching.value = true
  
  debounceTimer = setTimeout(() => {
    orderStore.setFilters(localFilters.value)
    isSearching.value = false
  }, 500)
}

function resetFilters() {
  localFilters.value = {
    status: '',
    dateFrom: '',
    dateTo: '',
    city: ''
  }
  orderStore.resetFilters()
}
</script>
