export interface Coordinates {
  lat: number
  lng: number
}

export interface Order {
  id: number
  sender_city: string
  receiver_city: string
  pickup: Coordinates
  delivery: Coordinates
  status: OrderStatus
  date: string
  weight: number
}

export type OrderStatus = 'Новый' | 'В пути' | 'Доставлен'

export interface OrderFilters {
  status: OrderStatus | ''
  dateFrom: string
  dateTo: string
  city: string
}
