import {
         StockAreaType,
         StockAreaDBType,
         CreateStockAreaType,
         UpdateStockAreaType,
         UpdateStockAreaOrderType,
         UpdateStockAreaOrdersType
       } from "../types/stockTypes"

export const normalizeStockArea = (s: StockAreaDBType): StockAreaType => ({
                                                                            id: s.id,
                                                                            hospitalId: s.hospital_id,
                                                                            name: s.name,
                                                                            displayOrder: s.display_order,
                                                                          })

export const toCreateStockAreaRequest = (s: CreateStockAreaType) => ({
                                                                        name: s.name
                                                                      })

export const toUpdateStockAreaRequest = (s: UpdateStockAreaType) => ({
                                                                        id: s.id,
                                                                        name: s.name
                                                                      })

export const toDeleteStockAreasRequest = (ids: number[]) => ({
                                                                ids
                                                              })


//並び順編集用
export const toUpdateStockAreaOrdersRequest = (
                                              stockAreas: UpdateStockAreaOrdersType
                                            ) => ({
                                                  stock_areas: stockAreas.stockAreas.map((stockArea) => ({
                                                                                                            id: stockArea.id,
                                                                                                            display_order: stockArea.displayOrder,
                                                                                                          })),
                                                })