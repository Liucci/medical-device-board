
"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { supabase } from "@/app/lib/supabase"

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function AdminCreateUserModal({
  isOpen,
  onClose,
}: Props) {

  const [hospitalName, setHospitalName] =
    useState("")

  const [displayName, setDisplayName] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [pricePlan, setPricePlan] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const handleCreate = async () => {

    try {

      setLoading(true)
      setError("")
      setSuccess("")

      // =========================
      // session取得
      // =========================

      const {
        data: { session }
      } = await supabase
        .auth
        .getSession()

      if (!session) {

        setError(
          "session not found"
        )

        return
      }

      // =========================
      // API実行
      // =========================

      const res = await fetch(
        "/api/admin/create-hospital",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${session.access_token}`
          },

          body: JSON.stringify({

            hospitalName,

            displayName,

            email,

            password,

            pricePlan
          })
        }
      )

      const result =
        await res.json()

      if (!res.ok) {

        console.error(result)

        setError(
          result.error ||
          "作成失敗"
        )

        return
      }

      // =========================
      // success
      // =========================

      setSuccess(
        "登録成功しました"
      )

      setHospitalName("")
      setDisplayName("")
      setEmail("")
      setPassword("")
      setPricePlan("")

    } catch (err) {

      console.error(err)

      setError("server error")

    } finally {

      setLoading(false)
    }
  }

  if (!isOpen) return null

  return createPortal(

    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50
      "
    >

      <div
        className="
          w-full
          max-w-md
          rounded-xl
          bg-white
          p-6
        "
      >

        <h2
          className="
            mb-4
            text-xl
            font-bold
          "
        >
          ユーザー登録
        </h2>

        {success ? (

          <div className="space-y-4">

            <div
              className="
                text-lg
                font-bold
                text-green-600
              "
            >
              {success}
            </div>

            <button
              onClick={onClose}
              className="
                w-full
                rounded
                bg-blue-600
                px-4
                py-2
                text-white
              "
            >
              閉じる
            </button>

          </div>

        ) : (

          <>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="病院名"
                value={hospitalName}
                onChange={(e) =>
                  setHospitalName(
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded
                  border
                  p-2
                "
              />

              <input
                type="text"
                placeholder="管理者名"
                value={displayName}
                onChange={(e) =>
                  setDisplayName(
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded
                  border
                  p-2
                "
              />

              <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded
                  border
                  p-2
                "
              />

              <input
                type="password"
                placeholder="初期パスワード"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded
                  border
                  p-2
                "
              />

              <input
                type="text"
                placeholder="price plan"
                value={pricePlan}
                onChange={(e) =>
                  setPricePlan(
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded
                  border
                  p-2
                "
              />

            </div>

            {error && (

              <div
                className="
                  mt-4
                  text-red-500
                "
              >
                {error}
              </div>
            )}

            <div
              className="
                mt-6
                flex
                justify-end
                gap-2
              "
            >

              <button
                onClick={onClose}
                className="
                  rounded
                  bg-gray-200
                  px-4
                  py-2
                "
              >
                閉じる
              </button>

              <button
                onClick={handleCreate}
                disabled={loading}
                className="
                  rounded
                  bg-blue-600
                  px-4
                  py-2
                  text-white
                "
              >
                {loading
                  ? "登録中..."
                  : "登録"}
              </button>

            </div>

          </>

        )}

      </div>

    </div>,

    document.body
  )
}
