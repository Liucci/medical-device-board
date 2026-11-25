// fetchのfrontend型
//normalize後
export type DeviceTypeType = {
                               id: number
                               hospitalId: string
                               name: string
                               iconColor: string
                               displayOrder: number
                             }

// fetchのBackend型
//normalize前
export type DeviceTypeDBType = {
                                 id: number
                                 hospital_id: string
                                 name: string
                                 icon_color: string
                                 display_order: number
                               }

// Create専用
//addまたはcreate系のbackへ送るときの型定義
//request
export type CreateDeviceTypeFrontType = {
                                     name: string
                                     iconColor: string
                                   }
export type CreateDeviceTypeBackType = {
                                     name: string
                                     icon_color: string
                                   }



// Update専用
export type UpdateDeviceTypeFrontType = {
                                     id: number
                                     name: string
                                     iconColor: string
                                   }
export type UpdateDeviceTypeBackType = {
                                     id: number
                                     name: string
                                     icon_color: string
                                   }



// Delete専用
export type DeleteDeviceTypeFrontType = {
                                     id: number
                                   }

export type DeleteDeviceTypeBackType = {
                                     id: number
                                   }

export type UpdateDeviceTypeOrderType = {
  id: number
  displayOrder: number
  iconColor: string
}

export type UpdateDeviceTypeOrdersType = {
  deviceTypes: UpdateDeviceTypeOrderType[]
}