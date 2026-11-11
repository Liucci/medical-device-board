
"use client"

import { useEffect,useRef, useState, type FormEvent } from "react"
import Link from "next/link"

import { executeWithErrorAndLoading } from "../../../app/components/common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../../../app/components/common/LoadingOverlay"
import { updatePasswordResetTransaction } from "../../api/transactions/passwordReset/updatePasswordResetTransaction"
import { initPasswordResetPageTransaction } from "../../api/transactions/passwordReset/initPasswordResetPageTransaction"

export default function PasswordResetPage() {
    console.log("PasswordResetPage")

    const [code, setCode] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [notice, setNotice] = useState("")
    const [loading, setLoading] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)



    const hasMinLength = password.length >= 6
    const hasAlphabet = /[a-zA-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const isValidPassword = hasMinLength && hasAlphabet && hasNumber
    const isMatched = password === confirmPassword
    const canSubmit = Boolean(code) && isValidPassword && confirmPassword.length > 0 && isMatched && !isCompleted

    const [email, setEmail] = useState("")
    const initialized = useRef(false)

    const init = async () => {
        console.log("PasswordResetPage init")

        const params = new URLSearchParams(window.location.search)
        const resetCode = params.get("code") ?? ""

        setCode(resetCode)

        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {
                const result = await initPasswordResetPageTransaction(resetCode)
                setEmail(result.email)
            }
        })
    }

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true
        void init()
    }, [])



    // パスワード変更
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log("PasswordResetPage handleSubmit")

        if (!canSubmit) return

        try {
            await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                    await updatePasswordResetTransaction({
                        code,
                        newPassword: password
                    })

                    setIsCompleted(true)
                    setNotice("パスワードを変更しました。新しいパスワードでログインしてください。")
                }
            })
        } catch {
            return
        }
    }

    const PasswordRule = ({ valid, label }: { valid: boolean, label: string }) => (
        <div className={`flex items-center gap-2 text-xs transition-colors ${valid ? "text-[#5eead4]" : "text-[#8190af]"}`}>
            <span className="flex h-4 w-4 items-center justify-center rounded-full border text-[10px]"
                style={{ borderColor: valid ? "#5eead4" : "#647392" }}>
                {valid ? "✓" : ""}
            </span>
            {label}
        </div>
    )

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a122a] px-4 py-10 text-[#dbe1ff]">
            <LoadingOverlay loading={loading} message="パスワードを変更しています..." />

            {/* Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 h-[840px] w-[840px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00d2ff]/10 blur-[160px]" />
                <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#abc7ff]/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_45%,rgba(67,143,255,0.07),transparent_100%)]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="rounded-[2rem] border border-white/10 bg-[#131a33]/75 p-7 shadow-[0_24px_80px_-24px_rgba(0,210,255,0.18)] backdrop-blur-xl sm:p-9">

                    {/* Logo */}
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

                    {/* Brand */}
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

                    {/* Heading */}
                    {isCompleted ? (
                        <div className="py-8 text-center">
                            <div className="mb-5 text-5xl text-[#5eead4]">
                                ✓
                            </div>
                            <h2 className="mb-4 text-2xl font-bold text-white">
                                パスワード変更完了
                            </h2>
                            <p className="text-sm leading-7 text-[#9ba9c9]">
                                パスワードの変更が正常に完了しました。
                                <br />
                                新しいパスワードでログインしてください。
                            </p>
                            <Link
                                href="/login"
                                className="mt-8 inline-block rounded-xl bg-gradient-to-r from-[#00bde8] to-[#528dff] px-8 py-3 text-sm font-bold text-white transition-all hover:brightness-110"
                            >
                                ログイン画面へ
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-7 text-center">
                                <h2 className="mb-3 text-xl font-semibold text-[#dbe1ff]">
                                    新しいパスワードの設定
                                </h2>
                                <p className="text-sm leading-7 text-[#9ba9c9]">
                                    新しいパスワードを設定してください。
                                    <br />
                                    確認のため、同じパスワードを2回入力してください。
                                </p>
                                <p className="mb-3 text-sm text-[#a5e7ff]">
                                    {email}
                                </p>
                            </div>

                            {/* 既存のパスワード入力フォーム */}
                        </>
                    )}

                    {/* Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* New Password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#c4d0ed]">
                                新しいパスワード
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value.replace(/[^\x21-\x7E]/g, ""))
                                        setNotice("")
                                    }}
                                    autoComplete="new-password"
                                    required
                                    disabled={isCompleted}
                                    placeholder="新しいパスワードを入力"
                                    className="w-full rounded-xl border border-white/10 bg-[#0a122a]/70 px-4 py-3 pr-16 text-sm text-white outline-none transition-all placeholder:text-[#647392] focus:border-[#47d6ff]/60 focus:ring-2 focus:ring-[#47d6ff]/10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isCompleted}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#8fa2c7] transition-colors hover:text-[#a5e7ff]"
                                >
                                    {showPassword ? "非表示" : "表示"}
                                </button>
                            </div>

                            {/* Password Rules */}
                            <div className="mt-3 rounded-xl border border-white/5 bg-[#0a122a]/40 px-4 py-3">
                                <p className="mb-3 text-xs font-medium tracking-wide text-[#a5e7ff]">
                                    パスワードの設定条件
                                </p>

                                <div className="space-y-2">
                                    <PasswordRule valid={hasMinLength} label="6文字以上" />
                                    <PasswordRule valid={hasAlphabet} label="英字を1文字以上含む" />
                                    <PasswordRule valid={hasNumber} label="数字を1文字以上含む" />
                                </div>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#c4d0ed]">
                                新しいパスワード（確認）
                            </label>

                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(event) => {
                                        setConfirmPassword(event.target.value.replace(/[^\x21-\x7E]/g, ""))
                                        setNotice("")
                                    }}
                                    autoComplete="new-password"
                                    required
                                    disabled={isCompleted}
                                    placeholder="もう一度入力してください"
                                    className="w-full rounded-xl border border-white/10 bg-[#0a122a]/70 px-4 py-3 pr-16 text-sm text-white outline-none transition-all placeholder:text-[#647392] focus:border-[#47d6ff]/60 focus:ring-2 focus:ring-[#47d6ff]/10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={isCompleted}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#8fa2c7] transition-colors hover:text-[#a5e7ff]"
                                >
                                    {showConfirmPassword ? "非表示" : "表示"}
                                </button>
                            </div>

                            {confirmPassword.length > 0 && (
                                <p className={`mt-2 text-xs ${isMatched ? "text-[#5eead4]" : "text-[#fb9292]"}`}>
                                    {isMatched ? "✓ パスワードが一致しています" : "パスワードが一致していません"}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={!canSubmit || loading}
                            className="mt-3 w-full rounded-xl bg-gradient-to-r from-[#00bde8] to-[#528dff] px-4 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_8px_28px_-8px_rgba(0,210,255,0.45)] transition-all hover:brightness-110 hover:shadow-[0_8px_32px_-6px_rgba(0,210,255,0.6)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                        >
                            {isCompleted ? "パスワード変更完了" : "パスワードを変更する"}
                        </button>

                        {notice && (
                            <div
                                role="status"
                                className="rounded-xl border border-[#47d6ff]/20 bg-[#47d6ff]/10 px-4 py-3 text-center text-xs leading-6 text-[#a5e7ff]"
                            >
                                {notice}
                            </div>
                        )}

                        {!code && (
                            <div
                                role="alert"
                                className="rounded-xl border border-[#fb9292]/20 bg-[#fb9292]/10 px-4 py-3 text-center text-xs leading-6 text-[#fb9292]"
                            >
                                認証コードを取得できません。メール内のリンクから再度アクセスしてください。
                            </div>
                        )}
                    </form>

                    {/* Back to Login */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-[#9ba9c9] transition-colors hover:text-[#a5e7ff]"
                        >
                            ログイン画面に戻る
                        </Link>
                    </div>
                </div>

                {/* Footer */}
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
    )
}
