"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {inviteFirstAdminTransaction} from "../api/transactions/invites/inviteFirstAdminTransaction"

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
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
      "
    >

      <div
        className="
          bg-white
          p-8
          rounded-xl
          shadow-xl
          w-full
          max-w-md
        "
      >

        <h1
          className="
            text-2xl
            font-bold
            mb-6
            text-center
          "
        >
          初回管理者招待
        </h1>

        <div className="mb-4">
          <div className="mb-1">
            病院名
          </div>

          <input
            type="text"
            value={hospitalName}
            onChange={(e) =>
              setHospitalName(
                e.target.value
              )
            }
            className="
              w-full
              border
              rounded
              px-3
              py-2
            "
            placeholder="病院名"
          />
        </div>

        <div className="mb-6">
          <div className="mb-1">
            メールアドレス
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="
              w-full
              border
              rounded
              px-3
              py-2
            "
            placeholder="メールアドレス"
          />
        </div>

        {
          error &&
          (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )
        }

        {
          successMessage &&
          (
            <div className="text-green-600 mb-4">
              {successMessage}
            </div>
          )
        }

        <button
          onClick={handleInvite}
          disabled={loading}
          className="
            w-full
            bg-blue-500
            hover:bg-blue-600
            text-white
            py-2
            rounded
          "
        >
          {
            loading
            ? "送信中..."
            : "招待メール送信"
          }
        </button>

        <button
          onClick={() => router.push("/login")}
          className="
            mt-4
            w-full
            border
            py-2
            rounded
          "
        >
          ログイン画面へ戻る
        </button>

      </div>

    </div>
  )
}