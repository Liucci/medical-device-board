import { API_BASE_URL,  } from "../../client/apiClient"

import { UpdateWardInfectionsType } from "../../../types/wardInfectionTypes"

import { getWardInfectionsFromApi } from "../../wardInfections/fetchWardInfections"

import {
  normalizeWardInfection,
  toUpdateWardInfectionsRequest
} from "../../../utils/wardInfectionMapper"

type UpdateWardInfectionsTransactionParams = {
  wardInfection: UpdateWardInfectionsType
  setWardInfections: any
}

export async function updateWardInfectionsTransaction({
  wardInfection,
  setWardInfections
}: UpdateWardInfectionsTransactionParams)
{
  console.log("updateWardInfectionsTransaction")

  await fetch(
    `${API_BASE_URL}/update-ward-infections-transaction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(
        toUpdateWardInfectionsRequest(
          wardInfection
        )
      )
    }
  )

  const wardInfections =
    await getWardInfectionsFromApi()

  setWardInfections(
    wardInfections.map(
      normalizeWardInfection
    )
  )
}