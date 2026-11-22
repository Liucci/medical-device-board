
"use client"

import { useEffect, useState } from "react"

import {
  UserManagementType,
  UserRole
} from "../../../types/userTypes"
import { updateUserTransaction } from "../../../api/transactions/users/updateUserTransaction"
import CommonModal from "../../../components/common/CommonModal"
import { LoadingOverlay } from "../../../components/common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../../../components/common/executeWithErrorAndLoading"

type Props = {
  isOpen: boolean
  onClose: () => void
  user: UserManagementType | null
  setUsers: React.Dispatch<React.SetStateAction<UserManagementType[]>>
}

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  setUsers
}: Props) {

  const [displayName, setDisplayName] = useState("")
  const [role, setRole] = useState<UserRole>("normal")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)

  const initialize = () => {
    if (!user) return

    setDisplayName(user.displayName)
    setRole(user.role)
    setIsActive(user.isActive)
  }

  const closeModal = () => {
    initialize()
    onClose()
  }

  useEffect(() => {
    if (!user) return

    setDisplayName(user.displayName)
    setRole(user.role)
    setIsActive(user.isActive)
  }, [user])

  if (!isOpen || !user) return null

  const handleSubmit = async () => {

    if (displayName.trim() === "") {
      alert("ユーザー名を入力してください")
      return
    }

    setLoading(true)

    try {
      await executeWithErrorAndLoading({
        setLoading,
        action: async () => {
          await updateUserTransaction({
            user: {
              id: user.id,
              role,
              isActive
            },
            setUsers,
            onClose
          })
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const readOnlyInputClass = `
    w-full
    rounded
    border
    border-gray-300
    bg-gray-100
    px-3
    py-2
    text-gray-600
  `

  const editableInputClass = `
    w-full
    rounded
    border
    border-gray-300
    bg-white
    px-3
    py-2
    focus:border-blue-400
    focus:outline-none
    focus:ring-2
    focus:ring-blue-100
  `

  const labelClass = "mb-1 text-sm font-medium text-gray-700"

  return (
    <>
      <CommonModal
        open={isOpen}
        onClose={closeModal}
        title="ユーザー編集"
        maxWidth="max-w-[450px]"
      >

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

          {/* ユーザー名 */}
          <div>
            <div className={labelClass}>
              ユーザー名
            </div>

            <input
              value={user.displayName}
              readOnly
              className={readOnlyInputClass}
            />
          </div>

          {/* メールアドレス */}
          <div>
            <div className={labelClass}>
              メールアドレス
            </div>

            <input
              value={user.email}
              readOnly
              className={readOnlyInputClass}
            />
          </div>

          {/* 所属病院 */}
          <div>
            <div className={labelClass}>
              所属病院
            </div>

            <input
              value={user.hospitalName}
              readOnly
              className={readOnlyInputClass}
            />
          </div>

          {/* 権限 */}
          <div>
            <div className={labelClass}>
              権限
            </div>

            <select
              value={role}
              onChange={e =>
                setRole(e.target.value as UserRole)
              }
              className={editableInputClass}
            >
              <option value="viewer">viewer</option>
              <option value="normal">normal</option>
              <option value="admin">admin</option>
              <option value="support">support</option>
              <option value="system_admin">system_admin</option>
            </select>
          </div>

          {/* 利用状態 */}
          <div>
            <div className="mb-2 text-sm font-medium text-gray-700">
              利用状態
            </div>

            <div className="flex gap-6">

              <label className="flex items-center">
                <input
                  type="radio"
                  checked={isActive}
                  onChange={() => setIsActive(true)}
                  className="accent-blue-500"
                />

                <span className="ml-1 text-sm text-gray-700">
                  利用中
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!isActive}
                  onChange={() => setIsActive(false)}
                  className="accent-blue-500"
                />

                <span className="ml-1 text-sm text-gray-700">
                  停止
                </span>
              </label>

            </div>
          </div>

          {/* ユーザーID */}
          <div>
            <div className={labelClass}>
              ユーザーID
            </div>

            <input
              value={user.id}
              readOnly
              className={readOnlyInputClass}
            />
          </div>

          {/* 登録日 */}
          <div>
            <div className={labelClass}>
              登録日
            </div>

            <input
              value={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleString(
                      "ja-JP",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )
                  : ""
              }
              readOnly
              className={readOnlyInputClass}
            />
          </div>

          {/* 更新日 */}
          <div>
            <div className={labelClass}>
              更新日
            </div>

            <input
              value={
                user.updatedAt
                  ? new Date(user.updatedAt).toLocaleString(
                      "ja-JP",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )
                  : ""
              }
              readOnly
              className={readOnlyInputClass}
            />
          </div>

        </div>

        {/* フッター */}
        <div
          className="
            flex
            justify-end
            gap-4
            border-t
            bg-white
            px-8
            py-6
          "
        >
          <button
            onClick={closeModal}
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

      </CommonModal>

      <LoadingOverlay loading={loading} />
    </>
  )
}
