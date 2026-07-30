import { API_BASE_URL } from "../client/apiClient"
import { authFetch } from "../client/apiClient"

export async function fetchHospitalSettings()
{
    console.log("fetchHospitalSettings")

    const response = await authFetch(
                        `${API_BASE_URL}/hospital-settings`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                      )

    return await response.json()

    
}