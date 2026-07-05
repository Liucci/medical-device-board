import {RealtimePostgresChangesPayload} from "@supabase/supabase-js"
import {supabase} from "../lib/supabase"
import {normalizeDevice} from "../utils/deviceMapper"
import {DeviceDB} from "../types/deviceTypes"

type Props={
  setDeviceList:React.Dispatch<React.SetStateAction<any[]>>
  setStockLastUpdated?: React.Dispatch<React.SetStateAction<string | null>>
  setWardLastUpdated?: React.Dispatch<React.SetStateAction<string | null>>
}

export function subscribeDevicesRealtime({
                                            setDeviceList,
                                            setStockLastUpdated,
                                            setWardLastUpdated
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
            handleInsert(payload,
                          setDeviceList,
                          setStockLastUpdated,
                          setWardLastUpdated
                        )
            break

          case "UPDATE":
            handleInsert(payload,
                          setDeviceList,
                          setStockLastUpdated,
                          setWardLastUpdated
                        )
            break

          case "DELETE":
            handleInsert(payload,
                          setDeviceList,
                          setStockLastUpdated,
                          setWardLastUpdated
                        )
            break

        }

      }
    )
    .subscribe()

  return()=>{supabase.removeChannel(channel)}

}

function handleInsert(
            payload:RealtimePostgresChangesPayload<DeviceDB>,
            setDeviceList:React.Dispatch<React.SetStateAction<any[]>>,
            setStockLastUpdated?: React.Dispatch<React.SetStateAction<string | null>>,
            setWardLastUpdated?: React.Dispatch<React.SetStateAction<string | null>>
            )
{
  const device=normalizeDevice(payload.new as DeviceDB)
  //同じidのdeviceをinsertしないために、同じidが存在したらreturn
  setDeviceList(prev => {
    if (prev.some(d => d.id === device.id)) {
      return prev
    }
    return [...prev, device]
  })
  const updatedAt = device.updateAt ?? null
  setStockLastUpdated?.(updatedAt)
  setWardLastUpdated?.(updatedAt)
}

function handleUpdate(
                      payload:RealtimePostgresChangesPayload<DeviceDB>,
                      setDeviceList:React.Dispatch<React.SetStateAction<any[]>>,
                      setStockLastUpdated?: React.Dispatch<React.SetStateAction<string | null>>,
                      setWardLastUpdated?: React.Dispatch<React.SetStateAction<string | null>>
                    )
{
  const device=normalizeDevice(payload.new as DeviceDB)
  setDeviceList(prev=>prev.map(d=>d.id===device.id?device:d))

  const updatedAt = device.updateAt ?? null
  setStockLastUpdated?.(updatedAt)
  setWardLastUpdated?.(updatedAt)
  }

function handleDelete(
                      payload:RealtimePostgresChangesPayload<DeviceDB>,
                      setDeviceList:React.Dispatch<React.SetStateAction<any[]>>,
                      )
{
const id=(payload.old as DeviceDB).id
setDeviceList(prev=>prev.filter(d=>d.id!==id))
}