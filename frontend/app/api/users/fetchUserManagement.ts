import { API_BASE_URL, authFetch } from "../client/apiClient"

export async function getUserManagementFromApi() {

    console.log("fetchUserManagement")

    const response = await authFetch(
                        `${API_BASE_URL}/fetch-user-management`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type":
                                "application/json"
                            }
                        }
                    )

    return await response.json()
}