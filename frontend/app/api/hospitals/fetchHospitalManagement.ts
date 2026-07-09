import { API_BASE_URL } from "../client/apiClient"
import { authFetch } from "../client/apiClient"

export async function getHospitalManagementFromApi() 
{
  console.log("fetchHospitalManagement")
  const response = await authFetch(
                                    `${API_BASE_URL}/fetch-hospital-management`,
                                    {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                    }
  )

  return await response.json()
}