import {
  CurrentUser,
  CurrentUserDB,
  UserManagementType,
  UserManagementDBType,
  CreateUserFrontType,
  UpdateUserFrontType,
  CreateUserBackType,
  UpdateUserBackType
} from "../types/userTypes"

// DB → UI（CurrentUser）
export const normalizeCurrentUser = (
                                      user: CurrentUserDB
                                    ): CurrentUser => ({
                                      id: user.id,
                                      email: user.email,
                                      hospitalId: user.hospital_id,
                                      hospitalName: user.hospital_name,
                                      displayName: user.display_name,
                                      role: user.role,
                                      isActive: user.is_active
                                    })

// DB → UI（UserManagement）
export const normalizeUserManagement = (
                                      user: UserManagementDBType
                                    ): UserManagementType => ({
                                      id: user.id,
                                      hospitalName: user.hospital_name,
                                      email: user.email,
                                      displayName: user.display_name,
                                      role: user.role,
                                      isActive: user.is_active,
                                      createdAt: user.created_at,
                                      updatedAt: user.updated_at
                                    })

// Create
export const toAddUserRequest = (
                                  user: CreateUserFrontType
                                ): CreateUserBackType => ({
                                  hospital_id: user.hospitalId,
                                  email: user.email,
                                  display_name: user.displayName,
                                  role: user.role,
                                  is_active: user.isActive
                                })

// Update
export const toUpdateUserRequest = (
                                      user: UpdateUserFrontType
                                    ): UpdateUserBackType => ({
                                      id: user.id,
                                      role: user.role,
                                      is_active: user.isActive
                                    })