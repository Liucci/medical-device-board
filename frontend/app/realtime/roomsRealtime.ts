import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { normalizeRoom } from "../utils/roomsMapper"
import { RoomDBType } from "../types/roomTypes"

type Props = {
  setRooms: React.Dispatch<React.SetStateAction<any[]>>
}

export function subscribeRoomsRealtime({
  setRooms
}: Props) {

  console.log("subscribeRoomsRealtime")

  const channel = supabase
    .channel("rooms")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "rooms"
      },
      (payload: RealtimePostgresChangesPayload<RoomDBType>) => {

        switch (payload.eventType) {

          case "INSERT":
            handleInsert(payload, setRooms)
            break

          case "UPDATE":
            handleUpdate(payload, setRooms)
            break

          case "DELETE":
            handleDelete(payload, setRooms)
            break

        }

      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }

}

function handleInsert(
  payload: RealtimePostgresChangesPayload<RoomDBType>,
  setRooms: React.Dispatch<React.SetStateAction<any[]>>
) {

  const room = normalizeRoom(payload.new as RoomDBType)

  setRooms(prev => {
    if (prev.some(r => r.id === room.id)) {
      return prev
    }
    return [...prev, room]
  })
}

function handleUpdate(
  payload: RealtimePostgresChangesPayload<RoomDBType>,
  setRooms: React.Dispatch<React.SetStateAction<any[]>>
) {

  const room = normalizeRoom(payload.new as RoomDBType)

  setRooms(prev => prev.map(r => r.id === room.id ? room : r))

}

function handleDelete(
  payload: RealtimePostgresChangesPayload<RoomDBType>,
  setRooms: React.Dispatch<React.SetStateAction<any[]>>
) {

  const id = (payload.old as RoomDBType).id

  setRooms(prev => prev.filter(r => r.id !== id))

}