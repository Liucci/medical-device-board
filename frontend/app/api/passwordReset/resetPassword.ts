import { API_BASE_URL } from "../client/apiClient"

import { ResetPasswordBackType } from "../../types/passwordResetTypes"


export const resetPassword = async (
    request: ResetPasswordBackType
) => {

    const response = await fetch(
        `${API_BASE_URL}/reset-password`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(request),
        }
    )

    return await response.json()
}