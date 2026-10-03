"use client"

import React from "react"

type Props = {
  onAdd: () => void
  title: string
  titleSize?: string
  icon: React.ReactNode
}

export default function ButtonGrid({ onAdd, title, titleSize = "text-[10px]", icon }: Props) {
 //console.log("ButtonGrid")
  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={title}
      className="group flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white p-1.5 shadow-2xs transition-all duration-150 hover:border-teal-400 hover:bg-teal-50/50 hover:shadow-sm active:scale-[0.98]"
    >
      {/* 3/5スケール（24px×24px）の小型アイコンバッジ */}
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 transition-colors duration-150 group-hover:bg-teal-600 group-hover:text-white">
        {icon}
      </div>

      {/* 3/5スケール（10px）のコンパクトラベル */}
      <span className={`min-w-0 truncate font-bold text-slate-800 transition-colors duration-150 group-hover:text-teal-950 ${titleSize}`}>
        {title}
      </span>
    </button>
  )
}