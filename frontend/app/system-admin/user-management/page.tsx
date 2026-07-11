"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { UserManagementType } from "../../types/userTypes"

import { fetchUserManagementTransaction } from "@/app/api/transactions/users/fetchUserManagementTransaction"
import EditUserModal from "./components/EditUserModal"
import { User } from "lucide-react"

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
  const [
    selectedUser,
    setSelectedUser
  ] = useState<UserManagementType | null>(null)

  const router = useRouter()

useEffect(() => {
  const fetchData = async () => {
    const data = await fetchUserManagementTransaction()
    setUsers(data)
  }

  fetchData()
}, [])

  useEffect(
    () => {

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
          user =>
            user.createdAt.substring(0, 10) >= createdFrom
        )
      }

      // 登録日 To
      if (createdTo !== "") {
        result = result.filter(
          user =>
            user.createdAt.substring(0, 10) <= createdTo
        )
      }

      setFilteredUsers(result)

    },
    [
      users,
      hospitalName,
      roles,
      isActiveList,
      createdFrom,
      createdTo
    ]
  )

  return (

    <div className="flex h-full flex-col p-6">

      <div className="mb-6 flex items-center">

        <div className="flex items-center gap-3">

          <button
            onClick={() => router.push("/system-admin")}
            className="
              rounded
              bg-gray-500
              px-3
              py-2
              text-white
              hover:bg-gray-600
            "
          >
            ← 戻る
          </button>

          <h1 className="text-2xl font-bold">
            ユーザー管理
          </h1>

        </div>

      </div>

      {/* 検索条件 */}

      <div className="mb-6 rounded border p-4">

        <div className="mb-4 text-lg font-bold">
          検索条件
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>

            <div className="mb-1">
              病院名
            </div>

            <input
              value={hospitalName}
              onChange={e => setHospitalName(e.target.value)}
              className="w-full rounded border px-2 py-1"
            />

          </div>

          <div>

            <div className="mb-1">
              権限
            </div>

            <div className="flex gap-4">

              {
                [
                  "viewer",
                  "normal",
                  "admin",
                  "support",
                  "system_admin"
                ].map(role => (

                  <label key={role}>

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
                    />

                    {role}

                  </label>

                ))
              }

            </div>

          </div>

          <div>

            <div className="mb-1">
              状態
            </div>

            <div className="flex gap-4">

              <label>

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
                />

                利用中

              </label>

              <label>

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
                />

                停止

              </label>

            </div>

          </div>

          <div>

            <div className="mb-1">
              登録期間
            </div>

            <div className="flex items-center gap-2">

              <input
                type="date"
                value={createdFrom}
                onChange={e => setCreatedFrom(e.target.value)}
                className="min-w-0 flex-1 rounded border px-2 py-1"
              />

              <span>～</span>

              <input
                type="date"
                value={createdTo}
                onChange={e => setCreatedTo(e.target.value)}
                className="min-w-0 flex-1 rounded border px-2 py-1"
              />

            </div>

          </div>

        </div>

      </div>

      <div className="mb-3 font-bold">

        検索結果：{filteredUsers.length}件

      </div>

      <div className="flex-1 overflow-auto rounded border">

        <table className="min-w-[1400px] border-collapse">

          <thead className="sticky top-0 bg-gray-100">

            <tr>

              <th className="border px-3 py-2">
                Edit
              </th>

              <th className="border px-3 py-2">
                病院名
              </th>

              <th className="border px-3 py-2">
                ユーザー名
              </th>

              <th className="border px-3 py-2">
                メールアドレス
              </th>

              <th className="border px-3 py-2">
                権限
              </th>

              <th className="border px-3 py-2">
                状態
              </th>

              <th className="border px-3 py-2">
                登録日
              </th>

            </tr>

          </thead>

          <tbody>

            {
              filteredUsers.map(user => (

                <tr key={user.id}>

                  <td className="border px-3 py-2">

                    <button
                      onClick={() => {
                                        setSelectedUser(user)
                                        setEditOpen(true)
                                      }}
                      className="rounded bg-gray-600 px-3 py-1 text-white hover:bg-gray-700"
                    >
                      Open
                    </button>

                  </td>

                  <td className="border px-3 py-2">
                    {user.hospitalName}
                  </td>

                  <td className="border px-3 py-2">
                    {user.displayName}
                  </td>

                  <td className="border px-3 py-2">
                    {user.email}
                  </td>

                  <td className="border px-3 py-2">
                    {user.role}
                  </td>

                  <td className="border px-3 py-2">
                    {user.isActive ? "利用中" : "停止"}
                  </td>

                  <td className="border px-3 py-2">
                    {
                      new Date(user.createdAt).toLocaleString(
                        "ja-JP",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit"
                        }
                      )
                    }
                  </td>

                </tr>

              ))
            }

          </tbody>

        </table>

      </div>
            <EditUserModal
              isOpen={editOpen}
              user={selectedUser}
              onClose={() => setEditOpen(false)}
              setUsers={setUsers}
            />


    </div>

  )

}