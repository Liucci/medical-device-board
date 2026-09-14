import {RealtimePostgresChangesPayload} from "@supabase/supabase-js"
import {supabase} from "../lib/supabase"
import{TodayInspectionFrontType} from "../types/inspectionTypes/inspectionTypes"

type InspectionRealtime={
    device_id:number
    created_at: string
}

type Props={
    setInspectionCounts:React.Dispatch<React.SetStateAction<Record<number,number>>>
      setTodayInspections: React.Dispatch<React.SetStateAction<TodayInspectionFrontType[]>>
}

export function subscribeInspectionsRealtime({
    setInspectionCounts,
    setTodayInspections
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
                       // 本日の点検履歴を更新
                setTodayInspections(prev => [
                ...prev,
                {
                    deviceId: inspection.device_id,
                    createdAt: inspection.created_at,
                },
                ])

            }
        )
        .subscribe((status)=>{
            console.log("Inspections status:",status)
        })

    return()=>{supabase.removeChannel(channel)}
}