<<<<<<< HEAD
import { API_BASE_URL, authFetch } from "../client/apiClient"
=======
import { API_BASE_URL, authFetch } from "../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

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