import { API_BASE_URL } from "../../client"
import { UpdateWardType } from "../../../types/wardTypes"
import { getWardsFromApi } from "../../wards/fetchWards"

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

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}/update-ward`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
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