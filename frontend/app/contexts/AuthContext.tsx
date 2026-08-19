"use client"
import { CurrentUser }from "../types/userTypes"
import { normalizeCurrentUser }from "../utils/userMapper"
import {
          createContext,
          useContext,
          useState, 
          useEffect
        } from "react"
import { fetchCurrentUser } from "../api/auth/fetchCurrentUser"
import {startAutoRefreshToken,stopAutoRefreshToken} from "../contexts/autoRefreshToken"

type AuthContextType = {
                        currentUser:CurrentUser | null | undefined
                        setCurrentUser:React.Dispatch<
                                                      React.SetStateAction<CurrentUser | null | undefined>
                                                      >
                        accessToken: string | null
                        setAccessToken: React.Dispatch<
                                                        React.SetStateAction<string | null>
                                                      >
                      }
// ログイン中ユーザー情報をアプリ全体で共有するContext。
// hospital_id や role 判定、権限制御などに使用する。
const AuthContext =createContext<AuthContextType | undefined>(undefined)


export function AuthProvider({children}: {children: React.ReactNode})
{
const [currentUser,setCurrentUser] =useState<CurrentUser | null | undefined>(undefined)
const [accessToken, setAccessToken] =useState<string | null>(null)

useEffect(() => {
  const restoreSession = async () => {
    try {
      const user = await fetchCurrentUser()

      if (!user) {
        setAccessToken(null)
        setCurrentUser(null)
        return
      }
      setAccessToken(user.access_token)
      setCurrentUser(normalizeCurrentUser(user))
    } catch (error) {
      setAccessToken(null)
      setCurrentUser(null)
    }
  }
    restoreSession()
}, [])

useEffect(() => {

  if(!currentUser || !accessToken) {
    stopAutoRefreshToken()
    return
  }

  startAutoRefreshToken(
    accessToken,
    setAccessToken
  )
  return () => {
    stopAutoRefreshToken()
  }

}, [currentUser, accessToken])


/*
 //debug用
  useEffect(() => {
    console.log(
      "[AUTH] accessToken:",
      accessToken
        ? accessToken.slice(0, 20) + "..."
        : null
    )
  }, [accessToken]) 
  */

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        accessToken,
        setAccessToken
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {

  const context =useContext(AuthContext)

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    )
  }

  return context
}