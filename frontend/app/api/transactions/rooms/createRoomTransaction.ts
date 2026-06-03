import { API_BASE_URL } from "../../client"
import { getRoomsFromApi } from "../../../api/rooms/fetchRooms"
import { normalizeRoom } from "../../../utils/roomsMapper"

export async function createRoomTransaction(
                                            room:any,
                                            setRooms:any,
                                            setNewRoomName:any
                                        )
{
    console.log("createRoomTransaction")

    const trimmed = room.name.trim()
    if (!trimmed) {return}

    const token = localStorage.getItem("access_token")
    if (!token) {return}

    await fetch(
                  `${API_BASE_URL}/rooms`,
                  {
                    method: "POST",
                    headers: {
                                "Content-Type":"application/json",
                                "Authorization":`Bearer ${token}`
                              },
                    body: JSON.stringify({
                                            ward_id: room.ward_id,
                                            name: trimmed
                                          })
                  }
                )

    const rooms = await getRoomsFromApi()

    setRooms(rooms.map(normalizeRoom))
    setNewRoomName("")

}