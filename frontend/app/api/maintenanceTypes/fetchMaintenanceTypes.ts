import { API_BASE_URL , authFetch} from "../client/apiClient"
export async function getMaintenanceTypesFromApi()
 {
    console.log("fetchMiantenance")  

    const response = await fetch(
                        `${API_BASE_URL}/maintenance-types`,
                        {
                          method: "GET",
                         headers: {
                                    "Content-Type":
                                    "application/json"
                                    },
                        credentials: "include",
                        }
                      )
    return  await response.json()
}