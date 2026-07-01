import { API_BASE_URL } from "../../client"
import { DeleteRoomInfectionsType } from "../../../types/roomInfectionTypes"
import { getRoomInfectionsFromApi } from "../../roomInfections/fetchRoomInfections"
import {
         normalizeRoomInfection,
         toDeleteRoomInfectionsRequest
       } from "../../../utils/roomInfectionMapper"
import { authFetch } from "../../client"

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