import { API_BASE_URL } from "../../client"
import { CreateRoomInfectionType } from "../../../types/roomInfectionTypes"
import { getRoomInfectionsFromApi } from "../../roomInfections/fetchRoomInfections"
import {
         normalizeRoomInfection,
         toCreateRoomInfectionRequest
       } from "../../../utils/roomInfectionMapper"
import { authFetch } from "../../client"

type CreateRoomInfectionTransactionParams = {
                                                roomInfection: CreateRoomInfectionType
                                                setRoomInfections: any
                                                onClose?: () => void
                                            }

export async function createRoomInfectionTransaction({
                                                        roomInfection,
                                                        setRoomInfections,
                                                        onClose
                                                      }: CreateRoomInfectionTransactionParams
                                                    )
{
  console.log("createRoomInfectionTransaction")

  await authFetch(
                    `${API_BASE_URL}/room-infections`,
                    {
                      method: "POST",
                      headers: {
                                  "Content-Type":
                                  "application/json"
                                },
                      body: JSON.stringify(
                                              toCreateRoomInfectionRequest(
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

  if (onClose) {onClose()}
}