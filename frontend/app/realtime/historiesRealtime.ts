import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { normalizeHistory } from "../utils/historyMapper"
import { HistoryDB } from "../types/historyTypes"

type Props = {
  setHistories: React.Dispatch<React.SetStateAction<any[]>>
}

export function subscribeHistoriesRealtime({
  setHistories
}: Props) {

  console.log("subscribeHistoriesRealtime")

  const channel = supabase
    .channel("device_histories")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "device_histories"
      },
      (payload: RealtimePostgresChangesPayload<HistoryDB>) => {
        console.log("HistoryRealType", payload.eventType, payload)
        switch (payload.eventType) {

          case "INSERT":
            handleInsert(payload, setHistories)
            break

          case "UPDATE":
            handleUpdate(payload, setHistories)
            break

          case "DELETE":
            handleDelete(payload, setHistories)
            break

        }

      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }

}

function handleInsert(
  payload: RealtimePostgresChangesPayload<HistoryDB>,
  setHistories: React.Dispatch<React.SetStateAction<any[]>>
) {

  const history = normalizeHistory(payload.new as HistoryDB)

  setHistories(prev => {
    if (prev.some(h => h.id === history.id)) {
      return prev
    }
    return [...prev, history]
  })
  }

function handleUpdate(
  payload: RealtimePostgresChangesPayload<HistoryDB>,
  setHistories: React.Dispatch<React.SetStateAction<any[]>>
) {

  const history = normalizeHistory(payload.new as HistoryDB)

  setHistories(prev => prev.map(h => h.id === history.id ? history : h))

}

function handleDelete(
  payload: RealtimePostgresChangesPayload<HistoryDB>,
  setHistories: React.Dispatch<React.SetStateAction<any[]>>
) {

  const id = (payload.old as HistoryDB).id

  setHistories(prev => prev.filter(h => h.id !== id))

}