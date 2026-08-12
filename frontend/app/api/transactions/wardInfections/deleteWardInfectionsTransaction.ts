import { API_BASE_URL } from "../../client/apiClient"
import { authFetch } from "../../client/apiClient"

import { DeleteWardInfectionsType } from "../../../types/wardInfectionTypes"

import { getWardInfectionsFromApi } from "../../wardInfections/fetchWardInfections"

import {
  normalizeWardInfection,
  toDeleteWardInfectionsRequest
} from "../../../utils/wardInfectionMapper"

type DeleteWardInfectionsTransactionParams = {
  wardInfections: DeleteWardInfectionsType
  setWardInfections: any
}

export async function deleteWardInfectionsTransaction({
  wardInfections,
  setWardInfections
}: DeleteWardInfectionsTransactionParams)
{
  console.log("deleteWardInfectionsTransaction")

  await fetch(
    `${API_BASE_URL}/delete-ward-infections`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(
        toDeleteWardInfectionsRequest(
          wardInfections
        )
      )
    }
  )

  const wardInfectionsResponse =
    await getWardInfectionsFromApi()

  setWardInfections(
    wardInfectionsResponse.map(
      normalizeWardInfection
    )
  )
}