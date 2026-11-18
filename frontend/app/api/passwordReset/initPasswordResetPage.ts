import { API_BASE_URL } from "../client/apiClient"

export const initPasswordResetPage = async (code: string) => {
    const response = await fetch(
        `${API_BASE_URL}/init-password-reset-page?code=${encodeURIComponent(code)}`,
        {
            method: "GET",
            credentials: "include",
        }
    )

    return await response.json()
}