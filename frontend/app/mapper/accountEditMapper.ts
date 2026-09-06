import {
         VerifyAccountEditFrontType,
         VerifyAccountEditBackType,
         UpdateMyAccountFrontType,
         UpdateMyAccountBackType,
         AccountInfoFrontType,
         AccountInfoBackType
       } from "../types/accountEditTypes"



// Verify
export const toVerifyAccountEditCodeRequest = (request: VerifyAccountEditFrontType):
 VerifyAccountEditBackType => ({code: request.code})

// Update
export const toUpdateMyAccountRequest = (
  request: UpdateMyAccountFrontType
        ): UpdateMyAccountBackType => ({
                                      code: request.code,
                                      display_name: request.displayName,
                                      password: request.password
        })

// DB→UI
export const normalizeAccountInfo = (
  account: AccountInfoBackType
        ): AccountInfoFrontType => ({
                                    displayName: account.display_name,
                                    email: account.email
        })