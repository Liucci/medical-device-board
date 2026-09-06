import { CurrentUser } from "../types/session"

type CurrentUserResponse = {
                            id: string
                            hospital_id: string
                            hospital_name: string
                            //price_plan: string
                            role: string
                            email: string
                            display_name: string
}

export function mapCurrentUser(data: CurrentUserResponse): CurrentUser
{
  return {
            id: data.id,
            hospitalId: data.hospital_id,
            hospitalName: data.hospital_name,
            //pricePlan: data.price_plan,
            role: data.role,
            email: data.email,
            displayName: data.display_name,
  }
}