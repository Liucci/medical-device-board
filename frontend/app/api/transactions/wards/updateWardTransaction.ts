import { API_BASE_URL } from "../../client"
import { getWardsFromApi }from "../../wards/fetchWards"
import { normalizeWard } from "@/app/utils/wardsMapper"

export async function updateWardTransaction(
                                              id:number,
                                              name:string,
                                              
                                              setWards:any
                                            )
{
    console.log("updateWardTransaction")

    const trimmed = name.trim()
    if (!trimmed) {return}


    const token = localStorage.getItem("access_token")
    if (!token) {return}

    await fetch(
                  `${API_BASE_URL}/update-ward`,
                  {
                    method: "POST",
                    headers: {
                                "Content-Type":"application/json",
                                "Authorization":`Bearer ${token}`
                              },
                    body: JSON.stringify({
                                            id,
                                            name: trimmed
                                          })
                  }
                )

    const updatedWards = await getWardsFromApi()

    setWards(updatedWards.map(normalizeWard))
}