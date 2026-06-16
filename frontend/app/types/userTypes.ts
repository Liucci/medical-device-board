export type UserRole =
  | "viewer"
  | "normal"
  | "admin"
  | "support"
  | "system_admin"

// DB型
export type CurrentUserDB = {
  id: string
  email: string
  hospital_id: string
  hospital_name: string
  display_name: string
  role: UserRole
  is_active: boolean
}

export type CurrentUser = {
  id: string
  email: string
  hospitalId: string
  hospitalName: string
  displayName: string
  role: UserRole
  isActive: boolean
}