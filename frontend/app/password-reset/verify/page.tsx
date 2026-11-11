
"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../../components/common/LoadingOverlay"
import { sendPasswordResetMailTransaction } from "../../api/transactions/passwordReset/sendPasswordResetMailTransaction"

export default function PasswordResetVerifyPage() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState<string | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const initialized = useRef(false)

    const init = async () => {
        console.log("PasswordResetVerifyPage init")
        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {
                const result = await sendPasswordResetMailTransaction()
                setEmail(result.email)
                setIsCompleted(true)
            }
        })
    }

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true
        void init()
    }, [])

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

                        <div className="mb-6 text-center">
                            {isCompleted ? (
                                <>
                                    <div className="mb-4 flex justify-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00d2ff]/10 ring-1 ring-[#00d2ff]/30">
                                            <svg
                                                className="h-9 w-9 text-[#47d6ff]"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="m5 12 4 4L19 6" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h2 className="mb-4 text-xl font-semibold text-white">
                                        本人確認が完了しました
                                    </h2>
                                    <p className="text-sm leading-7 text-[#9ba9c9]">
                                        ご本人確認が正常に完了しました。
                                        <br />
                                        ご登録のメールアドレス宛に、運営からパスワード変更のご案内をお送りしました。
                                        <br />
                                        メールをご確認のうえ、案内に従ってパスワードを変更してください。
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="mb-3 text-xl font-semibold text-[#dbe1ff]">
                                        メールアドレスの確認
                                    </h2>
                                    <p className="text-sm leading-7 text-[#9ba9c9]">
                                        ご本人確認のための処理を開始しています。
                                        <br />
                                        そのまましばらくお待ちください。
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="rounded-xl border border-[#47d6ff]/15 bg-[#0a122a]/50 px-4 py-4 text-center">
                            <p className="text-xs font-medium tracking-wider text-[#a5e7ff]">
                                EMAIL VERIFICATION
                            </p>
                            <p className="mt-3 text-xs text-[#9ba9c9]">
                                本人確認対象のメールアドレス
                            </p>
                            <p className="mt-2 break-all text-sm font-semibold text-white">
                                {email ?? "確認中..."}
                            </p>
                        </div>

                        <div className="mt-8 text-center">
                            <Link
                                href="/login"
                                className="text-sm font-medium text-[#9ba9c9] transition-colors hover:text-[#a5e7ff]"
                            >
                                ログイン画面に戻る
                            </Link>
                        </div>
                    </div>

                    <footer className="pt-6 text-center text-xs leading-6 text-[#9ba9c9]">
                        <nav
                            aria-label="関連ページ"
                            className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2"
                        >
                            <Link href="/" className="transition-colors hover:text-[#a5e7ff]">
                                トップページ
                            </Link>
                            <Link href="/terms" className="transition-colors hover:text-[#a5e7ff]">
                                利用規約
                            </Link>
                            <Link href="/privacy" className="transition-colors hover:text-[#a5e7ff]">
                                プライバシーポリシー
                            </Link>
                            <Link href="/contact" className="transition-colors hover:text-[#a5e7ff]">
                                お問い合わせ
                            </Link>
                        </nav>
                    </footer>
                </div>
            </div>

            <LoadingOverlay loading={loading} message="本人確認中..." />
        </>
    )
}

