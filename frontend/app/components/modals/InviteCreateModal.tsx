 "use client"

import { useState } from "react"
import { createInviteCodeTransaction }from "../../api/transactions/invites/createInviteCodeTransaction"
import CommonModal from "../common/CommonModal"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"
import {LoadingOverlay} from "../common/LoadingOverlay"
type Props = {
  onClose: () => void
}

export default function InviteCreateModal({
                        onClose
                        }: Props) {

  const [inviteCode,setInviteCode] =useState("")
  const [loading,setLoading] =useState(false)
  const [email, setEmail]= useState("")
  const [role,setRole]=useState< "viewer" |"normal" | "admin">("normal")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleCreate = async () => {
    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {

        

          const data =await createInviteCodeTransaction(
                                                        email,
                                                        role
                                                        )
          setInviteCode(data.code)
          setIsSuccess(true)
      }
    })
  }

  return (
    <>
      <CommonModal
        open={true}
        onClose={onClose}
        title="ユーザー招待"
        maxWidth="max-w-[600px]"
      >
        <div className="w-full rounded-xl bg-slate-50 p-4 sm:p-5">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="space-y-5 p-4 sm:p-5">

              {isSuccess ? (
                <>
                  {/* ===================================================== */}
                  {/* 招待完了 */}
                  {/* ===================================================== */}
                  <div>
                    <h3 className="text-xs font-bold tracking-wide text-slate-700">
                      招待送信完了
                    </h3>

                    <p className="mt-1 text-[11px] text-slate-500">
                      招待メールを送信しました。
                    </p>
                  </div>

                  <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">

                    <div>
                      <p className="text-[11px] font-medium text-slate-500">
                        招待先メールアドレス
                      </p>

                      <p className="mt-1 break-all text-sm font-bold text-slate-900">
                        {email}
                      </p>
                    </div>

                    <div className="mt-4 border-t border-teal-100 pt-4">
                      <p className="text-[11px] font-medium text-slate-500">
                        招待コード
                      </p>

                      <p className="mt-1 break-all font-mono text-lg font-bold text-slate-900">
                        {inviteCode}
                      </p>
                    </div>

                  </div>

                  {/* ボタン */}
                  <div className="flex justify-end border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="
                        h-9
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
                      閉じる
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* ===================================================== */}
                  {/* ユーザー情報 */}
                  {/* ===================================================== */}
                  <div>
                    <h3 className="text-xs font-bold tracking-wide text-slate-700">
                      ユーザー情報
                    </h3>

                    <p className="mt-1 text-[11px] text-slate-500">
                      招待するユーザーの情報を入力してください。
                    </p>
                  </div>

                  {/* メールアドレス */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <label className="mb-2 block text-xs font-medium text-slate-500">
                      メールアドレス
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="メールアドレスを入力"
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
                  </div>

                  {/* 権限 */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <label className="mb-2 block text-xs font-medium text-slate-500">
                      権限
                    </label>

                    <select
                      value={role}
                      onChange={(e) =>
                        setRole(
                          e.target.value as
                            | "viewer"
                            | "normal"
                            | "admin"
                        )
                      }
                      className="
                        w-full
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        text-slate-700
                        outline-none
                        transition-colors
                        focus:border-teal-500
                        focus:ring-2
                        focus:ring-teal-100
                      "
                    >
                      <option value="viewer">
                        viewer
                      </option>
                      <option value="normal">
                        normal
                      </option>
                      <option value="admin">
                        admin
                      </option>
                    </select>
                  </div>

                  {/* ボタン */}
                  <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
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
                      type="button"
                      onClick={handleCreate}
                      disabled={loading}
                      className="
                        h-10
                        rounded-lg
                        bg-teal-700
                        px-4
                        text-xs
                        font-bold
                        text-white
                        transition-colors
                        hover:bg-teal-800
                        disabled:cursor-not-allowed
                        disabled:bg-slate-300
                      "
                    >
                      {loading
                        ? "送信中..."
                        : "招待メール送信"}
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </CommonModal>

      <LoadingOverlay loading={loading} />
    </>
  )  
}