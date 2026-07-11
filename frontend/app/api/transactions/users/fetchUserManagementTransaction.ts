import { getUserManagementFromApi } from "../../users/fetchUserManagement"

import { normalizeUserManagement } from "../../../utils/userMapper"

import {
  UserManagementDBType,
  UserManagementType
} from "../../../types/userTypes"

export async function fetchUserManagementTransaction(): Promise<UserManagementType[]> {

  console.log("fetchUserManagementTransaction")

  const users: UserManagementDBType[] = await getUserManagementFromApi()

  return users.map(normalizeUserManagement)
}