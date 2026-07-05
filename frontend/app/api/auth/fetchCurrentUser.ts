import { API_BASE_URL, authFetch } from "../client/apiClient"

export const fetchCurrentUser = async () => {
    console.log("fetchCurrentUser")

    const response = await authFetch(
        `${API_BASE_URL}/current-user`
    )

    if (!response) {
        return null
    }

    if (!response.ok) {
        return null
    }

    return await response.json()
}