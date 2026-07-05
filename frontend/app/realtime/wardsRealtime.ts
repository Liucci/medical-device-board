import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { normalizeWard } from "../utils/wardsMapper"
import { WardDBType } from "../types/wardTypes"

type Props = {
  setWards: React.Dispatch<React.SetStateAction<any[]>>
}

export function subscribeWardsRealtime({
  setWards
}: Props) {

  console.log("subscribeWardsRealtime")

  const channel = supabase
    .channel("wards")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "wards"
      },
      (payload: RealtimePostgresChangesPayload<WardDBType>) => {

        switch (payload.eventType) {

          case "INSERT":
            handleInsert(payload, setWards)
            break

          case "UPDATE":
            handleUpdate(payload, setWards)
            break

          case "DELETE":
            handleDelete(payload, setWards)
            break

        }

      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }

}

function handleInsert(
  payload: RealtimePostgresChangesPayload<WardDBType>,
  setWards: React.Dispatch<React.SetStateAction<any[]>>
) {

  const ward = normalizeWard(payload.new as WardDBType)

  setWards(prev => [...prev, ward])

}

function handleUpdate(
  payload: RealtimePostgresChangesPayload<WardDBType>,
  setWards: React.Dispatch<React.SetStateAction<any[]>>
) {

  const ward = normalizeWard(payload.new as WardDBType)

  setWards(prev => prev.map(w => w.id === ward.id ? ward : w))

}

function handleDelete(
  payload: RealtimePostgresChangesPayload<WardDBType>,
  setWards: React.Dispatch<React.SetStateAction<any[]>>
) {

  const id = (payload.old as WardDBType).id

  setWards(prev => prev.filter(w => w.id !== id))

}