import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

import { fetchActiveAnnouncementsTransaction } from "../api/transactions/announcements/fetchActiveAnnouncementsTransaction"

type Props = {
    hospitalId: string
    setAnnouncements: React.Dispatch<React.SetStateAction<any[]>>
}

export function subscribeAnnouncementsRealtime({
                                                hospitalId,                                                
                                                setAnnouncements
                                                }: Props)
{
    console.log("subscribeAnnouncementsRealtime")

    const channel = supabase
        .channel("announcements")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "announcements"
            },
            async (
                    payload: RealtimePostgresChangesPayload<any>
                ) => {

                console.log(
                                "AnnouncementRealtime",
                                payload.eventType,
                                payload
                            )

                await fetchActiveAnnouncementsTransaction({
                                                        hospitalId,
                                                        setAnnouncements
                                                    })

            }
        )
        .subscribe((status) => {
            console.log("Announcements status:", status)
        })
    return () => {
        supabase.removeChannel(channel)
    }

}