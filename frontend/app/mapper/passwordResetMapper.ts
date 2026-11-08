import {
    CreatePasswordResetCodeFrontType,
    CreatePasswordResetCodeBackType,
    VerifyPasswordResetCodeFrontType,
    VerifyPasswordResetCodeBackType,
    ResetPasswordFrontType,
    ResetPasswordBackType,
} from "../types/passwordResetTypes"


// Create Password Reset Code
export const toCreatePasswordResetCodeRequest = (
    front: CreatePasswordResetCodeFrontType
): CreatePasswordResetCodeBackType => {
    return {
        email: front.email,
    }
}


// Verify Password Reset Code
export const toVerifyPasswordResetCodeRequest = (
    front: VerifyPasswordResetCodeFrontType
): VerifyPasswordResetCodeBackType => {
    return {
        code: front.code,
    }
}


// Reset Password
export const toResetPasswordRequest = (
    front: ResetPasswordFrontType
): ResetPasswordBackType => {
    return {
        password: front.password,
    }
}