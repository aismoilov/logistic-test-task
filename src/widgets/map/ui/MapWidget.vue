<template>
  <div ref="mapContainer" class="w-full h-[500px]"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useOrderStore } from '@/entities/order'
import { MapService } from '@/shared/lib'

const mapContainer = ref<HTMLElement | null>(null)
const orderStore = useOrderStore()
const mapService = new MapService()

onMounted(() => {
  if (!mapContainer.value) return

  mapService.initialize(mapContainer.value)
  mapService.onLoad(() => {
    renderMarkers()
  })
})

watch(
  () => orderStore.orders,
  () => {
    renderMarkers()
  },
  { deep: true }
)

watch(
  () => orderStore.selectedOrders,
  () => {
    mapService.drawRoutes(orderStore.selectedOrders)
  },
  { deep: true }
)

function renderMarkers() {
  mapService.clearMarkers()

  orderStore.orders.forEach((order) => {
    mapService.addOrderMarker(order, 'pickup')
    mapService.addOrderMarker(order, 'delivery')
  })
}

onUnmounted(() => {
  mapService.destroy()
})
</script>
