// Frontend標準型
export type InfectionTypeType = {
                                  id: number
                                  hospitalId: string
                                  name: string
                                  color: string
                                }

// Backend Response型
export type InfectionTypeDBType = {
                                    id: number
                                    hospital_id: string
                                    name: string
                                    color: string
                                  }

// Create専用
export type CreateInfectionTypeType = {
                                        name: string
                                        color: string
                                      }

// Update専用
export type UpdateInfectionTypeType = {
                                        id: number
                                        name: string
                                        color: string
                                      }

// Delete専用
export type DeleteInfectionTypesType = {
                                        ids: number[]
                                      }