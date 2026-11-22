"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {inviteFirstAdminTransaction} from "../../api/transactions/invites/inviteFirstAdminTransaction"
import { LoadingOverlay } from "../../components/common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"

export default function FirstAdminInvitePage() {

  const router = useRouter()

  const [hospitalName, setHospitalName] = useState("")
  const [email, setEmail] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleInvite = async () => {

    setLoading(true)
    setError("")
    setSuccessMessage("")

    try {
    await inviteFirstAdminTransaction({
                                        invite: {
                                                hospitalName,
                                                email
                                                }
                                    })

      setSuccessMessage(
        "招待メールを送信しました。初回管理者に登録用メールが送信されます。"
      )

      setHospitalName("")
      setEmail("")

    } catch (err) {

      console.error(err)

      setError(
        "招待メール送信に失敗しました"
      )

    } finally {

      setLoading(false)

    }
  }

return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a122a] px-6 py-10 text-[#dbe1ff]">
        {/* 背景のグロー */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-400/15 blur-[120px]" />

        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#131a33]/80 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
            {/* ヘッダー */}
            <div className="mb-8 text-center">
                <p className="mb-2 text-sm font-medium tracking-[0.3em] text-[#75dfff]">
                    DEVIX
                </p>
                <h1 className="text-2xl font-bold text-white">
                    初回管理者招待
                </h1>
                <p className="mt-3 text-sm text-[#9ba9c9]">
                    病院の初回管理者を招待します。
                </p>
            </div>

            {/* 入力フォーム */}
            <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-[#c5d0eb]">
                    病院名
                </label>
                <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#0a122a]/80 px-4 py-3 text-white placeholder-[#71809f] outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                    placeholder="病院名"
                />
            </div>

            <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-[#c5d0eb]">
                    メールアドレス
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#0a122a]/80 px-4 py-3 text-white placeholder-[#71809f] outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                    placeholder="メールアドレス"
                />
            </div>

            {/* エラー・成功メッセージ */}
            {error && (
                <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm leading-relaxed text-emerald-300">
                    {successMessage}
                </div>
            )}

            {/* 招待メール送信 */}
            <button
                onClick={handleInvite}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-[#438fff] to-[#00d2ff] py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] hover:shadow-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? "送信中..." : "招待メール送信"}
            </button>

            {/* 戻るボタン */}
            <div className="mt-6 space-y-3">
                <button
                    onClick={() => router.push("/system-admin")}
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-medium text-[#c5d0eb] transition hover:border-cyan-400/40 hover:bg-white/10"
                >
                    メニュー画面へ戻る
                </button>

                <button
                    onClick={() => router.push("/login")}
                    className="w-full rounded-xl py-2 text-sm text-[#9ba9c9] transition hover:text-cyan-300"
                >
                    ログイン画面へ戻る
                </button>
            </div>
        </div>
    </div>
)  
}