<<<<<<< HEAD
import { API_BASE_URL , authFetch} from "../client/apiClient"
=======
import { API_BASE_URL , authFetch} from "../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

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