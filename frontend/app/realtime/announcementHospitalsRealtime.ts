import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

import { fetchActiveAnnouncementsTransaction } from "../api/transactions/announcements/fetchActiveAnnouncementsTransaction"

type Props = {
    hospitalId: string
    setAnnouncements: React.Dispatch<React.SetStateAction<any[]>>
}

export function subscribeAnnouncementHospitalsRealtime({
                                                        hospitalId,                                                        
                                                        setAnnouncements
                                                        }: Props)
{
    console.log("subscribeAnnouncementHospitalsRealtime")

    const channel = supabase
        .channel("announcement_hospitals")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "announcement_hospitals"
            },
            async (
                    payload: RealtimePostgresChangesPayload<any>
                ) => {

                console.log(
                                "AnnouncementHospitalsRealtime",
                                payload.eventType,
                                payload
                            )

                await fetchActiveAnnouncementsTransaction({
                                                        hospitalId,
                                                        setAnnouncements
                                                    })

            }
        )
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }

}