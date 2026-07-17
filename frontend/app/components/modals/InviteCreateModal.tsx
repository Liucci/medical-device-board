 "use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { createInviteCodeTransaction }from "../../api/transactions/invites/createInviteCodeTransaction"

import {executeWithLoading} from "../common/executeWithLoading"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"

import {LoadingOverlay} from "../common/LoadingOverlay"
//supabase
import { supabase } from "../../lib/supabase"
type Props = {
  onClose: () => void
}

export default function InviteCreateModal({
                        onClose
                        }: Props) {

  const [inviteCode,setInviteCode] =useState("")
  const [loading,setLoading] =useState(false)
  const [email, setEmail]= useState("")
  const [role,setRole]=useState<"normal" | "admin">("normal")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleCreate = async () => {
    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {

        try {

          const data =await createInviteCodeTransaction(
                                                        email,
                                                        role
                                                        )
          setInviteCode(data.code)
          setIsSuccess(true)

        } catch (err) {

          console.error(
                        "invite error:",
                        err
                      )
          alert("招待失敗")
        } finally {


        }
    }
    })


  }

return createPortal(
  <>
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

      {
        isSuccess ? (

          <div className="text-center">

            <div
              className="
                text-5xl
                mb-4
              "
            >
              ✅
            </div>

            <h2
              className="
                text-2xl
                font-bold
                mb-4
              "
            >
              招待送信完了
            </h2>

            <p
              className="
                mb-2
                break-all
              "
            >
              {email}
            </p>

            <p
              className="
                text-gray-500
                text-sm
                mb-6
              "
            >
              に招待メールを送信しました
            </p>

            <div className="mb-6">

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

            <button

              onClick={onClose}

              className="
                px-4 py-2
                bg-blue-500
                text-white
                rounded
              "
            >
              閉じる
            </button>

          </div>

        ) : (

          <>

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
                  e.target.value as "normal" | "admin"
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

          </>

        )
      }

    </div>

  </div>
      <LoadingOverlay loading={loading} /> 
</>

  
  ,

  document.body
)
}