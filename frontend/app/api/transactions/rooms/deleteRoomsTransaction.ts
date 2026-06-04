import { API_BASE_URL } from "../../client"
import { getRoomsFromApi } from "../../rooms/fetchRooms"
import { normalizeRoom } from "@/app/utils/roomsMapper"
import { Room } from "@/app/types/roomTypes"


export async function deleteRoomsTransaction(rooms:any,
                                            setRooms:any,
                                            )
{
    console.log("deleteRoomsTransaction")

    const token = localStorage.getItem("access_token")
    if (!token) {return}

    await fetch(
                  `${API_BASE_URL}/delete-rooms-transaction`,
                  {
                    method:"POST",
                    headers:{
                                "Content-Type":"application/json",
                                Authorization:`Bearer ${token}`
                              },
                    body:JSON.stringify({
                                          ids:rooms["ids"]
                                        })
                  }
                )

    const r = await getRoomsFromApi()
    setRooms(r.map(normalizeRoom))
}