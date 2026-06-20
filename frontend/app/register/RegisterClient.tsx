"use client"

import { API_BASE_URL } from "../api/client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { registerUserTransaction } from "../api/transactions/invites/registerUserTransaction"

import RegisterCompleteModal from "../components/modals/RegisterCompleteModal"

import { RegisteredUser } from "../types/registerTypes"

type RegisterClientProps = {
  code: string
}

export default function RegisterClient({
  code
}: RegisterClientProps) {

  const router = useRouter()

  const [registeredUser, setRegisteredUser] =
    useState<RegisteredUser | null>(null)

  const [inviteData, setInviteData] = useState<any>(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")

  const [displayName, setDisplayName] = useState("")

  const [password, setPassword] = useState("")

  const [showRegisterCompleteModal, setShowRegisterCompleteModal] =
    useState(false)

  const handleRegister = async () => {

    if (password.length < 6) {

      alert("パスワードは6文字以上で入力してください")

      return

    }

    if (!code) {

      return

    }

    try {

      await registerUserTransaction({
        registerUserRequest: {
          code,
          password,
          displayName
        },
        setRegisteredUser
      })

      setShowRegisterCompleteModal(true)

    } catch {

      alert("登録に失敗しました")

    }
  }

  useEffect(() => {

    const fetchInvite = async () => {

      if (!code) {

        setError("招待コードなし")

        setLoading(false)

        return

      }

      try {

        const response = await fetch(
          `${API_BASE_URL}/invite-info/${code}`
        )

        if (!response.ok) {

          setError("無効な招待コード")

          setLoading(false)

          return

        }

        const inviteInfo = await response.json()

        setInviteData(inviteInfo)

      } catch {

        setError("招待情報の取得失敗")

      } finally {

        setLoading(false)

      }
    }

    fetchInvite()

  }, [code])

  if (loading) {

    return (
      <div>
        Loading...
      </div>
    )
  }

  if (error) {

    return (
      <div>
        {error}
      </div>
    )
  }

  if (!inviteData) {

    return (
      <div>
        招待データなし
      </div>
    )
  }

  return (
    <>
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            bg-white
            p-8
            rounded-xl
            shadow-xl
            w-[400px]
          "
        >
          <h1
            className="
              text-2xl
              font-bold
              mb-4
            "
          >
            ユーザー登録
          </h1>

          <div>
            招待コード:
          </div>

          <div
            className="
              break-all
              text-sm
              mt-2
            "
          >
            {code}
          </div>

          <div className="mb-4">

            <div className="mb-1">
              メールアドレス
            </div>

            <div
              className="
                border
                rounded
                px-3
                py-2
                bg-gray-100
              "
            >
              {inviteData.email}
            </div>

          </div>

          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="名前"
            autoComplete="name"
            className="
              w-full
              border
              rounded
              px-3
              py-2
              mb-4
            "
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            autoComplete="new-password"
            className="
              w-full
              border
              rounded
              px-3
              py-2
              mb-4
            "
          />

          <button
            onClick={handleRegister}
            className="
              w-full
              bg-blue-500
              text-white
              py-2
              rounded
            "
          >
            登録
          </button>

        </div>
      </div>

      {
        showRegisterCompleteModal &&
        registeredUser &&
        (
          <RegisterCompleteModal
            registeredUser={registeredUser}
            onClose={() => {

              setShowRegisterCompleteModal(false)

              router.push("/login")

            }}
          />
        )
      }
    </>
  )
}