"use client"

import {useSearchParams} from "next/navigation"
import {useEffect,  useState} from "react"
import { supabase }
from "@/app/lib/supabase"

export default function RegisterPage() {
    const [inviteData,setInviteData]=useState<any>(null)
    const [loading,setLoading]=useState(true)
    const [error,  setError]=useState("")
    const [displayName,setDisplayName]=useState("")
    const [password,setPassword]=useState("")

    
    const searchParams =useSearchParams()
    const code =searchParams.get("code")

    const handleRegister =async () => {
        if (!inviteData) return
        // Auth登録
        const {data,error}=await supabase.auth.signUp({
                                email:inviteData.email,
                                password,
                            })
        if (error) {alert(error.message)
            return
        }
        const userId =data.user?.id
            if (!userId) {
                    alert("ユーザー作成失敗")
            return
            }
        // users table作成
        const {error: userError}=await supabase
                                .from("users")
                                .insert({
                                        id: userId,
                                        hospital_id:inviteData.hospital_id,
                                        email:inviteData.email,
                                        role:inviteData.role,
                                        display_name:displayName,
                                        })

        if (userError) {
            alert(userError.message)
        return
        }
        // 招待使用済み
        await supabase
            .from("invite_codes")
            .update({used: true})
            .eq(
                "id",
                inviteData.id
                )
        alert("登録完了")
    }
useEffect(() => {
  console.log("code:",code)

    const fetchInvite =async () => {
    if (!code) {setError("招待コードなし")
    setLoading(false)
    return
    }
    const {data,error}=await supabase
                    .from("invite_codes")
                    .select("*")
                    .eq("code", code)
                    .single()
    if (error || !data) {
    setError("無効な招待コード")
    setLoading(false)
    return
    }
      // 使用済み
      if (data.used) {
        setError(
          "使用済み招待コード"
        )
        setLoading(false)
        return
      }
      // 期限切れ
      if (
        new Date(
          data.expires_at
        )
        <
        new Date()
      ) {
        setError(
          "招待期限切れ"
        )
        setLoading(false)
        return
      }
      setInviteData(data)
      setLoading(false)
    }
  fetchInvite()
}, [code])
    if (loading) {

    return (
        <div>
        Loading...
        </div>
    )
    }

    if (error) {

    return (
        <div>
        {error}
        </div>
    )
    }

    if (!inviteData) {

    return (
        <div>
        招待データなし
        </div>
    )
    }
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
      "
    >
      <div
        className="
          bg-white
          p-8
          rounded-xl
          shadow-xl
          w-[400px]
        "
      >
        <h1
          className="
            text-2xl
            font-bold
            mb-4
          "
        >
          ユーザー登録
        </h1>
        <div>
          招待コード:
        </div>
        <div
          className="
            break-all
            text-sm
            mt-2
          "
        >
          {code}
        </div>
        <div className="mb-4">

        <div className="mb-1">
            メールアドレス
        </div>
            <div
                className="
                border
                rounded
                px-3 py-2
                bg-gray-100
                "
            >
                {inviteData.email}
            </div>
        </div>
        <input
            type="text"
            value={displayName}
            onChange={(e) =>setDisplayName(
                            e.target.value
                            )
                        }
            placeholder="名前"
            className="
                        w-full
                        border
                        rounded
                        px-3 py-2
                        mb-4
                        "
        />

        <input
        type="password"
        value={password}
        onChange={(e) =>
                    setPassword(
                    e.target.value
                    )
                }
        placeholder="パスワード"
        className="
                    w-full
                    border
                    rounded
                    px-3 py-2
                    mb-4
                "
        />
        <button
            onClick={handleRegister}
            className="
                        w-full
                        bg-blue-500
                        text-white
                        py-2
                        rounded
                    "
        >
        登録
        </button>
      </div>
    </div>
  )
}