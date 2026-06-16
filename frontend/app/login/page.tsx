"use client"

import { useState ,useEffect} from "react"
import { useRouter } from "next/navigation"
import { useAuth }from "../contexts/AuthContext"
import { normalizeUser} from "../utils/userMapper"
import { login } from "../api/auth/login"
export default function LoginPage() {

  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { currentUser, setCurrentUser } = useAuth()

  //backendの/loginを呼び出す
  const handleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      //backendの/login
      const data = await login(
          email,
          password
        )
      //console.log(data)
      if (!data.success) {
                          setError(data.error)
                          setLoading(false)
                          return
                        }
      //backendからのcurrentUser情報をsetCurrentUserに格納
      const currentUser =data.current_user
      setCurrentUser(normalizeUser(currentUser))
      // token保存
      localStorage.setItem("access_token",data.access_token)
      localStorage.setItem("refresh_token",data.refresh_token)
      if (
        currentUser.role=== "system_admin"
      ) {
        router.push("/admin")
        return
      }
      router.push("/dashboard")
    } catch (err) {console.error(err)
      setError("ログイン失敗")
    } finally {setLoading(false)
    }
  }
    //normalizeしたcurrentUserの内容を確認するため
/*   useEffect(() => {
  console.log("dashboard currentUser:",currentUser)
  }, [currentUser]) */

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