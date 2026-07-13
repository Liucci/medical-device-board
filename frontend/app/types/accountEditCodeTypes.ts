// Front標準型
export type AccountEditCodeType = {
  id: number
  userId: string
  code: string
  used: boolean
  expiresAt: string
  createdAt: string
}

// Backend標準型
export type AccountEditCodeDBType = {
  id: number
  user_id: string
  code: string
  used: boolean
  expires_at: string
  created_at: string
}



// 発行要求
export type CreateAccountEditCodeFrontType = {
  userId: string
}

export type CreateAccountEditCodeBackType = {
  user_id: string
}



// 認証要求
export type VerifyAccountEditCodeFrontType = {
  userId: string
  code: string
}

export type VerifyAccountEditCodeBackType = {
  user_id: string
  code: string
}



// アカウント更新
export type UpdateMyAccountFrontType = {
  userId: string
  displayName: string
  password: string
}

export type UpdateMyAccountBackType = {
  user_id: string
  display_name: string
  password: string
}