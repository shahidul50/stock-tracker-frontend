export type StockOutType = "Sell" | "Damage" | "Lost"

// Payload for bulk stock-out API
export interface StockOutItem {
  itemId: string
  quantity: number
  type: StockOutType
}

// Response for bulk stock-out API
export interface StockOutItemResponse {
  itemId: string
  quantity: number
  type: StockOutType
  _id: string
  createdAt: string,
  updatedAt: string
}

export interface CreateStockOutPayload {
  items: StockOutItem[]
}

export interface TodayStockOutCount {
  count: number
}
