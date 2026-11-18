import { API_BASE_URL } from "../client/apiClient"

import { CreatePasswordResetCodeBackType } from "../../types/passwordResetTypes"


export const createPasswordResetCode = async (
    request: CreatePasswordResetCodeBackType
) => {

    const response = await fetch(
        `${API_BASE_URL}/create-password-reset-code`,
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