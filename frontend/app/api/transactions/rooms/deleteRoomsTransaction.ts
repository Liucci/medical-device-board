import { API_BASE_URL } from "../../client"
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

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}/delete-rooms-transaction`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              Authorization:`Bearer ${token}`
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