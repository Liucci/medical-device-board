"use client"

import { useState ,useEffect} from "react"
import { useRouter } from "next/navigation"
import { CurrentUser } from "../types/userTypes"

//import { useAuth }from "../contexts/AuthContext"
import { loginTransaction } from "../api/transactions/auth/loginTransaction"
import {executeWithLoading} from "../components/common/executeWithLoading"
import { executeWithErrorAndLoading } from "../components/common/executeWithErrorAndLoading"

import {LoadingOverlay} from "../components/common/LoadingOverlay"

export default function LoginPage() {

  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

    const [currentUser, setCurrentUser] =useState<CurrentUser | null | undefined>(undefined)
    const [accessToken, setAccessToken] =useState<string | null>(null)
  
  // const {
  //         currentUser,
  //         setCurrentUser,
  //         setAccessToken,
  // } = useAuth()

  //backendの/loginを呼び出す
const handleLogin = async () => {

  setError("")
  await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
          
          try {

            const currentUser =
              await loginTransaction({
                                        email,
                                        password,
                                        setCurrentUser,
                                        //setAccessToken,
                                      })

            if (currentUser.role === "system_admin") {
              router.push("/system-admin")
              return
            }

            router.push("/dashboard")

          } 
          catch (err) {
              console.error(err)

              if (err instanceof Error) {
                  setError(err.message)
                  return
              }

              setError("ログイン失敗")
          }          
          finally {
          }
        }
        })


}  


 return (
    <>
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-50
        px-4
      "
    >

      <div
        className="
          bg-white
          p-8
          rounded-2xl
          shadow-xl
          w-full
          max-w-md
        "
      >

        {/* アプリアイコン */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="Medical Device Board"
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* アプリ名 */}
        <div className="text-center mb-7">
          <div className="text-3xl font-bold text-gray-800">
            Devix
          </div>
          <div className="text-sm text-gray-400 mt-1">
            医療機器管理デジタルホワイトボード
          </div>
        </div>

        {/* ログインタイトル */}
        <h1
          className="
            text-xl
            font-bold
            mb-6
            text-center
            text-gray-700
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

        <LoadingOverlay loading={loading} /> 
</>

  )
}