import { login } from "../../auth/login"
import { fetchCurrentUser } from "../../auth/fetchCurrentUser"

import { normalizeCurrentUser } from "../../../mapper/userMapper"

type LoginTransactionParams = {
                                email: string
                                password: string
                                setCurrentUser: any
}
export const loginTransaction = async ({
                                        email,
                                        password,
                                        setCurrentUser,
                              }: LoginTransactionParams) => 
{
  console.log("loginTransaction")
  const loginResponse =await login(
                                    email,
                                    password
  )
  const currentUserDB =await fetchCurrentUser()
  if (!currentUserDB) {
                        throw new Error(
                          "Failed to fetch current user"
                        )
  }
  const currentUser =normalizeCurrentUser(currentUserDB)
  setCurrentUser(currentUser)
  return currentUser
}