export type DeviceType = {
                          id: number
                          hospitalId: string
                          name: string
                          }

export type DeviceModel = {
                           id: number
                           hospitalId: string
                           deviceTypeId: number
                           name: string
                           }

export type DeviceTypeDB = {
                            id: number
                            hospital_id: string
                            name: string
                            }

export type DeviceModelDB = {
                             id: number
                             hospital_id: string
                             device_type_id: number
                             name: string
                             }