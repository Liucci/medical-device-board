import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { normalizeDeviceType } from "../utils/deviceTypeMapper"
import { DeviceTypeDBType } from "../types/deviceTypeTypes"

type Props = {
  setDeviceTypes: React.Dispatch<React.SetStateAction<any[]>>
}

export function subscribeDeviceTypesRealtime({
  setDeviceTypes
}: Props) {

  console.log("subscribeDeviceTypesRealtime")

  const channel = supabase
    .channel("device_types")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "device_types"
      },
      (payload: RealtimePostgresChangesPayload<DeviceTypeDBType>) => {

        switch (payload.eventType) {

          case "INSERT":
            handleInsert(payload, setDeviceTypes)
            break

          case "UPDATE":
            handleUpdate(payload, setDeviceTypes)
            break

          case "DELETE":
            handleDelete(payload, setDeviceTypes)
            break

        }

      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }

}

function handleInsert(
  payload: RealtimePostgresChangesPayload<DeviceTypeDBType>,
  setDeviceTypes: React.Dispatch<React.SetStateAction<any[]>>
) {

  const deviceType = normalizeDeviceType(payload.new as DeviceTypeDBType)

    setDeviceTypes(prev => {
      if (prev.some(d => d.id === deviceType.id)) {
        return prev
      }
      return [...prev, deviceType]
    })
}

function handleUpdate(
  payload: RealtimePostgresChangesPayload<DeviceTypeDBType>,
  setDeviceTypes: React.Dispatch<React.SetStateAction<any[]>>
) {

  const deviceType = normalizeDeviceType(payload.new as DeviceTypeDBType)

  setDeviceTypes(prev => prev.map(d => d.id === deviceType.id ? deviceType : d))

}

function handleDelete(
  payload: RealtimePostgresChangesPayload<DeviceTypeDBType>,
  setDeviceTypes: React.Dispatch<React.SetStateAction<any[]>>
) {

  const id = (payload.old as DeviceTypeDBType).id

  setDeviceTypes(prev => prev.filter(d => d.id !== id))

}