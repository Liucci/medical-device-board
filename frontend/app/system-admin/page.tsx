"use client"

import { useEffect,useState } from "react"
import { useRouter } from "next/navigation"
import { CurrentUser } from "../types/userTypes"
import { fetchCurrentUser } from "../api/auth/fetchCurrentUser"
import { normalizeCurrentUser } from "../utils/userMapper"

export default function SystemAdminPage() 
{
    const router = useRouter()
    const [currentUser, setCurrentUser] =useState<CurrentUser | null | undefined>(undefined)
    const init = async () => {
        const user = await fetchCurrentUser()
            if (!user) {
                setCurrentUser(null)
                return
            }
        setCurrentUser(normalizeCurrentUser(user))

    }
    //currentUser情報を取得
    useEffect(() => {
        init()
    }, [])

  useEffect(() => {

      if (currentUser === undefined) {return}
      if (currentUser === null) {
          router.replace("/login")
          return
      }
      if (currentUser.role !== "system_admin") {
          router.replace("/dashboard")
      }
  }, [currentUser, router])
  
  if (!currentUser) {return null}
  if (currentUser.role !== "system_admin") {return null}

  const handleLogout = async () => {
      router.push("/login")
  }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8">
                System Admin
            </h1>

            <div className="flex flex-col gap-4 max-w-md">

                <button
                    onClick={() =>
                        router.push("/system-admin/first-admin-invite")
                    }
                    className="rounded bg-blue-500 px-4 py-3 text-white hover:bg-blue-600"
                >
                    初回管理者招待
                </button>

                <button
                    onClick={() =>
                        router.push("/system-admin/hospital-management")
                    }
                    className="rounded bg-gray-600 px-4 py-3 text-white hover:bg-gray-700"
                >
                    病院管理
                </button>

                <button
                    onClick={() =>
                        router.push("/system-admin/user-management")
                    }
                    className="rounded bg-gray-600 px-4 py-3 text-white hover:bg-gray-700"
                >
                    ユーザー管理
                </button>

                <button
                    onClick={() =>
                        router.push("/system-admin/announce-management")
                    }
                    className="rounded bg-gray-600 px-4 py-3 text-white hover:bg-gray-700"
                >
                    お知らせ管理
                </button>

                <button
                    onClick={() =>
                        router.push("/system-admin/subscription-management")
                    }
                    className="rounded bg-gray-600 px-4 py-3 text-white hover:bg-gray-700"
                >
                    契約管理
                </button>

                <button
                    onClick={handleLogout}
                    className="rounded bg-red-500 px-4 py-3 text-white hover:bg-red-600"
                >
                    ログアウト
                </button>

            </div>
        </div>
    )
}