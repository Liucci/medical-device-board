import { API_BASE_URL } from "../../../client/apiClient"
import { CreateWardType } from "../../../types/wardTypes"
import { getWardsFromApi } from "../../wards/fetchWards"
import { authFetch } from "../../../client/apiClient"

import {
         normalizeWard,
         toCreateWardRequest
       } from "../../../utils/wardsMapper"

type CreateWardTransactionParams = {
                                     ward: CreateWardType
                                     setWards: any
                                     onClose?: () => void
                                   }

export async function createWardTransaction({
                                               ward,
                                               setWards,
                                               onClose
                                             }: CreateWardTransactionParams
                                           )
{
  console.log("createWardTransaction")

  await authFetch(
                `${API_BASE_URL}/wards`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
                            },
                  body: JSON.stringify(
                                          toCreateWardRequest(
                                                               ward
                                                             )
                                        )
                }
              )

  const wards =
    await getWardsFromApi()

  setWards(
             wards.map(
                        normalizeWard
                      )
           )

  if (onClose) {onClose()}
}