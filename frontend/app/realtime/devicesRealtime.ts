import {RealtimePostgresChangesPayload} from "@supabase/supabase-js"
import {supabase} from "../lib/supabase"
import {normalizeDevice} from "../utils/deviceMapper"
import {DeviceDB} from "../types/deviceTypes"
import {
  StockLastUpdatedResponse,
  WardLastUpdatedResponse
} from "../types/deviceTypes"
type Props={
  setDeviceList:React.Dispatch<React.SetStateAction<any[]>>
  setStockLastUpdated?: React.Dispatch<React.SetStateAction<StockLastUpdatedResponse>>
  setWardLastUpdated?: React.Dispatch<React.SetStateAction<WardLastUpdatedResponse>>}

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
        console.log("DeviceRealtime", payload.eventType, payload)

        switch(payload.eventType){

          case "INSERT":
            handleInsert(payload,
                          setDeviceList,
                          setStockLastUpdated,
                          setWardLastUpdated
                        )
            break

          case "UPDATE":
            handleUpdate(payload,
                          setDeviceList,
                          setStockLastUpdated,
                          setWardLastUpdated
                        )
            break

          case "DELETE":
            handleDelete(
                          payload,
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
            setStockLastUpdated?: React.Dispatch<React.SetStateAction<StockLastUpdatedResponse>>,
            setWardLastUpdated?: React.Dispatch<React.SetStateAction<WardLastUpdatedResponse>>            
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
  setStockLastUpdated?.({updatedAt: device.updateAt ?? null})
  setWardLastUpdated?.({updatedAt: device.updateAt ?? null})
}

function handleUpdate(
                      payload:RealtimePostgresChangesPayload<DeviceDB>,
                      setDeviceList:React.Dispatch<React.SetStateAction<any[]>>,
                      setStockLastUpdated?: React.Dispatch<React.SetStateAction<StockLastUpdatedResponse>>,
                      setWardLastUpdated?: React.Dispatch<React.SetStateAction<WardLastUpdatedResponse>>            
                    )
{
  const device=normalizeDevice(payload.new as DeviceDB)
  setDeviceList(prev=>prev.map(d=>d.id===device.id?device:d))

  setStockLastUpdated?.({updatedAt: device.updateAt ?? null})
  setWardLastUpdated?.({updatedAt: device.updateAt ?? null})
  }

function handleDelete(
                      payload:RealtimePostgresChangesPayload<DeviceDB>,
                      setDeviceList:React.Dispatch<React.SetStateAction<any[]>>,
                      setStockLastUpdated?: React.Dispatch<React.SetStateAction<StockLastUpdatedResponse>>,
                      setWardLastUpdated?: React.Dispatch<React.SetStateAction<WardLastUpdatedResponse>>            
                      )
{
//oldDeviceはidのみ持つ
 const oldDevice = payload.old as DeviceDB
  console.log("oldDevice:",oldDevice)

  setDeviceList(prev => {
      const deleted = prev.find(d => d.id === oldDevice.id)
      if (deleted) {
          const now = new Date().toISOString()

          if (deleted.status === "stock") {
              setStockLastUpdated?.({ updatedAt: now })
          } else {
              setWardLastUpdated?.({ updatedAt: now })
          }
      }

      return prev.filter(d => d.id !== oldDevice.id)
  }
  )
}