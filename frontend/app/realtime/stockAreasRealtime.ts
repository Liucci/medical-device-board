import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { normalizeStockArea } from "../utils/stockAreaMapper"
import { StockAreaDBType } from "../types/stockTypes"

type Props = {
  setStockAreas: React.Dispatch<React.SetStateAction<any[]>>
}

export function subscribeStockAreasRealtime({
  setStockAreas
}: Props) {

  console.log("subscribeStockAreasRealtime")

  const channel = supabase
    .channel("stock_areas")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "stock_areas"
      },
      (payload: RealtimePostgresChangesPayload<StockAreaDBType>) => {
        console.log("StockAreaRealtime", payload.eventType, payload)
        switch (payload.eventType) {

          case "INSERT":
            handleInsert(payload, setStockAreas)
            break

          case "UPDATE":
            handleUpdate(payload, setStockAreas)
            break

          case "DELETE":
            handleDelete(payload, setStockAreas)
            break

        }

      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }

}

function handleInsert(
  payload: RealtimePostgresChangesPayload<StockAreaDBType>,
  setStockAreas: React.Dispatch<React.SetStateAction<any[]>>
) {

  const stockArea = normalizeStockArea(payload.new as StockAreaDBType)

  setStockAreas(prev => {
    if (prev.some(s => s.id === stockArea.id)) {
      return prev
    }
    return [...prev, stockArea]
  })
}

function handleUpdate(
  payload: RealtimePostgresChangesPayload<StockAreaDBType>,
  setStockAreas: React.Dispatch<React.SetStateAction<any[]>>
) {

  const stockArea = normalizeStockArea(payload.new as StockAreaDBType)

  setStockAreas(prev => prev.map(s => s.id === stockArea.id ? stockArea : s))

}

function handleDelete(
  payload: RealtimePostgresChangesPayload<StockAreaDBType>,
  setStockAreas: React.Dispatch<React.SetStateAction<any[]>>
) {

  const id = (payload.old as StockAreaDBType).id

  setStockAreas(prev => prev.filter(s => s.id !== id))

}