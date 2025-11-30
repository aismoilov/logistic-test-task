export const MAP_CONFIG = {
  styleUrl: import.meta.env.VITE_MAP_STYLE_URL,
  center: {
    lng: Number(import.meta.env.VITE_MAP_CENTER_LNG),
    lat: Number(import.meta.env.VITE_MAP_CENTER_LAT)
  },
  zoom: Number(import.meta.env.VITE_MAP_ZOOM)
}

export const MARKER_COLORS = {
  pickup: '#3b82f6',
  delivery: '#10b981'
}

export const ROUTE_CONFIG = {
  color: '#f59e0b',
  width: 3,
  opacity: 0.8
}
