"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

type InspectionCommentModalProps = {
    isOpen: boolean
    initialComment: string
    onClose: () => void
    onSave: (comment: string) => void
}

export default function InspectionCommentModal({
    isOpen,
    initialComment,
    onClose,
    onSave,
}: InspectionCommentModalProps) {
    const [comment, setComment] = useState(initialComment)

    useEffect(() => {
        if (isOpen) setComment(initialComment)
    }, [isOpen, initialComment])

    useEffect(() => {
        if (!isOpen) return
        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = originalOverflow }
    }, [isOpen])

    if (!isOpen) return null

    const handleSave = () => {
        onSave(comment.trim())
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
        >
            <div className="flex h-[45vh] w-full flex-col overflow-hidden rounded-t-2xl border-t border-slate-300 bg-slate-50 shadow-2xl transition-transform duration-200 animate-in slide-in-from-bottom sm:h-auto sm:max-h-[94vh] sm:max-w-lg sm:rounded-2xl sm:border sm:border-slate-300 sm:animate-none">
                <div className="bg-slate-900 px-4 py-2.5 text-white sm:px-5 sm:py-3">
                    <div className="flex justify-center pb-1.5 sm:hidden">
                        <div className="h-1 w-10 rounded-full bg-slate-600" />
                    </div>
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-sm font-bold sm:text-base">備考欄入力</h2>
                            <p className="mt-0.5 text-[11px] text-slate-300">点検に関する特記事項や状態を記録します</p>
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

                <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                    <label className="mb-2 block text-xs font-medium text-slate-500">備考内容</label>
                    <textarea
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="例：微細な擦れ傷あり、動作および流量確認は問題なし"
                        rows={5}
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    />
                </div>

                <div className="flex w-full gap-2 border-t border-slate-200 bg-white p-3 sm:justify-end sm:gap-3 sm:px-5 sm:py-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 sm:h-9 sm:w-24 sm:flex-none sm:text-sm"
                    >
                        キャンセル
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex h-10 flex-1 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white hover:bg-teal-800 sm:h-9 sm:w-24 sm:flex-none sm:text-sm"
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
    )
}