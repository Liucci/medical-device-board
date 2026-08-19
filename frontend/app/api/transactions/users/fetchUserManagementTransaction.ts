import { getUserManagementFromApi } from "../../users/fetchUserManagement"

import { normalizeUserManagement } from "../../../utils/userMapper"
import { executeWithErrorAndLoading } from "../../../components/common/executeWithErrorAndLoading"
import { Dispatch, SetStateAction } from "react"

import {
  UserManagementDBType,
  UserManagementType
} from "../../../types/userTypes"

type FetchUserManagementTransactionParams = {
    setUsers: Dispatch<SetStateAction<UserManagementType[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export async function fetchUserManagementTransaction({
    setUsers,
    setLoading,
}: FetchUserManagementTransactionParams) {

    console.log("fetchUserManagementTransaction")

    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {

            const users = await getUserManagementFromApi()

            setUsers(
                users.map(normalizeUserManagement)
            )
        }
    })
}