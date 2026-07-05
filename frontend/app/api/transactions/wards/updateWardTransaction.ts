<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
import { UpdateWardType } from "../../../types/wardTypes"
import { getWardsFromApi } from "../../wards/fetchWards"
import { authFetch } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
import { UpdateWardType } from "../../../types/wardTypes"
import { getWardsFromApi } from "../../wards/fetchWards"
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

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


  await authFetch(
                `${API_BASE_URL}/update-ward`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
                            },
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