import { login } from "../../auth/login"
import { fetchCurrentUser } from "../../auth/fetchCurrentUser"

import { normalizeCurrentUser } from "../../../utils/userMapper"
import { supabaseClient } from "../../client/supabaseClient"


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
  console.log("loginTransaction" )             
  const loginResponse =
    await login(
                  email,
                  password
               )

  console.log("set access_token in localStorege" )             
  console.log("set refresh_token in localStorege" )             
  localStorage.setItem( "access_token", loginResponse.access_token)
  localStorage.setItem( "refresh_token", loginResponse.refresh_token)
  console.log( "[SAVED ACCESS TOKEN]",localStorage.getItem("access_token")?.slice(0, 12))
  console.log("[SAVED REFRESH TOKEN]",localStorage.getItem("refresh_token")?.slice(0, 12))  
  const currentUserDB =await fetchCurrentUser()

  if (!currentUserDB) {
    throw new Error("Failed to fetch current user")
  }

  const currentUser =
    normalizeCurrentUser(
                    currentUserDB
                 )

  setCurrentUser(currentUser)

  return currentUser
}