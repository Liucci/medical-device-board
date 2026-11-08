
"use client"

import { useState } from "react"
import CommonModal from "../common/CommonModal"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string) => void
}

export default function PasswordResetRequestModal({
  isOpen,
  onClose,
  onSubmit
}: Props) {

  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail) return

    onSubmit(trimmedEmail)
  }

  return (
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
                "
              >
                キャンセル
              </button>

              <button
                type="submit"
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
                "
              >
                本人確認メールを送信
              </button>

            </div>

          </form>

        </div>
      </div>
    </CommonModal>
  )
}
