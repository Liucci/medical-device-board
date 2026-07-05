<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
import { UpdateWardOrdersType } from "../../../types/wardTypes"
import { getWardsFromApi } from "../../wards/fetchWards"
import { authFetch } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
import { UpdateWardOrdersType } from "../../../types/wardTypes"
import { getWardsFromApi } from "../../wards/fetchWards"
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

import {
  normalizeWard,
  toUpdateWardOrdersRequest,
} from "../../../utils/wardsMapper"

type UpdateWardDisplayOrderTransactionParams = {
                                                wards: UpdateWardOrdersType
                                                setWards: any
                                                }

export async function updateWardDisplayOrderTransaction({
                                                        wards,
                                                        setWards,
                                                        }: UpdateWardDisplayOrderTransactionParams) 
{
  console.log("updateWardDisplayOrderTransaction")

  await authFetch(
                    `${API_BASE_URL}/update-ward-display-order`,
                                {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json",},
                                    body: JSON.stringify(toUpdateWardOrdersRequest(wards))
                                }
                )

  const updatedWards = await getWardsFromApi()

  setWards(
    updatedWards.map(normalizeWard)
  )
}