import { createPasswordResetCode } from "../../../api/passwordReset/createPasswordResetCode"

import { CreatePasswordResetCodeFrontType } from "../../../types/passwordResetTypes"

import { toCreatePasswordResetCodeRequest } from "../../../mapper/passwordResetMapper"


export const createPasswordResetCodeTransaction = async (
    request: CreatePasswordResetCodeFrontType
) => {

    const response = await createPasswordResetCode(
        toCreatePasswordResetCodeRequest(request)
    )

    return response
}