import { login } from "../../auth/login"
import { fetchCurrentUser } from "../../auth/fetchCurrentUser"

import { normalizeCurrentUser } from "../../../utils/userMapper"

type LoginTransactionParams = {
                                email: string
                                password: string
                                setCurrentUser: any
                                //setAccessToken: any
}
//accessTokenのsetは不要
export const loginTransaction = async ({
                                        email,
                                        password,
                                        setCurrentUser,
                                        //setAccessToken,
                              }: LoginTransactionParams) => 
{
  console.log("loginTransaction")
  const loginResponse =await login(
                                    email,
                                    password
  )
  // access tokenをFrontendのStateへ保存
  //setAccessToken(loginResponse.access_token)
  const currentUserDB =await fetchCurrentUser()
  //console.log(currentUserDB)
  if (!currentUserDB) {
                        throw new Error(
                          "Failed to fetch current user"
                        )
  }
  const currentUser =normalizeCurrentUser(currentUserDB)
  setCurrentUser(currentUser)
  return currentUser
}