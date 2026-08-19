import { API_BASE_URL } from "../client/apiClient"

export async function fetchHospitalSettings()
{
    console.log("fetchHospitalSettings")

    const response = await fetch(
                        `${API_BASE_URL}/hospital-settings`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            credentials: "include",
                        }
                      )

    return await response.json()

    
}