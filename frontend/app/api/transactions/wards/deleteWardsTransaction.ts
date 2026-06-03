import { API_BASE_URL } from "../../client"
import { normalizeWard } from "@/app/utils/wardsMapper"
import { getWardsFromApi }from "../../wards/fetchWards"
import { normalizeRoom } from "@/app/utils/roomsMapper"
import { getRoomsFromApi }from "../../rooms/fetchRooms"

export async function deleteWardsTransaction(
                                              ids: number[],
                                            setWards:any,  
                                            setRooms:any,
                                            )
 {
    console.log("deleteWardsTransaction")
    if (!confirm("病棟を削除すると部屋も削除されます。よろしいですか？")
    ) {return}

    const token = localStorage.getItem("access_token")
    if (!token) {return}

    await fetch(
                  `${API_BASE_URL}/delete-ward`,
                  {
                    method: "POST",
                    headers: {
                                "Content-Type":"application/json",
                                "Authorization":`Bearer ${token}`
                              },
                    body: JSON.stringify({ids})
                  }
                )
    const wards = await getWardsFromApi()
    setWards(wards.map(normalizeWard))
    const rooms = await getRoomsFromApi()
    setRooms(rooms.map(normalizeRoom))

            }