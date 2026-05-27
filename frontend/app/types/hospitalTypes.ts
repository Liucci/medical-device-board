export type Hospital = {
                         //Id: string
                         //idはuuidなのでUIでは明示しない
                         hospitalName: string
                         createdAt: string
                         isActive: boolean
                         updatedAt?: string
                         pricePlan?: string
                         }

export type HospitalDB = {
                           id: string
                           hospital_name: string
                           created_at: string
                           is_active: boolean
                           updated_at?: string
                           price_plan?: string
                           }