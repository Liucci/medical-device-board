import { API_BASE_URL } from "../../client"
import { DeleteWardsType } from "../../../types/wardTypes"

import { getWardsFromApi } from "../../wards/fetchWards"
import { getRoomsFromApi } from "../../rooms/fetchRooms"

import {
         normalizeWard,
         toDeleteWardsRequest
       } from "../../../utils/wardsMapper"

import { normalizeRoom } from "../../../utils/roomsMapper"

type DeleteWardTransactionParams = {
                                     ward: DeleteWardsType
                                     setWards: any
                                     setRooms: any
                                   }

export async function deleteWardTransaction({
                                               ward,
                                               setWards,
                                               setRooms
                                             }: DeleteWardTransactionParams
                                           )
{
  console.log("deleteWardTransaction")

  if (
       !confirm(
                 "病棟を削除すると部屋も削除されます。よろしいですか？"
               )
     ) {return}

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}/delete-ward`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
                            },
                  body: JSON.stringify(
                                          toDeleteWardsRequest(
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

  const rooms =
    await getRoomsFromApi()

  setRooms(
             rooms.map(
                        normalizeRoom
                      )
           )
}