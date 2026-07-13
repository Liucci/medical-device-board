import {
  AccountEditCodeType,
  AccountEditCodeDBType,
  CreateAccountEditCodeFrontType,
  CreateAccountEditCodeBackType,
  VerifyAccountEditCodeFrontType,
  VerifyAccountEditCodeBackType,
  UpdateMyAccountFrontType,
  UpdateMyAccountBackType
} from "../types/accountEditCodeTypes"



// DB → UI
export const normalizeAccountEditCode = (
  code: AccountEditCodeDBType
): AccountEditCodeType => ({
  id: code.id,
  userId: code.user_id,
  code: code.code,
  used: code.used,
  expiresAt: code.expires_at,
  createdAt: code.created_at
})



// Create
export const toCreateAccountEditCodeRequest = (
  request: CreateAccountEditCodeFrontType
): CreateAccountEditCodeBackType => ({
  user_id: request.userId
})



// Verify
export const toVerifyAccountEditCodeRequest = (
  request: VerifyAccountEditCodeFrontType
): VerifyAccountEditCodeBackType => ({
  user_id: request.userId,
  code: request.code
})



// Update Account
export const toUpdateMyAccountRequest = (
  request: UpdateMyAccountFrontType
): UpdateMyAccountBackType => ({
  user_id: request.userId,
  display_name: request.displayName,
  password: request.password
})