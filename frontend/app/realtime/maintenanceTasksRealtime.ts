import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { normalizeMaintenanceTask } from "../utils/taskMapper"
import { MaintenanceTaskDB } from "../types/taskTypes"

type Props = {
  setTasks: React.Dispatch<React.SetStateAction<any[]>>
}

export function subscribeMaintenanceTasksRealtime({
  setTasks
}: Props) {

  console.log("subscribeMaintenanceTasksRealtime")

  const channel = supabase
    .channel("device_maintenance_tasks")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "device_maintenance_tasks"
      },
      (payload: RealtimePostgresChangesPayload<MaintenanceTaskDB>) => {

        switch (payload.eventType) {

          case "INSERT":
            handleInsert(payload, setTasks)
            break

          case "UPDATE":
            handleUpdate(payload, setTasks)
            break

          case "DELETE":
            handleDelete(payload, setTasks)
            break

        }

      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }

}

function handleInsert(
  payload: RealtimePostgresChangesPayload<MaintenanceTaskDB>,
  setTasks: React.Dispatch<React.SetStateAction<any[]>>
) {

  const maintenanceTask = normalizeMaintenanceTask(payload.new as MaintenanceTaskDB)

  setTasks(prev => [...prev, maintenanceTask])

}

function handleUpdate(
  payload: RealtimePostgresChangesPayload<MaintenanceTaskDB>,
  setTasks: React.Dispatch<React.SetStateAction<any[]>>
) {

  const maintenanceTask = normalizeMaintenanceTask(payload.new as MaintenanceTaskDB)

  setTasks(prev => prev.map(t => t.id === maintenanceTask.id ? maintenanceTask : t))

}

function handleDelete(
  payload: RealtimePostgresChangesPayload<MaintenanceTaskDB>,
  setTasks: React.Dispatch<React.SetStateAction<any[]>>
) {

  const id = (payload.old as MaintenanceTaskDB).id

  setTasks(prev => prev.filter(t => t.id !== id))

}