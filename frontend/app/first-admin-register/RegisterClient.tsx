"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

<<<<<<< HEAD
import { API_BASE_URL } from "../api/client/apiClient"
=======
import { API_BASE_URL } from "../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { registerFirstAdminTransaction } from "../api/transactions/invites/registerFirstAdminTransaction"

import RegisterCompleteModal from "../components/modals/RegisterCompleteModal"

import { RegisteredUser } from "../types/registerTypes"

type RegisterClientProps = {
  code: string
}

export default function RegisterClient({
  code
}: RegisterClientProps) {

  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [inviteData, setInviteData] = useState<any>(null)

  const [displayName, setDisplayName] = useState("")
  const [password, setPassword] = useState("")

  const [registeredUser, setRegisteredUser] =
    useState<RegisteredUser | null>(null)

  const [showRegisterCompleteModal, setShowRegisterCompleteModal] =
    useState(false)

  useEffect(() => {

    const fetchInvite = async () => {

      if (!code) {

        setError("招待コードがありません")
        setLoading(false)

        return

      }

      try {

        const response = await fetch(
          `${API_BASE_URL}/invite-info/${code}`
        )

        if (!response.ok) {

          setError("無効な招待コードです")
          setLoading(false)

          return

        }

        const data = await response.json()

        setInviteData(data)

      }
      catch {

        setError("招待情報の取得に失敗しました")

      }
      finally {

        setLoading(false)

      }

    }

    fetchInvite()

  }, [code])

  const handleRegister = async () => {

    if (!code) {

      return

    }

    if (password.length < 6) {

      alert("パスワードは6文字以上で入力してください")

      return

    }

    try {

      await registerFirstAdminTransaction({
        registerUser: {
          code,
          displayName,
          password
        },
        setRegisteredUser
      })

      setShowRegisterCompleteModal(true)

    }
    catch {

      alert("登録に失敗しました")

    }

  }

  if (loading) {

    return (
      <div>
        Loading...
      </div>
    )

  }

  if (error) {

    return (
      <div className="p-8 text-red-500">
        {error}
      </div>
    )

  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">

        <div className="bg-white p-8 rounded shadow w-[400px]">

          <h1 className="text-2xl font-bold mb-6">
            初回管理者登録
          </h1>

          <div className="mb-4">

            <div className="font-bold">
              メールアドレス
            </div>

            <div className="border rounded p-2 bg-gray-100">
              {inviteData?.email}
            </div>

          </div>

          <div className="mb-4">

            <div className="font-bold mb-1">
              名前
            </div>

            <input
              className="w-full border rounded p-2"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

          </div>

          <div className="mb-6">

            <div className="font-bold mb-1">
              パスワード
            </div>

            <input
              type="password"
              className="w-full border rounded p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <button
            className="
              w-full
              bg-blue-500
              text-white
              rounded
              py-2
            "
            onClick={handleRegister}
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



/* "use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { API_BASE_URL } from "../api/client"
import { registerFirstAdminTransaction } from "../api/transactions/invites/registerFirstAdminTransaction"

import RegisterCompleteModal from "../components/modals/RegisterCompleteModal"
import { RegisteredUser } from "../types/registerTypes"

export default function RegisterForm() {

  const router = useRouter()
  const searchParams = useSearchParams()

  const code = searchParams.get("code")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [inviteData, setInviteData] = useState<any>(null)

  const [displayName, setDisplayName] = useState("")
  const [password, setPassword] = useState("")

  const [registeredUser, setRegisteredUser] =
    useState<RegisteredUser | null>(null)

  const [showRegisterCompleteModal, setShowRegisterCompleteModal] =
    useState(false)

  useEffect(() => {

    const fetchInvite = async () => {

      if (!code) {
        setError("招待コードがありません")
        setLoading(false)
        return
      }

      try {

        const response = await fetch(
          `${API_BASE_URL}/invite-info/${code}`
        )

        if (!response.ok) {
          setError("無効な招待コードです")
          setLoading(false)
          return
        }

        const data = await response.json()

        setInviteData(data)

      } catch {

        setError("招待情報の取得に失敗しました")

      } finally {

        setLoading(false)

      }
    }

    fetchInvite()

  }, [code])

  const handleRegister = async () => {

    if (!code) return

    if (password.length < 6) {
      alert("パスワードは6文字以上で入力してください")
      return
    }

    try {

      await registerFirstAdminTransaction({
        registerUser: {
          code,
          displayName,
          password
        },
        setRegisteredUser
      })

      setShowRegisterCompleteModal(true)

    } catch {

      alert("登録に失敗しました")

    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        {error}
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">

        <div className="bg-white p-8 rounded shadow w-[400px]">

          <h1 className="text-2xl font-bold mb-6">
            初回管理者登録
          </h1>

          <div className="mb-4">
            <div className="font-bold">
              メールアドレス
            </div>

            <div className="border rounded p-2 bg-gray-100">
              {inviteData?.email}
            </div>
          </div>

          <div className="mb-4">
            <div className="font-bold mb-1">
              名前
            </div>

            <input
              className="w-full border rounded p-2"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <div className="font-bold mb-1">
              パスワード
            </div>

            <input
              type="password"
              className="w-full border rounded p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="
              w-full
              bg-blue-500
              text-white
              rounded
              py-2
            "
            onClick={handleRegister}
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
} */


