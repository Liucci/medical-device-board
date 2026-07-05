<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { DeleteRoomInfectionsType } from "../../../types/roomInfectionTypes"
import { getRoomInfectionsFromApi } from "../../roomInfections/fetchRoomInfections"
import {
         normalizeRoomInfection,
         toDeleteRoomInfectionsRequest
       } from "../../../utils/roomInfectionMapper"
<<<<<<< HEAD
import { authFetch } from "../../client/apiClient"
=======
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

type DeleteRoomInfectionsTransactionParams = {
                                                roomInfections: DeleteRoomInfectionsType
                                                setRoomInfections: any
                                             }

export async function deleteRoomInfectionsTransaction({
                                                        roomInfections,
                                                        setRoomInfections
                                                      }: DeleteRoomInfectionsTransactionParams
                                                    )
{
  console.log("deleteRoomInfectionsTransaction")

  await authFetch(
                    `${API_BASE_URL}/delete-room-infections`,
                    {
                      method: "POST",
                      headers: {
                                  "Content-Type":
                                  "application/json"
                                },
                      body: JSON.stringify(
                                              toDeleteRoomInfectionsRequest(
                                                                                roomInfections
                                                                              )
                                            )
                    }
                  )

  const roomInfectionsResponse =
    await getRoomInfectionsFromApi()

  setRoomInfections(
                      roomInfectionsResponse.map(
                                                   normalizeRoomInfection
                                                 )
                    )
}