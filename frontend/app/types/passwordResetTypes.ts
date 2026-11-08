// Create Password Reset Code
export type CreatePasswordResetCodeFrontType = {
    email: string
}

export type CreatePasswordResetCodeBackType = {
    email: string
}

// Verify Password Reset Code
export type VerifyPasswordResetCodeFrontType = {
    code: string
}

export type VerifyPasswordResetCodeBackType = {
    code: string
}

// Reset Password
export type ResetPasswordFrontType = {
    password: string
}

export type ResetPasswordBackType = {
    password: string
}