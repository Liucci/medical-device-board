"use client"

import React, { useEffect, useRef, useState } from "react"
import { X, HelpCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react"

export type InputModalButtonPattern =
    | "save_cancel"
    | "ok_cancel"
    | "yes_no"
    | "ok_only"

export type InputModalVariant = "teal" | "danger" | "blue" | "slate"
export type InputModalType = "text" | "number" | "date" | "time" | "confirm"

export type InputModalProps = {
    open: boolean
    onClose: () => void
    onConfirm: (value: string) => void
    title: string

    // 二択確認用
    message?: React.ReactNode
    subMessage?: string
    icon?: "question" | "warning" | "info" | "success" | "none"

    // 入力用
    label?: string
    description?: string
    type?: InputModalType

    defaultValue?: string
    placeholder?: string

    min?: number
    max?: number
    step?: number

    buttonPattern?: InputModalButtonPattern
    confirmText?: string
    cancelText?: string
    confirmVariant?: InputModalVariant
    required?: boolean
    /**
     * 親モーダル（z-50）の上に重ねて開くためデフォルトで z-[60]
     */
    zIndex?: string
}

const PATTERN_DEFAULTS = {
    save_cancel: { confirm: "保存", cancel: "キャンセル" },
    ok_cancel: { confirm: "OK", cancel: "キャンセル" },
    yes_no: { confirm: "はい", cancel: "いいえ" },
    ok_only: { confirm: "OK", cancel: null },
}

export default function InputModal({
    open,
    onClose,
    onConfirm,
    title,
    message,
    subMessage,
    icon,
    label,
    description,
    type = "text",
    defaultValue = "",
    placeholder = "",
    min,
    max,
    step,
    buttonPattern,
    confirmText,
    cancelText,
    confirmVariant = "teal",
    required = true,
    zIndex = "z-[60]",
}: InputModalProps) {
    const [value, setValue] = useState(defaultValue)
    const inputRef = useRef<HTMLInputElement>(null)
    const confirmButtonRef = useRef<HTMLButtonElement>(null)

    const isConfirmMode = type === "confirm"
    const effectivePattern = buttonPattern ?? (isConfirmMode ? "yes_no" : "save_cancel")
    const patternConfig = PATTERN_DEFAULTS[effectivePattern] ?? PATTERN_DEFAULTS.save_cancel

    const resolvedConfirmText = confirmText ?? patternConfig.confirm
    const resolvedCancelText = cancelText !== undefined ? cancelText : patternConfig.cancel

    // ESCキー押下で閉じる
    useEffect(() => {
        if (!open) return
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [open, onClose])

    // 開いたときの初期値＆フォーカス
    useEffect(() => {
        if (!open) return
        setValue(defaultValue)
        requestAnimationFrame(() => {
            if (isConfirmMode) {
                confirmButtonRef.current?.focus()
            } else {
                inputRef.current?.focus()
                inputRef.current?.select()
            }
        })
    }, [open, defaultValue, isConfirmMode])

    const handleChange = (nextValue: string) => {
        if (type === "text" || type === "confirm") {
            setValue(nextValue)
            return
        }
        if (type === "number") {
            if (nextValue === "" || nextValue === "-" || nextValue === "." || nextValue === "-.") {
                setValue(nextValue)
                return
            }
            if (/^-?\d*\.?\d*$/.test(nextValue)) setValue(nextValue)
            return
        }
        if (type === "date") {
            const digits = nextValue.replace(/\D/g, "")
            if (digits.length > 8) return
            let formatted = digits
            if (digits.length > 4) formatted = digits.slice(0, 4) + "/" + digits.slice(4)
            if (digits.length > 6) formatted = digits.slice(0, 4) + "/" + digits.slice(4, 6) + "/" + digits.slice(6)
            setValue(formatted)
            return
        }
        if (type === "time") {
            if (!/^[\d:]*$/.test(nextValue)) return
            if (nextValue.length > 5) return
            setValue(nextValue)
        }
    }

    const handleConfirm = () => {
        if (isConfirmMode) {
            onConfirm(defaultValue)
            return
        }
        const trimmed = value.trim()
        if (required && trimmed === "") {
            inputRef.current?.focus()
            return
        }
        onConfirm(trimmed)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleConfirm()
        }
    }

    if (!open) return null

    const confirmColors = {
        teal: "bg-teal-700 hover:bg-teal-800 text-white active:bg-teal-900",
        danger: "bg-rose-600 hover:bg-rose-700 text-white active:bg-rose-800",
        blue: "bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800",
        slate: "bg-slate-800 hover:bg-slate-900 text-white active:bg-slate-950",
    }[confirmVariant] || "bg-teal-700 text-white"

    const effectiveIcon = icon ?? (isConfirmMode ? "question" : "none")
    const iconElements = {
        question: (
            <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
            </div>
        ),
        warning: (
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
            </div>
        ),
        info: (
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
            </div>
        ),
        success: (
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
            </div>
        ),
        none: null,
    }[effectiveIcon]

    return (
        <div
            role="dialog"
            aria-modal="true"
            className={`fixed inset-0 ${zIndex} flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200`}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div
                className="w-full max-w-md rounded-t-3xl sm:rounded-2xl border-t sm:border border-slate-200 bg-white shadow-2xl overflow-hidden transform transition-all duration-200 animate-in slide-in-from-bottom duration-200 sm:slide-in-from-bottom-0 sm:zoom-in-95 max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* スマホ専用のグラブバー（上部のつまみ） */}
                <div className="pt-2.5 pb-1 sm:hidden flex justify-center shrink-0 bg-slate-50/80">
                    <div className="w-10 h-1 bg-slate-300 rounded-full" />
                </div>

                {/* ヘッダー */}
                <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-50/80 shrink-0">
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors cursor-pointer"
                        aria-label="閉じる"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* コンテンツ本体 */}
                <div
                    className="overflow-y-auto flex-1 bg-slate-50 p-4 sm:p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
                    onKeyDown={handleKeyDown}
                >
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 space-y-4">
                        {/* 二択メッセージ表示 */}
                        {message && (
                            <div className="flex items-start gap-3">
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
                        )}

                        {/* 入力欄（type !== "confirm" の場合） */}
                        {!isConfirmMode && (
                            <div className="space-y-1.5">
                                {label && (
                                    <label className="block text-xs font-bold text-slate-700">
                                        {label}
                                        {required && <span className="ml-1 text-rose-600">*</span>}
                                    </label>
                                )}
                                {description && (
                                    <p className="text-xs text-slate-500">{description}</p>
                                )}
                                <input
                                    ref={inputRef}
                                    type="text"
                                    inputMode={
                                        type === "number"
                                            ? "decimal"
                                            : type === "date" || type === "time"
                                            ? "numeric"
                                            : "text"
                                    }
                                    value={value}
                                    onChange={(e) => handleChange(e.target.value)}
                                    placeholder={
                                        placeholder ||
                                        (type === "date" ? "YYYY/MM/DD" : type === "time" ? "HH:mm" : "")
                                    }
                                    className="
                                        h-11 w-full rounded-lg border border-slate-300 bg-white px-3
                                        text-sm font-medium text-slate-900 outline-none
                                        focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15
                                    "
                                />
                            </div>
                        )}

                        {/* ボタン配置（スマホは押しやすい横並び均等2分割、PCは右寄せ） */}
                        <div className="grid grid-cols-2 gap-2 pt-1 sm:flex sm:flex-row sm:justify-end">
                            {resolvedCancelText !== null && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="
                                        h-11 sm:h-10 rounded-lg border border-slate-200 bg-slate-50 px-4
                                        text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200 cursor-pointer
                                    "
                                >
                                    {resolvedCancelText}
                                </button>
                            )}

                            <button
                                ref={confirmButtonRef}
                                type="button"
                                onClick={handleConfirm}
                                className={`
                                    h-11 sm:h-10 rounded-lg px-4 text-xs font-bold transition-all active:scale-[0.99] cursor-pointer ${confirmColors}
                                `}
                            >
                                {resolvedConfirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}