import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { normalizeMaintenanceType } from "../utils/maintenanceTypeMapper"
import { MaintenanceTypeDB } from "../types/maintenanceTypeTypes"

type Props = {
  setMaintenanceTypes: React.Dispatch<React.SetStateAction<any[]>>
}

export function subscribeMaintenanceTypesRealtime({
  setMaintenanceTypes
}: Props) {

  console.log("subscribeMaintenanceTypesRealtime")

  const channel = supabase
    .channel("maintenance_types")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "maintenance_types"
      },
      (payload: RealtimePostgresChangesPayload<MaintenanceTypeDB>) => {
        console.log("MaintenanceTypeRealtime", payload.eventType, payload)
        switch (payload.eventType) {

          case "INSERT":
            handleInsert(payload, setMaintenanceTypes)
            break

          case "UPDATE":
            handleUpdate(payload, setMaintenanceTypes)
            break

          case "DELETE":
            handleDelete(payload, setMaintenanceTypes)
            break

        }

      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }

}

function handleInsert(
  payload: RealtimePostgresChangesPayload<MaintenanceTypeDB>,
  setMaintenanceTypes: React.Dispatch<React.SetStateAction<any[]>>
) {

  const maintenanceType = normalizeMaintenanceType(payload.new as MaintenanceTypeDB)

  setMaintenanceTypes(prev => [...prev, maintenanceType])

}

function handleUpdate(
  payload: RealtimePostgresChangesPayload<MaintenanceTypeDB>,
  setMaintenanceTypes: React.Dispatch<React.SetStateAction<any[]>>
) {

  const maintenanceType = normalizeMaintenanceType(payload.new as MaintenanceTypeDB)

  setMaintenanceTypes(prev => prev.map(m => m.id === maintenanceType.id ? maintenanceType : m))

}

function handleDelete(
  payload: RealtimePostgresChangesPayload<MaintenanceTypeDB>,
  setMaintenanceTypes: React.Dispatch<React.SetStateAction<any[]>>
) {

  const id = (payload.old as MaintenanceTypeDB).id

  setMaintenanceTypes(prev => prev.filter(m => m.id !== id))

}