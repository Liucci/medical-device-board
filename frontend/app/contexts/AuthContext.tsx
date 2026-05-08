"use client"
//
import {
  createContext,
  useContext,
  useState
} from "react"

type CurrentUser = {

  id: string

  hospital_id: string

  display_name: string

  role: "admin" | "user"

  is_active: boolean
}

type AuthContextType = {

  currentUser: CurrentUser | null

  setCurrentUser:
    React.Dispatch<
      React.SetStateAction<CurrentUser | null>
    >
}
// ログイン中ユーザー情報をアプリ全体で共有するContext。
// hospital_id や role 判定、権限制御などに使用する。
const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  )

export function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {

  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null)

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
// AuthContextから
// currentUser を取得するためのhook。
// app内の各componentで使用する。
export function useAuth() {

  const context = useContext(AuthContext)

  if (!context) {

    throw new Error(
      "useAuth must be used within AuthProvider"
    )
  }

  return context
}