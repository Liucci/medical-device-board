import { API_BASE_URL } from "../client/apiClient"

export async function logoutFromBackend(): Promise<void>
{
    console.log("logout")
    const response = await fetch(
                        `${API_BASE_URL}/logout`,
                        {
                        method: "POST",
                        credentials: "include",
                        }
    )

  if (!response.ok) {
    throw new Error("Backend logout failed")
  }
}