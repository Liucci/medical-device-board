import { API_BASE_URL } from "../client/apiClient"

import { VerifyPasswordResetCodeBackType } from "../../types/passwordResetTypes"


export const verifyPasswordResetCode = async (
    request: VerifyPasswordResetCodeBackType
) => {

    const response = await fetch(
        `${API_BASE_URL}/verify-password-reset-code`,
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