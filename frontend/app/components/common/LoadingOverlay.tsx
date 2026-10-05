import { memo } from "react"
import { createPortal } from "react-dom"

type Props = {
  loading: boolean
  message?: string
}

export const LoadingOverlay = memo(function LoadingOverlay({ loading, message = "処理中..." }: Props) {
  //console.log("LoadingOverlay")
  if (!loading) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="flex flex-col items-center gap-2 rounded-xl bg-slate-800 p-4 text-white shadow-xl">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-400 border-t-transparent" />
        <span className="text-xs">{message}</span>
      </div>
    </div>,
    document.body
  )
})