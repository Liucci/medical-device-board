import {RealtimePostgresChangesPayload} from "@supabase/supabase-js"
import {supabase} from "../lib/supabase"
import {normalizeDevice} from "../utils/deviceMapper"
import {DeviceDB} from "../types/deviceTypes"

type Props={
  setDeviceList:React.Dispatch<React.SetStateAction<any[]>>
}

export function subscribeDevicesRealtime({
                                            setDeviceList
                                          }:Props){
  console.log("subscribeDevicesRealtime")
  const channel=supabase
    .channel("devices")
    .on(
      "postgres_changes",
      {
        event:"*",
        schema:"public",
        table:"devices"
      },
      (payload:RealtimePostgresChangesPayload<DeviceDB>)=>{

        switch(payload.eventType){

          case "INSERT":
            handleInsert(payload,setDeviceList)
            break

          case "UPDATE":
            handleUpdate(payload,setDeviceList)
            break

          case "DELETE":
            handleDelete(payload,setDeviceList)
            break

        }

      }
    )
    .subscribe()

  return()=>{supabase.removeChannel(channel)}

}

function handleInsert(
  payload:RealtimePostgresChangesPayload<DeviceDB>,
  setDeviceList:React.Dispatch<React.SetStateAction<any[]>>
){
  const device=normalizeDevice(payload.new as DeviceDB)
  setDeviceList(prev=>[...prev,device])
}

function handleUpdate(
  payload:RealtimePostgresChangesPayload<DeviceDB>,
  setDeviceList:React.Dispatch<React.SetStateAction<any[]>>
){
  const device=normalizeDevice(payload.new as DeviceDB)
  setDeviceList(prev=>prev.map(d=>d.id===device.id?device:d))
}

function handleDelete(
  payload:RealtimePostgresChangesPayload<DeviceDB>,
  setDeviceList:React.Dispatch<React.SetStateAction<any[]>>
){
const id=(payload.old as DeviceDB).id
setDeviceList(prev=>prev.filter(d=>d.id!==id))
}