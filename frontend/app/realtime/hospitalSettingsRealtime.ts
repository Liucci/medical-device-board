import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { HospitalSettingsType } from "../types/hospitalSettingTypes"
import { fetchHospitalSettingsTransaction } from "../api/transactions/hospitalSettings/fetchHospitalSettingsTransaction"

type Props = {
  setHospitalSettings: React.Dispatch<React.SetStateAction<HospitalSettingsType | null>>
}

export function subscribeHospitalSettingsRealtime({setHospitalSettings}: Props) 
{
  console.log("subscribeHospitalSettingsRealtime")
  const channel = supabase
            .channel("hospital_settings")
            .on(
                "postgres_changes",
                    {
                    event: "*",
                    schema: "public",
                    table: "hospital_settings",
                    },
                async (
                    payload: RealtimePostgresChangesPayload<any>
                ) => {
                        console.log(
                                    "HospitalSettingsRealtime",
                                    payload.eventType,
                                    payload
                                    )
                await fetchHospitalSettingsTransaction({setHospitalSettings})
                }
            )
            .subscribe((status) => {
            console.log("HospitalSettings status:", status)
            })

  return () => {supabase.removeChannel(channel)}
}