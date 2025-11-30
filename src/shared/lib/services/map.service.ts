import maplibregl from 'maplibre-gl'
import type { Order } from '@/entities/order'
import { MAP_CONFIG, MARKER_COLORS, ROUTE_CONFIG } from '../config/map.config'

export class MapService {
  private map: maplibregl.Map | null = null
  private markers: maplibregl.Marker[] = []
  private readonly routeLayerId = 'route'

  initialize(container: HTMLElement): void {
    this.map = new maplibregl.Map({
      container,
      style: MAP_CONFIG.styleUrl,
      center: [MAP_CONFIG.center.lng, MAP_CONFIG.center.lat],
      zoom: MAP_CONFIG.zoom,
      scrollZoom: false,
      doubleClickZoom: true,
      dragRotate: false,
      touchZoomRotate: false
    })

    this.map.addControl(new maplibregl.NavigationControl({
      showCompass: false,
      showZoom: true
    }), 'top-right')
  }

  onLoad(callback: () => void): void {
    if (!this.map) return
    this.map.on('load', callback)
  }

  clearMarkers(): void {
    this.markers.forEach((marker) => marker.remove())
    this.markers.length = 0
  }

  addOrderMarker(order: Order, type: 'pickup' | 'delivery'): maplibregl.Marker | null {
    if (!this.map) return null

    const coords = type === 'pickup' ? order.pickup : order.delivery
    const color = MARKER_COLORS[type]

    const el = this.createMarkerElement(color)
    const popup = this.createPopup(order, type)

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([coords.lng, coords.lat])
      .setPopup(popup)
      .addTo(this.map)

    this.markers.push(marker)
    return marker
  }

  private createMarkerElement(color: string): HTMLElement {
    const el = document.createElement('div')
    el.className = 'w-6 h-6 rounded-full cursor-pointer'
    el.style.backgroundColor = color
    el.style.border = '2px solid white'
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
    return el
  }

  private createPopup(order: Order, type: 'pickup' | 'delivery'): maplibregl.Popup {
    const city = type === 'pickup' ? order.sender_city : order.receiver_city
    return new maplibregl.Popup({ offset: 25 }).setHTML(
      `
      <div class="p-2">
        <p class="font-semibold text-gray-900">Заказ #${order.id}</p>
        <p class="text-sm text-gray-800">${city}</p>
        <p class="text-sm text-gray-600">${order.status}</p>
      </div>
      `
    )
  }

  drawRoutes(orders: Order[]): void {
    if (!this.map) return

    this.removeRoutes()

    if (orders.length === 0) return

    const features = orders.map((order) => ({
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: [
          [order.pickup.lng, order.pickup.lat],
          [order.delivery.lng, order.delivery.lat]
        ]
      }
    }))

    this.map.addSource(this.routeLayerId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: features
      }
    })

    this.map.addLayer({
      id: this.routeLayerId,
      type: 'line',
      source: this.routeLayerId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': ROUTE_CONFIG.color,
        'line-width': ROUTE_CONFIG.width,
        'line-opacity': ROUTE_CONFIG.opacity
      }
    })
  }

  private removeRoutes(): void {
    if (!this.map) return

    if (this.map.getLayer(this.routeLayerId)) {
      this.map.removeLayer(this.routeLayerId)
    }
    if (this.map.getSource(this.routeLayerId)) {
      this.map.removeSource(this.routeLayerId)
    }
  }

  destroy(): void {
    this.clearMarkers()
    this.removeRoutes()
    if (this.map) {
      this.map.remove()
      this.map = null
    }
  }
}
