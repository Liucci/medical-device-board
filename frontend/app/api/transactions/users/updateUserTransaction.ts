import { Dispatch, SetStateAction } from "react"
import { API_BASE_URL,  } from "../../client/apiClient"
import { getUserManagementFromApi } from "../../users/fetchUserManagement"
import {
  UserManagementType,
  UpdateUserFrontType
} from "../../../types/userTypes"
import {
  normalizeUserManagement,
  toUpdateUserRequest
} from "../../../utils/userMapper"

type UpdateUserTransactionParams = {
                        user: UpdateUserFrontType
                        setUsers: Dispatch<SetStateAction<UserManagementType[]>>
                        onClose?: () => void
                        }
export async function updateUserTransaction({
                                            user,
                                            setUsers,
                                            onClose
                                            }: UpdateUserTransactionParams)
{
  console.log("updateUserTransaction")
  await fetch(
                `${API_BASE_URL}/update-user`,
                                {
                                method: "POST",
                                headers: {"Content-Type": "application/json"},
                                credentials: "include",
                                body: JSON.stringify(toUpdateUserRequest(user))
                }
  )
  const users = await getUserManagementFromApi()
  setUsers(users.map(normalizeUserManagement))
  if (onClose) {onClose()}
}