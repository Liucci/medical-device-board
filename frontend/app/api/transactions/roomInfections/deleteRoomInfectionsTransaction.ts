import { API_BASE_URL } from "../../client/apiClient"
import { DeleteRoomInfectionsType } from "../../../types/roomInfectionTypes"
import { getRoomInfectionsFromApi } from "../../roomInfections/fetchRoomInfections"
import {
         normalizeRoomInfection,
         toDeleteRoomInfectionsRequest
       } from "../../../utils/roomInfectionMapper"
import { authFetch } from "../../client/apiClient"

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

  await fetch(
                    `${API_BASE_URL}/delete-room-infections`,
                    {
                      method: "POST",
                      headers: {
                                  "Content-Type":
                                  "application/json"
                                },
                      credentials: "include",
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