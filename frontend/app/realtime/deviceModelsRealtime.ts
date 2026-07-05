import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { normalizeDeviceModel } from "../utils/deviceModelMapper"
import { DeviceModelDBType } from "../types/deviceModelTypes"

type Props = {
  setDeviceModels: React.Dispatch<React.SetStateAction<any[]>>
}

export function subscribeDeviceModelsRealtime({
  setDeviceModels
}: Props) {

  console.log("subscribeDeviceModelsRealtime")

  const channel = supabase
    .channel("device_models")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "device_models"
      },
      (payload: RealtimePostgresChangesPayload<DeviceModelDBType>) => {

        switch (payload.eventType) {

          case "INSERT":
            handleInsert(payload, setDeviceModels)
            break

          case "UPDATE":
            handleUpdate(payload, setDeviceModels)
            break

          case "DELETE":
            handleDelete(payload, setDeviceModels)
            break

        }

      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }

}

function handleInsert(
  payload: RealtimePostgresChangesPayload<DeviceModelDBType>,
  setDeviceModels: React.Dispatch<React.SetStateAction<any[]>>
) {

  const deviceModel = normalizeDeviceModel(payload.new as DeviceModelDBType)

  setDeviceModels(prev => [...prev, deviceModel])

}

function handleUpdate(
  payload: RealtimePostgresChangesPayload<DeviceModelDBType>,
  setDeviceModels: React.Dispatch<React.SetStateAction<any[]>>
) {

  const deviceModel = normalizeDeviceModel(payload.new as DeviceModelDBType)

  setDeviceModels(prev => prev.map(d => d.id === deviceModel.id ? deviceModel : d))

}

function handleDelete(
  payload: RealtimePostgresChangesPayload<DeviceModelDBType>,
  setDeviceModels: React.Dispatch<React.SetStateAction<any[]>>
) {

  const id = (payload.old as DeviceModelDBType).id

  setDeviceModels(prev => prev.filter(d => d.id !== id))

}