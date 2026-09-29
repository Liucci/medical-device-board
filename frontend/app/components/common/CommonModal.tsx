"use client"

import { ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"
type Props = {
    open: boolean
    onClose: () => void
    children: ReactNode
    maxWidth?: string
    title?: string
    rightContent?: ReactNode
    height?: string
}

export default function CommonModal({
    open,
    onClose,
    children,
    maxWidth = "max-w-md",
    title,
    rightContent,
    height
}: Props)
{
    useEffect(() => {

        if (!open) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose()
            }
        }
        document.addEventListener("keydown", handleKeyDown)
        document.body.style.overflow = "hidden"
        return () => {
                        document.removeEventListener("keydown", handleKeyDown)
                        document.body.style.overflow = ""
        }
    }, [open, onClose])
    if (!open) return null

return createPortal(
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:p-4"
    onClick={onClose}
  >
    <div
      className={`
        relative flex h-full w-full flex-col overflow-hidden
        bg-slate-50 text-slate-900
        sm:h-auto sm:max-h-[94vh]
        sm:rounded-2xl sm:border sm:border-slate-300
        sm:shadow-2xl
        ${maxWidth}
        ${height ?? ""}
      `}
      onClick={(e) => e.stopPropagation()}
    >
    <div className="relative flex h-14 shrink-0 items-center border-b border-slate-700 bg-slate-900 px-4 text-white sm:px-5">
      <button
        type="button"
        onClick={onClose}
        className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white sm:left-5"
        title="閉じる"
        aria-label="閉じる"
      >
        ✕
      </button>

      <h2 className="absolute left-1/2 -translate-x-1/2 truncate text-base font-bold sm:text-lg">
        {title}
      </h2>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {rightContent}
      </div>
    </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  </div>,
  document.body
)  
}