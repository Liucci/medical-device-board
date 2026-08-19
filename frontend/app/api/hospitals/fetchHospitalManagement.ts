import { API_BASE_URL } from "../client/apiClient"

export async function getHospitalManagementFromApi() 
{
  console.log("fetchHospitalManagement")
  const response = await fetch(
                                    `${API_BASE_URL}/fetch-hospital-management`,
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