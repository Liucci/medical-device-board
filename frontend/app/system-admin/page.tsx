"use client"

import { useEffect,useState } from "react"
import { useRouter } from "next/navigation"
import { CurrentUser } from "../types/userTypes"
import { fetchCurrentUser } from "../api/auth/fetchCurrentUser"
import { normalizeCurrentUser } from "../mapper/userMapper"
import { LoadingOverlay } from "../components/common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../components/common/executeWithErrorAndLoading"

export default function SystemAdminPage() 
{
    const router = useRouter()
    const [currentUser, setCurrentUser] =useState<CurrentUser | null | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    const init = async () => {
        const user = await fetchCurrentUser()
            if (!user) {
                setCurrentUser(null)
                return
            }
        setCurrentUser(normalizeCurrentUser(user))

    }
    //currentUser情報を取得
    useEffect(() => {
        init()
    }, [])

  useEffect(() => {

      if (currentUser === undefined) {return}
      if (currentUser === null) {
          router.replace("/login")
          return
      }
      if (currentUser.role !== "system_admin") {
          router.replace("/dashboard")
      }
  }, [currentUser, router])
  
  if (!currentUser) {return null}
  if (currentUser.role !== "system_admin") {return null}

  const handleLogout = async () => {
      router.push("/login")
  }

return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a122a] px-6 py-10 text-[#dbe1ff]">
        {/* 背景のグロー */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-400/15 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl">
            {/* ヘッダー */}
            <header className="mb-10 flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <p className="mb-2 text-sm font-medium tracking-[0.3em] text-[#75dfff]">
                        DEVIX
                    </p>
                    <h1 className="text-3xl font-bold tracking-wide text-white">
                        System Admin
                    </h1>
                    <p className="mt-2 text-sm text-[#9ba9c9]">
                        システム管理メニュー
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-[#c5d0eb] transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300"
                >
                    ログアウト
                </button>
            </header>

            {/* 管理メニュー */}
            <section>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-white">
                        Management
                    </h2>
                    <p className="mt-1 text-sm text-[#9ba9c9]">
                        管理する項目を選択してください
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* 初回管理者招待 */}
                    <button
                        onClick={() => router.push("/system-admin/first-admin-invite")}
                        className="group rounded-2xl border border-white/10 bg-[#131a33]/75 p-6 text-left shadow-lg shadow-black/10 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-[#192442] hover:shadow-cyan-500/10"
                    >
                        <h3 className="text-base font-semibold text-white">
                            初回管理者招待
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#9ba9c9]">
                            病院の初回管理者を招待します。
                        </p>
                    </button>

                    {/* 病院管理 */}
                    <button
                        onClick={() => router.push("/system-admin/hospital-management")}
                        className="group rounded-2xl border border-white/10 bg-[#131a33]/75 p-6 text-left shadow-lg shadow-black/10 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-[#192442] hover:shadow-cyan-500/10"
                    >
                        <h3 className="text-base font-semibold text-white">
                            病院管理
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#9ba9c9]">
                            登録病院の情報や利用状態を管理します。
                        </p>
                    </button>

                    {/* ユーザー管理 */}
                    <button
                        onClick={() => router.push("/system-admin/user-management")}
                        className="group rounded-2xl border border-white/10 bg-[#131a33]/75 p-6 text-left shadow-lg shadow-black/10 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-[#192442] hover:shadow-cyan-500/10"
                    >
                        <h3 className="text-base font-semibold text-white">
                            ユーザー管理
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#9ba9c9]">
                            登録ユーザーや権限を管理します。
                        </p>
                    </button>

                    {/* お知らせ管理 */}
                    <button
                        onClick={() => router.push("/system-admin/announce-management")}
                        className="group rounded-2xl border border-white/10 bg-[#131a33]/75 p-6 text-left shadow-lg shadow-black/10 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-[#192442] hover:shadow-cyan-500/10"
                    >
                        <h3 className="text-base font-semibold text-white">
                            お知らせ管理
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#9ba9c9]">
                            アプリ内のお知らせを管理します。
                        </p>
                    </button>

                    {/* 契約管理 */}
                    <button
                        onClick={() => router.push("/system-admin/subscription-management")}
                        className="group rounded-2xl border border-white/10 bg-[#131a33]/75 p-6 text-left shadow-lg shadow-black/10 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-[#192442] hover:shadow-cyan-500/10"
                    >
                        <h3 className="text-base font-semibold text-white">
                            契約管理
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#9ba9c9]">
                            病院ごとの契約情報を管理します。
                        </p>
                    </button>
                </div>
            </section>

            {/* フッター */}
            <footer className="mt-12 border-t border-white/10 pt-5 text-center text-xs text-[#71809f]">
                DEVIX System Administration
            </footer>
        </div>
    </div>
)    
}