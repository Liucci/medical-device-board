import {
  CurrentUser,
  CurrentUserDB,
  UserRole
} from "../types/userTypes"

// DB → UI
export const normalizeUser = (
  d: CurrentUserDB
): CurrentUser => {

  const allowedRoles: UserRole[] = [
    "viewer",
    "normal",
    "admin",
    "support",
    "system_admin"
  ]

  const role: UserRole =
    allowedRoles.includes(d.role)
      ? d.role
      : "viewer"

  return {
    id: d.id,
    hospitalId: d.hospital_id,
    displayName: d.display_name,
    role,
    isActive: d.is_active
  }
}

// UI → DB
export const toDBUser = (
  d: CurrentUser
): CurrentUserDB => ({
  id: d.id,
  hospital_id: d.hospitalId,
  display_name: d.displayName,
  role: d.role,
  is_active: d.isActive
})