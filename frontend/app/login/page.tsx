"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabase"
import { useAuth }from "../contexts/AuthContext"

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { setCurrentUser } = useAuth()
  const handleLogin = async () => {

    setLoading(true)
    setError("")

    // ログイン
    const {
        data,
        error
    } = await supabase.auth.signInWithPassword({

        email,
        password
    })

    if (error) {

        console.error(error)

        setError(
        "メールアドレスまたはパスワードが違います"
        )

        setLoading(false)

        return
    }

    // auth user取得
    const authUser = data.user

    if (!authUser) {

        setError("ユーザー取得失敗")

        setLoading(false)

        return
    }

    // public.users取得
    const {
        data: userData,
        error: userError
    } = await supabase

        .from("users")

        .select(`
        id,
        hospital_id,
        display_name,
        role,
        is_active
        `)

        .eq("id", authUser.id)

        .single()

    if (userError || !userData) {

        console.error(
        JSON.stringify(userError, null, 2)
        )
        setError(
        "ユーザー情報取得失敗"
        )

        setLoading(false)

        return
    }

    // 無効ユーザー
    if (!userData.is_active) {

        setError(
        "このアカウントは無効化されています"
        )

        setLoading(false)

        return
    }

    console.log("login user:", userData)
    
    setCurrentUser(userData)
    router.push("/dashboard")
  }
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
      "
    >

      <div
        className="
          bg-white
          p-8
          rounded-xl
          shadow-xl
          w-full
          max-w-md
        "
      >

        <h1
          className="
            text-2xl
            font-bold
            mb-6
            text-center
          "
        >
          ログイン
        </h1>

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="
            w-full
            border
            rounded
            px-3
            py-2
            mb-4
          "
        />

        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="
            w-full
            border
            rounded
            px-3
            py-2
            mb-4
          "
        />

        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full
            bg-blue-500
            hover:bg-blue-600
            text-white
            py-2
            rounded
          "
        >
          {loading
            ? "ログイン中..."
            : "ログイン"}
        </button>

      </div>
    </div>
  )
}