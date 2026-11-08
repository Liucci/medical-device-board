import { resetPassword } from "../../../api/passwordReset/resetPassword"

import { ResetPasswordFrontType } from "../../../types/passwordResetTypes"

import { toResetPasswordRequest } from "../../../mapper/passwordResetMapper"

//新しいパスワードをBackendに送信する
export const resetPasswordTransaction = async (
    request: ResetPasswordFrontType
) => {

    const response = await resetPassword(
        toResetPasswordRequest(request)
    )

    return response
}