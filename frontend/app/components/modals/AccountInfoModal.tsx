"use client"

import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import { createAccountEditCodeTransaction } from "../../api/transactions/accountEdits/createAccountEditTransaction"


type Props = {
  isOpen: boolean
  onClose: () => void
  userName: string
  role: string
  hospitalName: string
  email: string
  userId: string
}

export default function AccountInfoModal({
  isOpen,
  onClose,
  userName,
  userId,
  role,
  hospitalName,
  email
}: Props) {

  const [loading, setLoading] = useState(false)

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
  return createPortal(

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/30
        p-4
      "
    >

      <div
        className="
          relative
          flex
          max-h-[70vh]
          w-full
          max-w-md
          flex-col
          rounded-xl
          bg-white
          shadow-xl
        "
      >

        {/* Header */}
        <div
          className="
            relative
            border-b
            px-8
            pt-8
            pb-6
          "
        >

          <button
            onClick={onClose}
            className="
              absolute
              left-4
              top-4
              text-2xl
              text-gray-500
              hover:text-black
            "
          >
            ×
          </button>

          <h2 className="text-center text-2xl font-bold">
            アカウント情報
          </h2>

        </div>

        {/* Body */}
        <div
          className="
            flex-1
            space-y-4
            overflow-y-auto
            px-8
            py-6
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
        >

          <div>

            <div className="mb-1 text-sm">
              ユーザー名
            </div>

            <input
              value={userName}
              readOnly
              className="
                w-full
                rounded
                border
                border-gray-300
                bg-gray-100
                px-3
                py-2
                text-gray-600
              "
            />

          </div>

          <div>

            <div className="mb-1 text-sm">
              メールアドレス
            </div>

            <input
              value={email}
              readOnly
              className="
                w-full
                rounded
                border
                border-gray-300
                bg-gray-100
                px-3
                py-2
                text-gray-600
              "
            />

          </div>

          <div>

            <div className="mb-1 text-sm">
              所属病院
            </div>

            <input
              value={hospitalName}
              readOnly
              className="
                w-full
                rounded
                border
                border-gray-300
                bg-gray-100
                px-3
                py-2
                text-gray-600
              "
            />

          </div>

          <div>

            <div className="mb-1 text-sm">
              権限
            </div>

            <input
              value={role}
              readOnly
              className="
                w-full
                rounded
                border
                border-gray-300
                bg-gray-100
                px-3
                py-2
                text-gray-600
              "
            />

          </div>

          <div>

            <div className="mb-1 text-sm">
              ユーザーID
            </div>

            <input
              value={userId}
              readOnly
              className="
                w-full
                rounded
                border
                border-gray-300
                bg-gray-100
                px-3
                py-2
                text-gray-600
              "
            />

          </div>

          <div
            className="
              rounded-lg
              bg-blue-50
              p-4
              text-sm
              leading-6
              text-gray-700
            "
          >

            アカウント情報を編集するには、
            「編集する」を押してください。
            編集用URLを登録済みメールアドレスへ送信します。

          </div>

        </div>

        {/* Footer */}
        <div
          className="
            flex
            justify-end
            gap-4
            rounded-b-xl
            border-t
            bg-white
            px-8
            py-6
          "
        >

          <button
            onClick={onClose}
            className="
              rounded-lg
              bg-gray-300
              px-4
              py-2
              hover:bg-gray-400
            "
          >
            閉じる
          </button>

          <button
            onClick={handleEdit}
            disabled={loading}
            className="
              rounded-lg
              bg-blue-500
              px-4
              py-2
              text-white
              hover:bg-blue-600
              disabled:bg-gray-400
            "
          >
            {loading ? "送信中..." : "編集する"}
          </button>

        </div>

      </div>

    </div>,
    document.body

  )

}