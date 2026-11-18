
"use client"

import { useState } from "react"
import CommonModal from "../common/CommonModal"
import ConfirmModal from "../common/ConfirmModal"
import { createPasswordResetRequest } from "../../api/passwordReset/createPasswordResetRequest"
import { executeWithErrorAndLoading } from "../common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../common/LoadingOverlay"

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function PasswordResetRequestModal({
  isOpen,
  onClose
}: Props) {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  // パスワードリセット申請
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

  const trimmedEmail = email.trim()

  if (!trimmedEmail || loading) return

  try {
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        await createPasswordResetRequest(trimmedEmail)
      }
    })

    // LoadingOverlayの処理終了後に成功Popupを表示
    setIsSuccessModalOpen(true)

  } catch (error) {
    console.error("Password reset request failed:", error)
  }
}

  // 成功Popupを閉じる
  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false)
    setEmail("")
    onClose()
  }

  return (
    <>
      <CommonModal
        open={isOpen}
        onClose={onClose}
        title="パスワードリセット"
        maxWidth="max-w-md"
        mobilePosition="bottom"
      >
        <div className="w-full bg-slate-50 p-4 sm:p-5">

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-4 sm:p-5"
            >

              {/* ===================================================== */}
              {/* メールアドレス */}
              {/* ===================================================== */}

              <div>
                <h3 className="text-xs font-bold tracking-wide text-slate-700">
                  本人確認
                </h3>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  パスワードをリセットするため、
                  登録済みのメールアドレスを入力してください。
                  本人確認用のメールを送信します。
                </p>
              </div>

              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <label className="mb-2 block text-xs font-medium text-slate-500">
                  メールアドレス
                </label>

                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="登録済みのメールアドレス"
                  required
                  disabled={loading}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-slate-700
                    outline-none
                    transition-colors
                    focus:border-teal-500
                    focus:ring-2
                    focus:ring-teal-100
                    disabled:opacity-60
                  "
                />

              </section>

              {/* ===================================================== */}
              {/* ボタン */}
              {/* ===================================================== */}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="
                    h-10
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    text-xs
                    font-bold
                    text-slate-700
                    transition-colors
                    hover:bg-slate-100
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  キャンセル
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    h-10
                    rounded-lg
                    bg-teal-700
                    px-5
                    text-xs
                    font-bold
                    text-white
                    transition-colors
                    hover:bg-teal-800
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  本人確認メールを送信
                </button>

              </div>

            </form>

          </div>
        </div>
      </CommonModal>

      {/* ===================================================== */}
      {/* メール送信成功Popup */}
      {/* ===================================================== */}

      <ConfirmModal
        open={isSuccessModalOpen}
        onClose={handleSuccessClose}
        onConfirm={handleSuccessClose}
        title="メール送信完了"
        message="入力したメールアドレスに確認用のメールを送信しました。"
        subMessage="メールをご確認いただき、本文に記載されたリンクから本人確認を進めてください。"
        icon="success"
        buttonPattern="ok_only"
        confirmText="閉じる"
        confirmVariant="teal"
      />

      {/* ===================================================== */}
      {/* 処理中Overlay */}
      {/* ===================================================== */}

      <LoadingOverlay
        loading={loading}
        message="本人確認メールを送信しています..."
      />
    </>
  )
}
