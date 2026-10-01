"use client"

import React, { useEffect, useRef } from "react"
import CommonModal from "./CommonModal"
import { HelpCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react"

export type ConfirmModalVariant = "teal" | "danger" | "blue" | "slate"
export type ConfirmModalButtonPattern = "yes_no" | "ok_cancel"

export type ConfirmModalProps = {
    open: boolean
    onClose: () => void
    onConfirm: () => void

    title: string
    message: React.ReactNode
    subMessage?: string

    /**
     * ボタンパターン
     * - "yes_no": 「はい」/「いいえ」【デフォルト】
     * - "ok_cancel": 「OK」/「キャンセル」
     */
    buttonPattern?: ConfirmModalButtonPattern

    confirmText?: string
    cancelText?: string

    /**
     * 確定ボタンの色 (通常は "teal", ログアウトや削除などの注意喚起は "danger")
     */
    confirmVariant?: ConfirmModalVariant
    icon?: "question" | "warning" | "info" | "success" | "none"
}

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,

    title,
    message,
    subMessage,

    buttonPattern = "yes_no",
    confirmText,
    cancelText,
    confirmVariant = "teal",
    icon = "question",
}: ConfirmModalProps) {
    const confirmButtonRef = useRef<HTMLButtonElement>(null)

    const isYesNo = buttonPattern === "yes_no"
    const resolvedConfirmText = confirmText ?? (isYesNo ? "はい" : "OK")
    const resolvedCancelText = cancelText ?? (isYesNo ? "いいえ" : "キャンセル")

    // モーダル表示時に「はい」ボタンへ自動フォーカス
    useEffect(() => {
        if (!open) return
        requestAnimationFrame(() => {
            confirmButtonRef.current?.focus()
        })
    }, [open])

    // Enterで「はい」、EscはCommonModal側で「いいえ」
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            onConfirm()
        }
    }

    const confirmColors = {
        teal: "bg-teal-700 hover:bg-teal-800 text-white focus:ring-teal-600/20",
        danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-600/20",
        blue: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-600/20",
        slate: "bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-700/20",
    }[confirmVariant] || "bg-teal-700 hover:bg-teal-800 text-white"

    const iconElements = {
        question: (
            <div className="w-10 h-10 rounded-full bg-teal-100/80 text-teal-700 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
            </div>
        ),
        warning: (
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
            </div>
        ),
        info: (
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
            </div>
        ),
        success: (
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
            </div>
        ),
        none: null,
    }[icon]

    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title={title}
            maxWidth="max-w-md"
        >
            <div className="bg-slate-50 p-4 sm:p-5" onKeyDown={handleKeyDown}>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3.5">
                            {iconElements}
                            <div className="flex-1 pt-0.5">
                                <div className="text-sm font-bold text-slate-800 leading-snug">
                                    {message}
                                </div>
                                {subMessage && (
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        {subMessage}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 二択ボタン（いいえ / はい） */}
                        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="
                                    h-10 rounded-lg
                                    border border-slate-200
                                    bg-slate-50 px-5
                                    text-xs font-bold text-slate-700
                                    transition-colors
                                    hover:bg-slate-100
                                    cursor-pointer
                                "
                            >
                                {resolvedCancelText}
                            </button>

                            <button
                                ref={confirmButtonRef}
                                type="button"
                                onClick={onConfirm}
                                className={`
                                    h-10 rounded-lg px-6
                                    text-xs font-bold
                                    transition-colors
                                    active:scale-[0.99]
                                    cursor-pointer
                                    ${confirmColors}
                                `}
                            >
                                {resolvedConfirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </CommonModal>
    )
}