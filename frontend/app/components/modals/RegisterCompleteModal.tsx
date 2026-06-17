"use client"

import { RegisteredUser } from "../../types/registerTypes"

type RegisterCompleteModalProps = {
                                    registeredUser: RegisteredUser
                                    onClose: () => void
                                  }

export default function RegisterCompleteModal({
                                                registeredUser,
                                                onClose
                                              }: RegisterCompleteModalProps) {

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          rounded-xl
          shadow-xl
          p-8
          w-[450px]
        "
      >
        <div
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          登録完了しました
        </div>

        <div className="mb-2">
          ユーザー名
        </div>

        <div
          className="
            border
            rounded
            px-3
            py-2
            mb-4
            bg-gray-100
          "
        >
          {registeredUser.displayName}
        </div>

        <div className="mb-2">
          メールアドレス
        </div>

        <div
          className="
            border
            rounded
            px-3
            py-2
            mb-4
            bg-gray-100
          "
        >
          {registeredUser.email}
        </div>

        <div className="mb-2">
          権限
        </div>

        <div
          className="
            border
            rounded
            px-3
            py-2
            mb-4
            bg-gray-100
          "
        >
          {registeredUser.role}
        </div>

        <div className="mb-2">
          病院名
        </div>

        <div
          className="
            border
            rounded
            px-3
            py-2
            mb-8
            bg-gray-100
          "
        >
          {registeredUser.hospitalName}
        </div>

        <button
          onClick={onClose}
          className="
            w-full
            bg-blue-500
            text-white
            rounded
            py-2
          "
        >
          ログイン画面へ
        </button>

      </div>
    </div>
  )
}