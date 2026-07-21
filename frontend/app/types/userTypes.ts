export type UserRole =
  | "viewer"
  | "normal"
  | "admin"
  | "support"
  | "system_admin"

//Front標準型
export type UserType = {
  id: string
  hospitalId: string
  email: string
  displayName: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}
//Backend標準型
export type UserDBType = {
  id: string
  hospital_id: string
  email: string
  display_name: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}


export type CreateUserFrontType = {
  hospitalId: string
  email: string
  displayName: string
  role: UserRole
  isActive: boolean
}

export type CreateUserBackType = {
  hospital_id: string
  email: string
  display_name: string
  role: UserRole
  is_active: boolean
}



export type UpdateUserFrontType = {
 id: string
   role: UserRole
  isActive: boolean
}

export type UpdateUserBackType = {
 id: string
  role: UserRole
  is_active: boolean
}



//fetchCurrentUser専用
//backから受けたJSONのnormalize後の型定義
export type CurrentUser = {
  id: string
  email: string
  hospitalId: string
  hospitalName: string
  displayName: string
  role: UserRole
  isActive: boolean
}

//fetchCurrentUserで受け取るときの型
// backendから受け取る型の定義
export type CurrentUserDB = {
  id: string
  email: string
  hospital_id: string
  hospital_name: string
  display_name: string
  role: UserRole
  is_active: boolean
}

//fetchUserManagementTransactionで取得したJSONのnormalize後の型定義
export type UserManagementType = {
  id: string
  hospitalName: string
  email: string
  displayName: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}
//fetchUserManagementTransactionで取得したJSONの型
export type UserManagementDBType = {
  id: string
  hospital_name: string
  email: string
  display_name: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}