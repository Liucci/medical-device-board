import {
         StockAreaType,
         StockAreaDBType,
         CreateStockAreaType,
         UpdateStockAreaType
       } from "../types/stockTypes"

export const normalizeStockArea = (s: StockAreaDBType): StockAreaType => ({
                                                                            id: s.id,
                                                                            hospitalId: s.hospital_id,
                                                                            name: s.name,
                                                                            createdAt: s.created_at
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