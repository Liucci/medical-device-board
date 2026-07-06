import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { normalizeRoomInfection } from "../utils/roomInfectionMapper"
import { RoomInfectionDBType } from "../types/roomInfectionTypes"

type Props = {
  setRoomInfections: React.Dispatch<React.SetStateAction<any[]>>
}

export function subscribeRoomInfectionsRealtime({
  setRoomInfections
}: Props) {

  console.log("subscribeRoomInfectionsRealtime")

  const channel = supabase
    .channel("room_infections")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "room_infections"
      },
      (payload: RealtimePostgresChangesPayload<RoomInfectionDBType>) => {
        console.log("RoomInfectionRealtime", payload.eventType, payload)
        switch (payload.eventType) {

          case "INSERT":
            handleInsert(payload, setRoomInfections)
            break

          case "UPDATE":
            handleUpdate(payload, setRoomInfections)
            break

          case "DELETE":
            handleDelete(payload, setRoomInfections)
            break

        }

      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }

}

function handleInsert(
  payload: RealtimePostgresChangesPayload<RoomInfectionDBType>,
  setRoomInfections: React.Dispatch<React.SetStateAction<any[]>>
) {

  const roomInfection = normalizeRoomInfection(payload.new as RoomInfectionDBType)

    setRoomInfections(prev => {
      if (prev.some(r => r.id === roomInfection.id)) {
        return prev
      }
      return [...prev, roomInfection]
    })
}

function handleUpdate(
  payload: RealtimePostgresChangesPayload<RoomInfectionDBType>,
  setRoomInfections: React.Dispatch<React.SetStateAction<any[]>>
) {

  const roomInfection = normalizeRoomInfection(payload.new as RoomInfectionDBType)

  setRoomInfections(prev => prev.map(r => r.id === roomInfection.id ? roomInfection : r))

}

function handleDelete(
  payload: RealtimePostgresChangesPayload<RoomInfectionDBType>,
  setRoomInfections: React.Dispatch<React.SetStateAction<any[]>>
) {

  const id = (payload.old as RoomInfectionDBType).id

  setRoomInfections(prev => prev.filter(r => r.id !== id))

}