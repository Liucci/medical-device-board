"use client"

import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import { createAccountEditCodeTransaction } from "../../api/transactions/accountEdits/createAccountEditTransaction"
import CommonModal from "../common/CommonModal"

type Props = {
  isOpen: boolean
  onClose: () => void
  userName: string
  role: string
  hospitalName: string
  email: string
}

export default function AccountInfoModal({
  isOpen,
  onClose,
  userName,
  role,
  hospitalName,
  email
}: Props) {
  const [loading, setLoading] = useState(false)
  const closeModal = () => {onClose()}

  useEffect(() => {
    if (!isOpen) return
  }, [isOpen])

  if (!isOpen) return null

  const handleEdit = async () => {
    console.log("handleEdit")

    setLoading(true)

    try {
      await createAccountEditCodeTransaction()

      alert("編集用URLを登録済みメールアドレスへ送信しました。")

      onClose()
    } catch (error) {
      console.error(error)
      alert("メール送信に失敗しました。")
    } finally {
      setLoading(false)
    }
  }

  return (
    <CommonModal
      open={isOpen}
      onClose={closeModal}
      title="アカウント情報"
      maxWidth="max-w-md"
    >
      {/* Body */}
      <div
        className="
          flex-1
          space-y-4
          overflow-y-auto
          px-4
          py-4
          sm:px-5
          sm:py-5
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {/* 基本情報 */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="text-xs font-bold tracking-wide text-slate-700">
              基本情報
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-xs font-medium text-slate-500">
                ユーザー名
              </span>
              <span className="min-w-0 truncate text-right text-sm font-bold text-slate-900">
                {userName}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-xs font-medium text-slate-500">
                メールアドレス
              </span>
              <span className="min-w-0 truncate text-right text-sm font-bold text-slate-900">
                {email}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-xs font-medium text-slate-500">
                所属病院
              </span>
              <span className="min-w-0 truncate text-right text-sm font-bold text-slate-900">
                {hospitalName}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-xs font-medium text-slate-500">
                権限
              </span>
              <span className="text-sm font-bold text-slate-900">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* 編集案内 */}
        <div className="rounded-lg border border-teal-100 bg-teal-50 px-4 py-3">
          <div className="text-xs font-bold text-teal-800">
            アカウント情報を編集
          </div>
          <div className="mt-1 text-[11px] leading-5 text-teal-700">
            編集する場合は「編集する」を押してください。
            登録済みのメールアドレスへ編集用URLを送信します。
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="
          flex
          gap-2
          border-t
          border-slate-200
          bg-white
          px-4
          py-3
          sm:justify-end
          sm:px-5
        "
      >
        <button
          type="button"
          onClick={closeModal}
          className="
            h-10
            flex-1
            rounded-lg
            border
            border-slate-200
            bg-slate-50
            px-4
            text-xs
            font-bold
            text-slate-700
            hover:bg-slate-100
            sm:flex-none
          "
        >
          閉じる
        </button>

        <button
          type="button"
          onClick={handleEdit}
          disabled={loading}
          className="
            h-10
            flex-1
            rounded-lg
            bg-teal-700
            px-4
            text-xs
            font-bold
            text-white
            hover:bg-teal-800
            disabled:cursor-not-allowed
            disabled:bg-slate-300
            sm:flex-none
          "
        >
          {loading ? "送信中..." : "編集する"}
        </button>
      </div>
    </CommonModal>
  )
}