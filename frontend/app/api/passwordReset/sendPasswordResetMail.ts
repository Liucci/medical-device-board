import { API_BASE_URL } from "../client/apiClient"


export const sendPasswordResetMail = async () => {

    const response = await fetch(
        `${API_BASE_URL}/send-password-reset-mail`,
        {
            method: "POST",
            credentials: "include",
        }
    )

    return await response.json()
}