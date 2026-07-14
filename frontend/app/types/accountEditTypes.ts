// Verify Request(UI)
export type VerifyAccountEditFrontType = {
  code: string
}

// Verify Request(DB)
export type VerifyAccountEditBackType = {
  code: string
}

// Update(UI)
export type UpdateMyAccountFrontType = {
  code: string
  displayName: string
  password: string
}

// Update(DB)
export type UpdateMyAccountBackType = {
  code: string
  display_name: string
  password: string
}

// Response(DB)
export type AccountInfoBackType = {
  display_name: string
  email: string
}

// Response(UI)
export type AccountInfoFrontType = {
  displayName: string
  email: string
}