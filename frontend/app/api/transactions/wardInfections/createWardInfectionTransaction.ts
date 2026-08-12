import { API_BASE_URL } from "../../client/apiClient"
import { authFetch } from "../../client/apiClient"

import { CreateWardInfectionType } from "../../../types/wardInfectionTypes"

import { getWardInfectionsFromApi } from "../../wardInfections/fetchWardInfections"

import {
  normalizeWardInfection,
  toCreateWardInfectionRequest
} from "../../../utils/wardInfectionMapper"

type CreateWardInfectionTransactionParams = {
  wardInfection: CreateWardInfectionType
  setWardInfections: any
  onClose?: () => void
}

export async function createWardInfectionTransaction({
  wardInfection,
  setWardInfections,
  onClose
}: CreateWardInfectionTransactionParams)
{
  console.log("createWardInfectionTransaction")

  await fetch(
    `${API_BASE_URL}/ward-infections`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(
        toCreateWardInfectionRequest(
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

  if (onClose) {
    onClose()
  }
}