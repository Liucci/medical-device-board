
import { API_BASE_URL } from "../client/apiClient"

import { UpdatePasswordResetBackType } from "../../types/passwordResetTypes"


// パスワード変更
export const updatePasswordReset = async (
    request: UpdatePasswordResetBackType
) => {
    console.log("updatePasswordReset")

    const response = await fetch(
        `${API_BASE_URL}/update-password-reset`,
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
