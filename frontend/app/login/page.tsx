"use client"

import { useState ,useEffect} from "react"
import { useRouter } from "next/navigation"
import { CurrentUser } from "../types/userTypes"
import Link from "next/link";

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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a122a] px-4 py-10 text-[#dbe1ff]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[840px] w-[840px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00d2ff]/10 blur-[160px]" />
          <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#abc7ff]/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_45%,rgba(67,143,255,0.07),transparent_100%)]" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-[2rem] border border-white/10 bg-[#131a33]/75 p-7 shadow-[0_24px_80px_-24px_rgba(0,210,255,0.18)] backdrop-blur-xl sm:p-9">
            <div className="mb-6 flex justify-center">
              <div className="group relative flex h-28 w-28 items-center justify-center rounded-[1.75rem] bg-[#171e37]/70 p-5 ring-1 ring-white/10 sm:h-32 sm:w-32">
                <div className="absolute inset-0 rounded-[1.75rem] bg-[#00d2ff]/10 blur-2xl transition-all duration-700 group-hover:bg-[#00d2ff]/20" />
                <img
                  src="/logo.png"
                  alt="DEVIX Medical System Identity"
                  className="relative h-full w-full object-contain"
                  style={{ filter: "drop-shadow(0 0 24px rgba(165,231,255,0.6))" }}
                />
              </div>
            </div>

            <div className="mb-8 text-center">
              <h1
                className="mb-3 text-4xl font-bold tracking-tight text-white md:text-[42px] md:leading-[50px]"
                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              >
                DEVIX
              </h1>
              <div className="mt-2 text-xs font-medium tracking-wider text-[#a5e7ff]/80 sm:text-sm">
                Medical Device Management &amp; Digital Whiteboard
              </div>
            </div>

            <h1 className="mb-6 text-center text-xl font-semibold text-[#dbe1ff]">
              ログイン
            </h1>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                void handleLogin()
              }}
              className="space-y-4"
            >
              <input
                type="email"
                autoComplete="email"
                placeholder="メールアドレス"
                aria-label="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-[#414754] bg-[#0a122a]/80 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#8b91a0] focus:border-[#47d6ff] focus:ring-2 focus:ring-[#00d2ff]/15"
              />

              <input
                type="password"
                autoComplete="current-password"
                placeholder="パスワード"
                aria-label="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-[#414754] bg-[#0a122a]/80 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#8b91a0] focus:border-[#47d6ff] focus:ring-2 focus:ring-[#00d2ff]/15"
              />

              {error && (
                <div role="alert" className="rounded-xl border border-[#ffb4ab]/20 bg-[#93000a]/20 px-4 py-3 text-sm text-[#ffb4ab]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#438fff] to-[#00d2ff] px-5 text-base font-semibold tracking-wide text-[#002959] shadow-[0_8px_30px_-4px_rgba(0,210,255,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_36px_-2px_rgba(0,210,255,0.6)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? "ログイン中..." : "ログイン / Login"}
              </button>
            </form>
            
          </div>
                  <footer className="pt-6 text-center text-xs leading-6 text-[#9ba9c9]">
          <nav
            aria-label="関連ページ"
            className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2"
          >
            <Link href="/" className="transition-colors hover:text-[#a5e7ff]">
              トップページ
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-[#a5e7ff]"
            >
              利用規約
            </Link>

            <Link
              href="/privacy"
              className="transition-colors hover:text-[#a5e7ff]"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-[#a5e7ff]"
            >
              お問い合わせ
            </Link>
          </nav>
        </footer>

        </div>
      </div>

      <LoadingOverlay loading={loading} />
    </>
  )  
}