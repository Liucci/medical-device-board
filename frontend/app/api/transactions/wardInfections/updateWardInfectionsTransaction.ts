import { API_BASE_URL, authFetch } from "../../client/apiClient"

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

  await authFetch(
    `${API_BASE_URL}/update-ward-infections-transaction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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