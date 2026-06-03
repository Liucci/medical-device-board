import { normalizeWard } from "@/app/utils/wardsMapper"
import { API_BASE_URL } from "../../client"
import { getWardsFromApi }from "../../wards/fetchWards"

export async function createWardTransaction(
                                              name: string,
                                              setNewWardName:any,
                                              setWards:any,
                                            )
{
    console.log("createWardTransaction")
    const trimmed = name.trim()
    if (!trimmed) {return}
    const token = localStorage.getItem("access_token")
    if (!token) {return}

     await fetch(
                                    `${API_BASE_URL}/wards`,
                                    {
                                      method: "POST",
                                      headers: {
                                                  "Content-Type":"application/json",
                                                  "Authorization":`Bearer ${token}`
                                                },
                                      body: JSON.stringify({
                                                              name: name
                                                            })
                                    }
                                  )
    const wards=await getWardsFromApi()
    setWards(wards.map(normalizeWard))
    setNewWardName("")
}