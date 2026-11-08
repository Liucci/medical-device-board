import { verifyPasswordResetCode } from "../../../api/passwordReset/verifyPasswordResetCode"

import { VerifyPasswordResetCodeFrontType } from "../../../types/passwordResetTypes"

import { toVerifyPasswordResetCodeRequest } from "../../../mapper/passwordResetMapper"


export const verifyPasswordResetCodeTransaction = async (
    request: VerifyPasswordResetCodeFrontType
) => {

    const response = await verifyPasswordResetCode(
        toVerifyPasswordResetCodeRequest(request)
    )

    return response
}