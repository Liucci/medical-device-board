"use client"
import { CurrentUser }from "../types/userTypes"
import { normalizeUser }from "../utils/userMapper"
import {
          createContext,
          useContext,
          useState, 
          useEffect
        } from "react"
import { supabase }from "../lib/supabase"


type AuthContextType = {

  currentUser:
    CurrentUser | null | undefined

  setCurrentUser:
    React.Dispatch<
      React.SetStateAction<
        CurrentUser | null | undefined
      >
  >}
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
    useState<
      CurrentUser | null | undefined
    >(undefined)
  useEffect(() => {
    const restoreSession = async () => {

      // 現在session取得
      const {
        data: { user }
      } = await supabase.auth.getUser()

      // 未login
  if (!user) {

    setCurrentUser(null)

    return
}
      // public.users取得
      const {
        data: userData,
        error
      } = await supabase
        .from("users")
        .select(`
          id,
          hospital_id,
          display_name,
          role,
          is_active
        `)
        .eq("id", user.id)
        .single()

      if (error || !userData) {
        console.error(error)
        return
      }
      // currentUser復元
      setCurrentUser(normalizeUser(userData))}
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