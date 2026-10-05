import { memo } from "react"
import { createPortal } from "react-dom"

type Props = {
  loading: boolean
  message?: string
}

export const LoadingOverlay = memo(function LoadingOverlay({ loading, message = "処理中..." }: Props) {
  if (!loading) return null
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="flex flex-col items-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-white shadow-xl">
        {/* ⭕ hidden md:block により、スマホ画面では非表示（PCのみ表示） */}
        <div className="hidden md:block h-6 w-6 animate-spin rounded-full border-2 border-teal-400 border-t-transparent" />
        {/* スマホ画面ではこの文字だけが表示されます */}
        <span className="text-sm font-medium tracking-wide">{message}</span>
      </div>
    </div>,
    document.body
  )
})