// Frontend標準型
export type WardType = {
                         id: number
                         hospitalId: string
                         name: string
                         displayOrder: number

                         status:string | null
                         note:string | null
                       }

// Backend Response型
export type WardDBType = {
                           id: number
                           hospital_id: string
                           name: string
                           display_order: number
                           status:string | null
                           note:string | null
                         }

// Create専用
export type CreateWardType = {
                               name: string
                             }

// Update専用
export type UpdateWardType = {
                               id: number
                               name: string
                             }

// Delete専用
export type DeleteWardsType = {
                                id: number
                              }


//並び順編集用
export type UpdateWardOrderType = {
                                    id: number
                                    displayOrder: number
                                  }

export type UpdateWardOrdersType = {
                                    wards: UpdateWardOrderType[]
                                  }

export type UpdateWardInfoType = {
  id: number
  status: string | null
  note: string | null
}