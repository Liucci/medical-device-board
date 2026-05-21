"use client"

import { useState } from "react"
import AdminCreateUserModal from "../components/modals/AdminCreateUserModal"

export default function AdminPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">
        管理者専用ページ
      </h1>

      <button
        onClick={() => setIsOpen(true)}
        className="
          rounded-lg
          bg-blue-600
          px-4
          py-2
          text-white
          hover:bg-blue-700
          transition
        "
      >
        ユーザー登録
      </button>

      <AdminCreateUserModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </main>
  )
}