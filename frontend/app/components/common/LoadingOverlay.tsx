"use client"

import { createPortal } from "react-dom"

type Props = {
  loading: boolean
  message?: string
}

export function LoadingOverlay({
                                  loading,
                                  message = "処理中..."
                                }: Props)
{
  if (!loading) {return null}

  return createPortal(

    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/30
      "
    >
      <div
        className="
          bg-white
          rounded-xl
          shadow-xl
          px-8
          py-6
          flex
          flex-col
          items-center
          gap-3
        "
      >

        <div
          className="
            w-10
            h-10
            border-4
            border-gray-300
            border-t-blue-500
            rounded-full
            animate-spin
          "
        />

        <div
          className="
            text-lg
            font-bold
            text-gray-700
          "
        >
          {message}
        </div>

      </div>
    </div>,

    document.body

  )
}