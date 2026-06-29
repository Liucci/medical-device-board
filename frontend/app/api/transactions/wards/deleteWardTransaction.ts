import { API_BASE_URL } from "../../client"
import { DeleteWardsType } from "../../../types/wardTypes"
import { authFetch } from "../../client"

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


  const response=await authFetch(
                `${API_BASE_URL}/delete-ward`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
                            },
                  body: JSON.stringify(
                                          toDeleteWardsRequest(
                                                                 ward
                                                               )
                                        )
                }
              )
if (!response.ok) {
    const error = await response.json()
    alert(error.detail)
    return
}
              
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