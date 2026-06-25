import { login } from "../../auth/login"
import { fetchCurrentUser } from "../../auth/fetchCurrentUser"

import { normalizeUser } from "../../../utils/userMapper"

type LoginTransactionParams = {
                                  email:string
                                  password:string
                                  setCurrentUser:any
                                }

export const loginTransaction = async ({
                                          email,
                                          password,
                                          setCurrentUser
                                        }: LoginTransactionParams) => {

  const loginResponse =
    await login(
                  email,
                  password
               )

    console.log(
    "[LOGIN] refresh_token",
    loginResponse.refresh_token.slice(0, 12)
  )             

  localStorage.setItem(
                        "access_token",
                        loginResponse.access_token
                      )

  localStorage.setItem(
                        "refresh_token",
                        loginResponse.refresh_token
                      )
  console.log(
    "[LOGIN] localStorage",
    localStorage.getItem("refresh_token")?.slice(0, 12)
  )
  const currentUserDB =
    await fetchCurrentUser()

  if (!currentUserDB) {
    throw new Error("Failed to fetch current user")
  }

  const currentUser =
    normalizeUser(
                    currentUserDB
                 )

  setCurrentUser(currentUser)

  return currentUser
}