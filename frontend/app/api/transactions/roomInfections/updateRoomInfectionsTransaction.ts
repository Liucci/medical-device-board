<<<<<<< HEAD
import { API_BASE_URL,authFetch } from "../../client/apiClient"
=======
import { API_BASE_URL,authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { UpdateRoomInfectionsType } from "../../../types/roomInfectionTypes"
import { getRoomInfectionsFromApi } from "../../roomInfections/fetchRoomInfections"
import { normalizeRoomInfection,toUpdateRoomInfectionsRequest } from "../../../utils/roomInfectionMapper"

type UpdateRoomInfectionsTransactionParams = {
                                               roomInfection: UpdateRoomInfectionsType
                                               setRoomInfections: any
                                             }

export async function updateRoomInfectionsTransaction({
                                                        roomInfection,
                                                        setRoomInfections
                                                      }: UpdateRoomInfectionsTransactionParams
                                                    )
{
  console.log("updateRoomInfectionsTransaction")

  await authFetch(
                    `${API_BASE_URL}/update-room-infections-transaction`,
                    {
                      method: "POST",
                      headers: {
                                  "Content-Type":
                                  "application/json"
                                },
                      body: JSON.stringify(
                                              toUpdateRoomInfectionsRequest(
                                                                                roomInfection
                                                                              )
                                            )
                    }
                  )

  const roomInfections =
    await getRoomInfectionsFromApi()

  setRoomInfections(
                      roomInfections.map(
                                          normalizeRoomInfection
                                        )
                    )
}