"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import {
  UserManagementType,
  UserRole
} from "../../../types/userTypes"
import { updateUserTransaction } from "../../../api/transactions/users/updateUserTransaction"

type Props = {
  isOpen: boolean
  onClose: () => void
  user: UserManagementType | null
  setUsers: React.Dispatch<
    React.SetStateAction<UserManagementType[]>
  >
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

      await updateUserTransaction({
        user: {
          id: user.id,
          role,
          isActive
        },
        setUsers,
        onClose
      })

    } finally {

      setLoading(false)

    }

  }

  return createPortal(

    <div
      className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/30
                p-4
      "
       onClick={closeModal}
    >

      <div
        className="
                  relative
                  flex
                  max-h-[70vh]
                  w-full
                  max-w-md
                  flex-col
                  rounded-xl
                  bg-white
                  shadow-xl
        "
        onClick={(e) => e.stopPropagation()}
      >

        <div
          className="
            relative
            border-b
            px-8
            pt-8
            pb-6
          "
        >

          <button
            onClick={closeModal}
            className="
              absolute
              left-4
              top-4
              text-2xl
              text-gray-500
              hover:text-black
            "
          >
            ×
          </button>

          <h2 className="text-center text-2xl font-bold">
            ユーザー編集
          </h2>

        </div>

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

          <div>

            <div className="mb-1 text-sm">
              ユーザー名
            </div>

            <input
           value={user.displayName}
                readOnly
              className="
                w-full
                rounded
                border
                border-gray-300
                bg-gray-100
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
              value={user.email}
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
              所属病院
            </div>

            <input
              value={user.hospitalName}
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
              権限
            </div>

            <select
              value={role}
              onChange={e =>
                setRole(e.target.value as UserRole)
              }
              className="
                w-full
                rounded
                border
                border-gray-300
                px-3
                py-2
              "
            >
              <option value="viewer">viewer</option>
              <option value="normal">normal</option>
              <option value="admin">admin</option>
              <option value="support">support</option>
              <option value="system_admin">system_admin</option>
            </select>

          </div>

          <div>

            <div className="mb-2 text-sm">
              利用状態
            </div>

            <div className="flex gap-6">

              <label>

                <input
                  type="radio"
                  checked={isActive}
                  onChange={() => setIsActive(true)}
                />

                <span className="ml-1">
                  利用中
                </span>

              </label>

              <label>

                <input
                  type="radio"
                  checked={!isActive}
                  onChange={() => setIsActive(false)}
                />

                <span className="ml-1">
                  停止
                </span>

              </label>

            </div>

          </div>

          <div>

            <div className="mb-1 text-sm">
              ユーザーID
            </div>

            <input
              value={user.id}
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

        </div>

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

      </div>

    </div>,
    document.body
  )
}