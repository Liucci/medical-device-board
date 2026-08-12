import { API_BASE_URL,  } from "../client/apiClient"

export async function getUserManagementFromApi() {

    console.log("fetchUserManagement")

    const response = await fetch(
                        `${API_BASE_URL}/fetch-user-management`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type":
                                "application/json"
                            },
                            credentials: "include",
                        }
                    )

    return await response.json()
}