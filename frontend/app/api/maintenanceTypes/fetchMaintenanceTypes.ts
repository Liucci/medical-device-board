import { API_BASE_URL } from "../client"

export async function getMaintenanceTypesFromApi()
 {
    console.log("fetchMiantenance")  
    const token =localStorage.getItem("access_token")
    if (!token) {return}
    const response = await fetch(
                        `${API_BASE_URL}/maintenance-types`,
                        {
                          method: "GET",
                         headers: {
                                      Authorization:
                                        `Bearer ${token}`
                                    }
                        }
                      )
    return  await response.json()
}