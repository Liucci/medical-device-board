import {RealtimePostgresChangesPayload} from "@supabase/supabase-js"
import {supabase} from "../lib/supabase"

type InspectionRealtime={
    device_id:number
}

type Props={
    setInspectionCounts:React.Dispatch<React.SetStateAction<Record<number,number>>>
}

export function subscribeInspectionsRealtime({
    setInspectionCounts
}:Props){
    console.log("subscribeInspectionsRealtime")

    const channel=supabase
        .channel("inspections")
        .on(
            "postgres_changes",
            {
                event:"*",
                schema:"public",
                table:"inspections"
            },
            (payload:RealtimePostgresChangesPayload<InspectionRealtime>)=>{
                console.log("InspectionRealtime",payload.eventType,payload)

                if(payload.eventType!=="INSERT") return

                const inspection=payload.new as InspectionRealtime
                const deviceId=inspection.device_id

                setInspectionCounts(prev=>({
                    ...prev,
                    [deviceId]:(prev[deviceId]??0)+1
                }))
            }
        )
        .subscribe((status)=>{
            console.log("Inspections status:",status)
        })

    return()=>{supabase.removeChannel(channel)}
}