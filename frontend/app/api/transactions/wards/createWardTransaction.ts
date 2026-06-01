import { API_BASE_URL } from "../../client"
import { getWardsFromApi } from "../../wards/fetchWards"
import { normalizeWard } from "../../../utils/wardsMapper"

export async function createWardTransaction(
                                              name: string,
                                              
                                            )
{
    console.log("createWardTransaction")
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



                                }