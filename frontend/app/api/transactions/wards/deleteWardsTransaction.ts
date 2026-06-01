import { API_BASE_URL } from "../../client"

export async function deleteWardsTransaction(ids: number[])
 {
    console.log("deleteWardsTransaction")
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

            }