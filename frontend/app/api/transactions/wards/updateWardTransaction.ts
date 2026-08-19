import { API_BASE_URL } from "../../client/apiClient"
import { UpdateWardType } from "../../../types/wardTypes"
import { getWardsFromApi } from "../../wards/fetchWards"
import {  } from "../../client/apiClient"

import {
         normalizeWard,
         toUpdateWardRequest
       } from "../../../utils/wardsMapper"

type UpdateWardTransactionParams = {
                                     ward: UpdateWardType
                                     setWards: any
                                   }

export async function updateWardTransaction({
                                               ward,
                                               setWards
                                             }: UpdateWardTransactionParams
                                           )
{
  console.log("updateWardTransaction")


  await fetch(
                `${API_BASE_URL}/update-ward`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
                            },credentials: "include",
                  body: JSON.stringify(
                                          toUpdateWardRequest(
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
}