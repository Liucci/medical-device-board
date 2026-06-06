export type UserRole =
  | "viewer"
  | "normal"
  | "admin"
  | "support"
  | "system_admin"

// DB型
export type CurrentUserDB = {
  id?: string
  hospital_id?: string
  display_name: string
  role: UserRole
  is_active: boolean |true
}

// UI型
export type CurrentUser = {
  id: string
  hospitalId: string
  displayName: string
  role: UserRole
  isActive: boolean  |true
}