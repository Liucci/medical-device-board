// Frontend標準型
export type StockAreaType = {
                              id: number
                              hospitalId: string
                              name: string
                              displayOrder: number
                            }

// Backend Response型
export type StockAreaDBType = {
                                id: number
                                hospital_id: string
                                name: string
                                display_order: number
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

export type UpdateStockAreaOrderType = {
                                        id: number
                                        displayOrder: number
                                      }

export type UpdateStockAreaOrdersType = {
                                          stockAreas: UpdateStockAreaOrderType[]
                                        }