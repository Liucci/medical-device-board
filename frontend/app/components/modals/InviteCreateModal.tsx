 "use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import {createInviteCode}from "@/app/auth/services/inviteService"
//supabase
import { supabase } from "../../lib/supabase"
type Props = {
  currentUser: {
    id: string
    hospital_id: string
  }
  onClose: () => void
}

export default function InviteCreateModal({
                        currentUser,
                        onClose
                        }: Props) {

  const [inviteCode,setInviteCode] =useState("")
  const [loading,setLoading] =useState(false)
  const [email, setEmail]= useState("")
  const [role,setRole]=useState("normal")
  const handleCreate =
    async () => {

      try {

        setLoading(true)

        // 招待コード作成
        const data =
          await createInviteCode(
            currentUser.hospital_id,
            currentUser.id,
            email,
            role
          )

        setInviteCode(data.code)

        // 招待URL生成
        const inviteUrl =`${window.location.origin}/register?code=${data.code}`

        // メール送信
        const {data: emailData,error}=
            await supabase.functions.invoke(
              "resend-email",
              {
                body: {
                  to: email,
                  subject:
                    "医療機器管理システム招待",
                html: `
                  <h2>
                    招待メール
                  </h2>

                  <p>
                    以下のリンクから
                    登録してください
                  </p>

                  <p>
                    <a href="${inviteUrl}">
                      登録する
                    </a>
                  </p>

                  <p>
                    ${inviteUrl}
                  </p>
                `                
              }
              }
            )

            console.log(emailData)
            console.log(error)
                if (error) {
                  throw error
                }

                alert("招待送信完了")

              } catch (err) {

            console.error(
              "invite error:",
              JSON.stringify(err, null, 2)
            )
                alert("招待失敗")

              } finally {

                setLoading(false)
              }
    }

return createPortal(

  <div
    className="
      fixed inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-[9999]
    "
  >

    <div
      className="
        bg-white
        rounded-xl
        p-6
        w-[400px]
        shadow-xl
      "
    >

      <h2
        className="
          text-xl
          font-bold
          mb-4
        "
      >
        ユーザー招待
      </h2>

      <input
        type="email"

        value={email}

        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }

        placeholder="メールアドレス"

        className="
          w-full
          border
          rounded
          px-3 py-2
          mb-4
        "
      />

      <select

        value={role}

        onChange={(e) =>
          setRole(
            e.target.value
          )
        }

        className="
          w-full
          border
          rounded
          px-3 py-2
          mb-4
        "
      >

        <option value="normal">
          normal
        </option>

        <option value="admin">
          admin
        </option>

      </select>

      <div
        className="
          flex
          justify-end
          gap-4
          mt-6
        "
      >

        <button

          onClick={handleCreate}

          disabled={loading}

          className="
            px-4 py-2
            bg-blue-500
            text-white
            rounded
            disabled:opacity-50
          "
        >
          {
            loading
              ? "送信中..."
              : "紹介コード送信"
          }
        </button>

        <button

          onClick={onClose}

          className="
            px-4 py-2
            bg-gray-300
            rounded
          "
        >
          閉じる
        </button>

      </div>

      {inviteCode && (

        <div className="mt-6">

          <p className="mb-2">
            紹介コード:
          </p>

          <div
            className="
              text-xl
              font-bold
              break-all
            "
          >
            {inviteCode}
          </div>

        </div>
      )}

    </div>

  </div>,

  document.body
)
}