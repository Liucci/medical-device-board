import { API_BASE_URL } from "../client"

export async function getMaintenanceTypesFromApi(setMaintenanceTypes: any)
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
    const data =
      await response.json()
    setMaintenanceTypes(data)
}