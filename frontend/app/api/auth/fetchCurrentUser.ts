import { API_BASE_URL,authFetch } from "../client"
import { refreshToken } from "./refreshToken"

export const fetchCurrentUser = async () => {

    const response =
        await authFetch(
            `${API_BASE_URL}/current-user`
        )

    if (!response.ok) {
        return null
    }

    return await response.json()
}