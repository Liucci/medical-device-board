"use client"

import { useEffect } from "react"
import { Check, X } from "lucide-react"

type InspectionOverallResultModalProps = {
    isOpen: boolean
    onClose: () => void
    onSelect: (result: "OK" | "NG") => void
}

export default function InspectionOverallResultModal({
    isOpen,
    onClose,
    onSelect,
}: InspectionOverallResultModalProps) {

    useEffect(() => {
        if (!isOpen) return
        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = originalOverflow }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
        >
            <div className="flex w-full flex-col overflow-hidden rounded-t-2xl border-t border-slate-300 bg-slate-50 shadow-2xl transition-transform duration-200 animate-in slide-in-from-bottom sm:max-w-md sm:rounded-2xl sm:border sm:border-slate-300 sm:animate-none">
                <div className="bg-slate-900 px-4 py-2.5 text-white sm:px-5 sm:py-3">
                    <div className="flex justify-center pb-1.5 sm:hidden">
                        <div className="h-1 w-10 rounded-full bg-slate-600" />
                    </div>
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-sm font-bold sm:text-base">点検総合判定</h2>
                            <p className="mt-0.5 text-[11px] text-slate-300">今回の点検総合結果を選択してください</p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white sm:h-8 sm:w-8"
                            title="閉じる"
                            aria-label="閉じる"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <button
                            type="button"
                            onClick={() => onSelect("OK")}
                            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 p-4 transition-all hover:bg-emerald-100 hover:border-emerald-500 active:scale-98 sm:p-5"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md transition-transform group-hover:scale-105 sm:h-14 sm:w-14">
                                <Check className="h-7 w-7 stroke-[3]" />
                            </div>
                            <span className="mt-2.5 text-lg font-black tracking-wide text-emerald-800 sm:text-xl">OK</span>
                            <span className="text-[11px] font-bold text-emerald-600">正常・使用可</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onSelect("NG")}
                            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-rose-300 bg-rose-50/70 p-4 transition-all hover:bg-rose-100 hover:border-rose-500 active:scale-98 sm:p-5"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-md transition-transform group-hover:scale-105 sm:h-14 sm:w-14">
                                <X className="h-7 w-7 stroke-[3]" />
                            </div>
                            <span className="mt-2.5 text-lg font-black tracking-wide text-rose-800 sm:text-xl">NG</span>
                            <span className="text-[11px] font-bold text-rose-600">要対応・修理</span>
                        </button>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-full items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 sm:w-32 sm:text-sm"
                        >
                            キャンセル
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}