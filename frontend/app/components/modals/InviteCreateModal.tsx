"use client"

import { useState } from "react"

import {
  createInviteCode
} from "@/app/auth/services/inviteService"

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

  const [inviteCode,
    setInviteCode] =
    useState("")

  const [loading,
    setLoading] =
    useState(false)

  const handleCreate =
    async () => {

      try {

        setLoading(true)

        const data =
          await createInviteCode(
            currentUser.hospital_id,
            currentUser.id
          )

        setInviteCode(data.code)

      } catch (err) {

        console.error(err)
        alert("作成失敗")

      } finally {

        setLoading(false)
      }
    }

  return (
    <div className="p-4">

      <button
        onClick={handleCreate}
        className="
          px-4 py-2
          bg-blue-500
          text-white
          rounded
        "
      >
        紹介コード作成
      </button>

      {inviteCode && (

        <div className="mt-4">

          <p>
            紹介コード:
          </p>

          <div
            className="
              text-xl
              font-bold
            "
          >
            {inviteCode}
          </div>

        </div>
      )}

    </div>
  )
}