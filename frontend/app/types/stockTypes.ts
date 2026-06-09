// Frontend標準型
export type StockAreaType = {
                              id: number
                              hospitalId: string
                              name: string
                              createdAt?: string | null
                            }

// Backend Response型
export type StockAreaDBType = {
                                id: number
                                hospital_id: string
                                name: string
                                created_at?: string | null
                              }

// Create専用
export type CreateStockAreaType = {
                                    name: string
                                  }

// Update専用
export type UpdateStockAreaType = {
                                    id: number
                                    name: string
                                  }

// Delete専用
export type DeleteStockAreasType = {
                                     ids: number[]
                                   }