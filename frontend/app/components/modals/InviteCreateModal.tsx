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
        <div className="w-full rounded-xl bg-gray-200 p-5">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="space-y-5">

              {isSuccess ? (
                <>
                  {/* ===================================================== */}
                  {/* 招待完了 */}
                  {/* ===================================================== */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      招待送信完了
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      招待メールを送信しました。
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        招待先メールアドレス
                      </p>
                      <p className="mt-1 break-all text-sm text-gray-700">
                        {email}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-600">
                        招待コード
                      </p>
                      <p className="mt-1 break-all text-lg font-semibold text-gray-800">
                        {inviteCode}
                      </p>
                    </div>
                  </div>

                  {/* ===================================================== */}
                  {/* ボタン */}
                  {/* ===================================================== */}
                  <div className="flex justify-end border-t border-gray-200 pt-5">
                    <button
                      onClick={onClose}
                      className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
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
                    <h3 className="text-lg font-semibold text-gray-800">
                      ユーザー情報
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      招待するユーザーの情報を入力してください。
                    </p>
                  </div>

                  {/* メールアドレス */}
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      メールアドレス
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="メールアドレスを入力"
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* 権限 */}
                  <div>
                    <label className="text-xs font-medium text-gray-600">
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
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

                  {/* ===================================================== */}
                  {/* ボタン */}
                  {/* ===================================================== */}
                  <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
                    <button
                      onClick={onClose}
                      className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
                    >
                      キャンセル
                    </button>

                    <button
                      onClick={handleCreate}
                      disabled={loading}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      {loading ? "送信中..." : "招待メール送信"}
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