import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { normalizeInfectionType } from "../utils/infectionTypeMapper"
import { InfectionTypeDBType } from "../types/infectionTypeTypes"

type Props = {
  setInfectionTypes: React.Dispatch<React.SetStateAction<any[]>>
}

export function subscribeInfectionTypesRealtime({
  setInfectionTypes
}: Props) {

  console.log("subscribeInfectionTypesRealtime")

  const channel = supabase
    .channel("infection_types")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "infection_types"
      },
      (payload: RealtimePostgresChangesPayload<InfectionTypeDBType>) => {

        switch (payload.eventType) {

          case "INSERT":
            handleInsert(payload, setInfectionTypes)
            break

          case "UPDATE":
            handleUpdate(payload, setInfectionTypes)
            break

          case "DELETE":
            handleDelete(payload, setInfectionTypes)
            break

        }

      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }

}

function handleInsert(
  payload: RealtimePostgresChangesPayload<InfectionTypeDBType>,
  setInfectionTypes: React.Dispatch<React.SetStateAction<any[]>>
) {

  const infectionType = normalizeInfectionType(payload.new as InfectionTypeDBType)

  setInfectionTypes(prev => [...prev, infectionType])

}

function handleUpdate(
  payload: RealtimePostgresChangesPayload<InfectionTypeDBType>,
  setInfectionTypes: React.Dispatch<React.SetStateAction<any[]>>
) {

  const infectionType = normalizeInfectionType(payload.new as InfectionTypeDBType)

  setInfectionTypes(prev => prev.map(i => i.id === infectionType.id ? infectionType : i))

}

function handleDelete(
  payload: RealtimePostgresChangesPayload<InfectionTypeDBType>,
  setInfectionTypes: React.Dispatch<React.SetStateAction<any[]>>
) {

  const id = (payload.old as InfectionTypeDBType).id

  setInfectionTypes(prev => prev.filter(i => i.id !== id))

}