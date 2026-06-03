import { API_BASE_URL } from "../../client"
import { getRoomsFromApi } from "../../../api/rooms/fetchRooms"
import { normalizeRoom,toDBRoom } from "../../../utils/roomsMapper"



export async function updateRoomPatientname(
                                              room:{
                                                id:number
                                                patient_name:string | null
                                              },
                                              setRooms:any
                                            )
{
    console.log("update room patientname")

    const token = localStorage.getItem("access_token")
    if (!token) {return}

    const response = await fetch(
                                    `${API_BASE_URL}/update-room-patientname`,
                                    {
                                      method:"POST",
                                      headers:{
                                                  "Content-Type":"application/json",
                                                  Authorization:`Bearer ${token}`
                                                },
                                      body:JSON.stringify({
                                                            id:room.id,
                                                            patient_name:room.patient_name
                                                          })
                                    }
                                  )

    const rooms = await getRoomsFromApi()
    setRooms(rooms.map(normalizeRoom))                              
    return await response.json()

}