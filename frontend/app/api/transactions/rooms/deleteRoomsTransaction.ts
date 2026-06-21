import { API_BASE_URL } from "../../client"
import { authFetch } from "../../client"
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

  await authFetch(
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

  const updatedRooms =
    await getRoomsFromApi()

  setRooms(
             updatedRooms.map(
                               normalizeRoom
                             )
           )
}