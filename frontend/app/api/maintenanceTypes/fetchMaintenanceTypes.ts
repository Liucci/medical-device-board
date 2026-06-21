import { API_BASE_URL , authFetch} from "../client"

export async function getMaintenanceTypesFromApi()
 {
    console.log("fetchMiantenance")  

    const response = await authFetch(
                        `${API_BASE_URL}/maintenance-types`,
                        {
                          method: "GET",
                         headers: {
                                    "Content-Type":
                                    "application/json"
                                    }
                        }
                      )
    return  await response.json()
}