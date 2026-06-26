"use client"
import { CurrentUser }from "../types/userTypes"
import { normalizeUser }from "../utils/userMapper"
import {
          createContext,
          useContext,
          useState, 
          useEffect
        } from "react"
import { fetchCurrentUser } from "../api/auth/fetchCurrentUser"


type AuthContextType = {
                        currentUser:CurrentUser | null | undefined
                        setCurrentUser:React.Dispatch<
                                                      React.SetStateAction<CurrentUser | null | undefined>
                                                      >
                      }
// ログイン中ユーザー情報をアプリ全体で共有するContext。
// hospital_id や role 判定、権限制御などに使用する。
const AuthContext =createContext<AuthContextType | undefined>(undefined)


export function AuthProvider({children}: {children: React.ReactNode})
{
const [currentUser,setCurrentUser] =
  useState<CurrentUser | null | undefined>(
    undefined
  )

useEffect(() => {

  const restoreSession = async () => {
    console.log("restoreSession start")
    const user =
      await fetchCurrentUser()

/*     if (!user) {
      localStorage.removeItem(
        "access_token"
      )
      setCurrentUser(null)
      return
    } */

    setCurrentUser(
      normalizeUser(user)
    )
  }

  restoreSession()

}, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {

  const context =
    useContext(AuthContext)

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    )
  }

  return context
}