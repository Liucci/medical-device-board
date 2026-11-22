
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingOverlay } from "../../components/common/LoadingOverlay"
import { UserManagementType } from "../../types/userTypes"

import { fetchUserManagementTransaction } from "@/app/api/transactions/users/fetchUserManagementTransaction"
import EditUserModal from "./components/EditUserModal"

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserManagementType[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserManagementType[]>([])

  const [hospitalName, setHospitalName] = useState("")
  const [roles, setRoles] = useState<string[]>([
    "viewer",
    "normal",
    "admin",
    "support",
    "system_admin"
  ])

  const [isActiveList, setIsActiveList] = useState<boolean[]>([
    true,
    false
  ])

  const [createdFrom, setCreatedFrom] = useState("")
  const [createdTo, setCreatedTo] = useState("")
  const [editOpen, setEditOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserManagementType | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    fetchUserManagementTransaction({
      setUsers,
      setLoading,
    })
  }, [])

  useEffect(() => {
    let result = [...users]

    // 病院名
    if (hospitalName !== "") {
      result = result.filter(
        user =>
          user.hospitalName
            .toLowerCase()
            .includes(hospitalName.toLowerCase())
      )
    }

    // 権限
    if (roles.length > 0) {
      result = result.filter(
        user => roles.includes(user.role)
      )
    }

    // 利用状態
    if (isActiveList.length > 0) {
      result = result.filter(
        user => isActiveList.includes(user.isActive)
      )
    }

    // 登録日 From
    if (createdFrom !== "") {
      result = result.filter(
        user => user.createdAt.substring(0, 10) >= createdFrom
      )
    }

    // 登録日 To
    if (createdTo !== "") {
      result = result.filter(
        user => user.createdAt.substring(0, 10) <= createdTo
      )
    }

    setFilteredUsers(result)
  }, [
    users,
    hospitalName,
    roles,
    isActiveList,
    createdFrom,
    createdTo
  ])

  const inputClass = `
    w-full rounded-lg border border-white/10
    bg-[#111d3b] px-3 py-2
    text-sm text-white placeholder:text-[#7180a5]
    outline-none transition
    focus:border-[#75dfff] focus:ring-2 focus:ring-[#75dfff]/20
  `

  const labelClass = "mb-2 block text-sm font-medium text-[#c5d0eb]"

  const checkboxClass = "h-4 w-4 accent-[#45c9f5]"

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden bg-[#0a122a] p-4 text-[#dbe1ff] sm:p-6">

        {/* ヘッダー */}
        <div className="mb-6 flex shrink-0 items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/system-admin")}
              className="
                rounded-lg border border-white/10
                bg-white/5 px-3 py-2
                text-sm font-medium text-[#c5d0eb]
                transition hover:bg-white/10
              "
            >
              ← 戻る
            </button>

            <h1 className="text-xl font-bold text-white sm:text-2xl">
              ユーザー管理
            </h1>
          </div>
        </div>

        {/* 検索条件 */}
        <div className="
          mb-5 shrink-0 rounded-xl
          border border-white/10
          bg-[#111d3b]/80 p-4 sm:p-5
        ">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-base font-bold text-white">
              検索条件
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* 病院名 */}
            <div>
              <label className={labelClass}>
                病院名
              </label>

              <input
                value={hospitalName}
                onChange={e => setHospitalName(e.target.value)}
                className={inputClass}
                placeholder="病院名で検索"
              />
            </div>

            {/* 権限 */}
            <div>
              <label className={labelClass}>
                権限
              </label>

              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                {[
                  "viewer",
                  "normal",
                  "admin",
                  "support",
                  "system_admin"
                ].map(role => (
                  <label
                    key={role}
                    className="flex cursor-pointer items-center gap-1.5 text-sm text-[#c5d0eb]"
                  >
                    <input
                      type="checkbox"
                      checked={roles.includes(role)}
                      onChange={e =>
                        setRoles(
                          e.target.checked
                            ? [...roles, role]
                            : roles.filter(r => r !== role)
                        )
                      }
                      className={checkboxClass}
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>

            {/* 利用状態 */}
            <div>
              <label className={labelClass}>
                状態
              </label>

              <div className="flex gap-5 pt-2">
                <label className="flex cursor-pointer items-center gap-1.5 text-sm text-[#c5d0eb]">
                  <input
                    type="checkbox"
                    checked={isActiveList.includes(true)}
                    onChange={e =>
                      setIsActiveList(
                        e.target.checked
                          ? [...isActiveList.filter(v => v !== true), true]
                          : isActiveList.filter(v => v !== true)
                      )
                    }
                    className={checkboxClass}
                  />
                  利用中
                </label>

                <label className="flex cursor-pointer items-center gap-1.5 text-sm text-[#c5d0eb]">
                  <input
                    type="checkbox"
                    checked={isActiveList.includes(false)}
                    onChange={e =>
                      setIsActiveList(
                        e.target.checked
                          ? [...isActiveList.filter(v => v !== false), false]
                          : isActiveList.filter(v => v !== false)
                      )
                    }
                    className={checkboxClass}
                  />
                  停止
                </label>
              </div>
            </div>

            {/* 登録期間 */}
            <div>
              <label className={labelClass}>
                登録期間
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={createdFrom}
                  onChange={e => setCreatedFrom(e.target.value)}
                  className={`${inputClass} min-w-0 [color-scheme:dark]`}
                />

                <span className="shrink-0 text-[#8e9dbc]">
                  ～
                </span>

                <input
                  type="date"
                  value={createdTo}
                  onChange={e => setCreatedTo(e.target.value)}
                  className={`${inputClass} min-w-0 [color-scheme:dark]`}
                />
              </div>
            </div>

          </div>
        </div>

        {/* 検索結果 */}
        <div className="mb-3 flex shrink-0 items-center justify-between">
          <div className="text-sm font-medium text-[#c5d0eb]">
            検索結果
            <span className="ml-2 text-lg font-bold text-[#75dfff]">
              {filteredUsers.length}
            </span>
            <span className="ml-1 text-xs text-[#8e9dbc]">
              件
            </span>
          </div>
        </div>

        {/* ユーザー一覧 */}
        <div className="
          min-h-0 flex-1 overflow-auto rounded-xl
          border border-white/10 bg-[#111d3b]/70
        ">
          <table className="min-w-[1200px] w-full border-collapse text-sm">

            <thead className="sticky top-0 z-10 bg-[#1a2a4d]">
              <tr className="text-[#c5d0eb]">
                <th className="border-b border-white/10 px-3 py-3 font-semibold">
                  編集
                </th>

                <th className="border-b border-white/10 px-3 py-3 text-left font-semibold">
                  病院名
                </th>

                <th className="border-b border-white/10 px-3 py-3 text-left font-semibold">
                  ユーザー名
                </th>

                <th className="border-b border-white/10 px-3 py-3 text-left font-semibold">
                  メールアドレス
                </th>

                <th className="border-b border-white/10 px-3 py-3 font-semibold">
                  権限
                </th>

                <th className="border-b border-white/10 px-3 py-3 font-semibold">
                  状態
                </th>

                <th className="border-b border-white/10 px-3 py-3 font-semibold">
                  登録日
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map(user => (
                <tr
                  key={user.id}
                  className="
                    border-b border-white/5
                    text-[#dbe1ff]
                    transition-colors hover:bg-white/5
                  "
                >
                  <td className="px-3 py-2.5 text-center">
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setEditOpen(true)
                      }}
                      className="
                        rounded-lg border border-[#438fff]/30
                        bg-[#438fff]/15 px-3 py-1.5
                        text-xs font-semibold text-[#8bc5ff]
                        transition hover:bg-[#438fff]/25
                      "
                    >
                      Open
                    </button>
                  </td>

                  <td className="px-3 py-2.5">
                    {user.hospitalName}
                  </td>

                  <td className="px-3 py-2.5">
                    {user.displayName}
                  </td>

                  <td className="px-3 py-2.5 text-[#aebbd8]">
                    {user.email}
                  </td>

                  <td className="px-3 py-2.5 text-center">
                    {user.role}
                  </td>

                  <td className="px-3 py-2.5 text-center">
                    <span
                      className={`
                        inline-flex rounded-full px-2.5 py-1
                        text-xs font-semibold
                        ${
                          user.isActive
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-rose-400/10 text-rose-300"
                        }
                      `}
                    >
                      {user.isActive ? "利用中" : "停止"}
                    </span>
                  </td>

                  <td className="px-3 py-2.5 text-center text-[#aebbd8]">
                    {new Date(user.createdAt).toLocaleString(
                      "ja-JP",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )}
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-[#8e9dbc]"
                  >
                    該当するユーザーがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 編集モーダル */}
        <EditUserModal
          isOpen={editOpen}
          user={selectedUser}
          onClose={() => setEditOpen(false)}
          setUsers={setUsers}
        />

      </div>

      <LoadingOverlay loading={loading} />
    </>
  )
}
