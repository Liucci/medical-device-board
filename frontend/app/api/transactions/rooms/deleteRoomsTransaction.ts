<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
import { authFetch } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { DeleteRoomsType } from "../../../types/roomTypes"

import { getRoomsFromApi } from "../../rooms/fetchRooms"

import {
         normalizeRoom,
         toDeleteRoomsRequest
       } from "../../../utils/roomsMapper"

type DeleteRoomsTransactionParams = {
                                      rooms: DeleteRoomsType
                                      setRooms: any
                                    }

export async function deleteRoomsTransaction({
                                                rooms,
                                                setRooms
                                              }: DeleteRoomsTransactionParams
                                            )
{
  console.log("deleteRoomsTransaction")

  const response =await authFetch(
                `${API_BASE_URL}/delete-rooms-transaction`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
                            },
                  body: JSON.stringify(
                                          toDeleteRoomsRequest(
                                                                 rooms
                                                               )
                                        )
                }
              )
  if (!response.ok) {
      const error = await response.json()
      alert(error.detail)
      return
  }
  const updatedRooms =
    await getRoomsFromApi()

  setRooms(
             updatedRooms.map(
                               normalizeRoom
                             )
           )
}