"use client"

import { createPortal } from "react-dom"

type Props = {
  loading: boolean
  message?: string
}

export function LoadingOverlay({ loading, message = "処理中..." }: Props) {
  console.log("LoadingOverlay")
  if (!loading) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 p-4">
      <div className="flex flex-col items-center gap-2 rounded-xl bg-white px-6 py-3.5 shadow-xl sm:gap-3 sm:px-8 sm:py-6">
        {/* ★ スマホ（sm未満）ではスピナーを非表示にし、PCでのみ表示 */}
        <div className="hidden h-10 w-10 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin sm:block" />
        <div className="text-sm font-bold text-gray-700 sm:text-lg">{message}</div>
      </div>
    </div>,
    document.body
  )
}