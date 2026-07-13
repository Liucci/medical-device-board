"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AccountEditForm() {

  const [displayName, setDisplayName] = useState("")
  const [email] = useState("sample@example.com")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {

    if (displayName.trim() === "") {
      alert("ユーザー名を入力してください")
      return
    }

    if (password !== confirmPassword) {
      alert("パスワードが一致しません")
      return
    }

    setLoading(true)

    try {

            await updateMyAccountTransaction({
                displayName,
                password
            })
    } finally {

      setLoading(false)

    }

  }

  return (

    <div
      className="
        mx-auto
        mt-10
        w-full
        max-w-md
        rounded-xl
        bg-white
        shadow-xl
      "
    >

      {/* Header */}
      <div
        className="
          border-b
          px-8
          py-6
        "
      >

        <h2 className="text-center text-2xl font-bold">
          アカウント編集
        </h2>

      </div>

      {/* Body */}
      <div
        className="
          space-y-4
          px-8
          py-6
        "
      >

        <div>

          <div className="mb-1 text-sm">
            ユーザー名
          </div>

          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="
              w-full
              rounded
              border
              border-gray-300
              px-3
              py-2
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
            新しいパスワード
          </div>

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="
              w-full
              rounded
              border
              border-gray-300
              px-3
              py-2
            "
          />

        </div>

        <div>

          <div className="mb-1 text-sm">
            パスワード確認
          </div>

          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="
              w-full
              rounded
              border
              border-gray-300
              px-3
              py-2
            "
          />

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
        onClick={() => router.push("/login")}
          className="
            rounded-lg
            bg-gray-300
            px-4
            py-2
            hover:bg-gray-400
          "
        >
          キャンセル
        </button>

        <button
          onClick={handleSubmit}
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
          {loading ? "保存中..." : "保存"}
        </button>

      </div>

    </div>

  )

}