import { UpdatePasswordResetFrontType } from "../../../types/passwordResetTypes"
import { toUpdatePasswordResetRequest } from "../../../mapper/passwordResetMapper"
import { updatePasswordReset } from "../../../api/passwordReset/updatePasswordReset"


// パスワード変更Transaction
export const updatePasswordResetTransaction = async (
    front: UpdatePasswordResetFrontType
) => {
    console.log("updatePasswordResetTransaction")

    // UI → API Request
    const request = toUpdatePasswordResetRequest(front)

    // パスワード変更API
    const response = await updatePasswordReset(request)

    if (!response.success) {
        throw new Error(response.detail || "パスワード変更に失敗しました")
    }

    return response
}