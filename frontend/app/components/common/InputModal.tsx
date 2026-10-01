"use client"

import React, { useEffect, useRef, useState } from "react"
import CommonModal from "./CommonModal"

export type InputModalButtonPattern =
    | "save_cancel"
    | "ok_cancel"
    | "yes_no"
    | "ok_only"
    | "save"
    | "ok"
    | "yesno"

export type InputModalVariant = "teal" | "danger" | "blue" | "slate"

export type InputModalProps = {
    open: boolean
    onClose: () => void
    onConfirm: (value: string) => void
    title: string
    label?: string
    description?: string

    type?: "text" | "number" | "date" | "time"

    defaultValue?: string
    placeholder?: string

    min?: number
    max?: number
    step?: number

    /**
     * ボタンの表示パターン（省略時は従来の "save_cancel" となり既存コードを壊しません）
     * - "save_cancel": 「保存」/「キャンセル」【デフォルト】
     * - "ok_cancel":   「OK」/「キャンセル」
     * - "yes_no":      「はい」/「いいえ」
     * - "ok_only":     「OK」のみ
     */
    buttonPattern?: InputModalButtonPattern

    /**
     * 確定ボタンのテキスト（指定した場合は pattern より優先されます）
     */
    confirmText?: string

    /**
     * キャンセルボタンのテキスト（指定した場合は pattern より優先されます）
     */
    cancelText?: string

    /**
     * 確定ボタンの色（省略時は従来のティール色）
     * "teal" | "danger" (赤色・削除等の「はい」向け) | "blue" | "slate"
     */
    confirmVariant?: InputModalVariant

    required?: boolean
}

// パターンごとのデフォルトボタン文字列定義
const PATTERN_DEFAULTS: Record<
    string,
    { confirm: string; cancel: string | null }
> = {
    save_cancel: { confirm: "保存", cancel: "キャンセル" },
    save: { confirm: "保存", cancel: "キャンセル" },
    ok_cancel: { confirm: "OK", cancel: "キャンセル" },
    ok: { confirm: "OK", cancel: "キャンセル" },
    yes_no: { confirm: "はい", cancel: "いいえ" },
    yesno: { confirm: "はい", cancel: "いいえ" },
    ok_only: { confirm: "OK", cancel: null },
}

export default function InputModal({
    open,
    onClose,
    onConfirm,

    title,
    label,
    description,

    type = "text",

    defaultValue = "",
    placeholder = "",

    min,
    max,
    step,

    buttonPattern = "save_cancel",
    confirmText,
    cancelText,
    confirmVariant = "teal",

    required = true,
}: InputModalProps) {
    const [value, setValue] = useState(defaultValue)
    const inputRef = useRef<HTMLInputElement>(null)

    // パターンの解決（confirmText/cancelText の直接指定があればそれを最優先）
    const patternConfig =
        PATTERN_DEFAULTS[buttonPattern] ?? PATTERN_DEFAULTS.save_cancel

    const resolvedConfirmText = confirmText ?? patternConfig.confirm
    const resolvedCancelText =
        cancelText !== undefined ? cancelText : patternConfig.cancel

    // Modalを開いたときに初期値を設定＆フォーカス
    useEffect(() => {
        if (!open) return

        setValue(defaultValue)

        requestAnimationFrame(() => {
            inputRef.current?.focus()
            inputRef.current?.select()
        })
    }, [open, defaultValue])

    /**
     * 入力値を種類ごとに制限
     */
    const handleChange = (nextValue: string) => {
        if (type === "text") {
            setValue(nextValue)
            return
        }

        if (type === "number") {
            if (
                nextValue === "" ||
                nextValue === "-" ||
                nextValue === "." ||
                nextValue === "-."
            ) {
                setValue(nextValue)
                return
            }

            if (/^-?\d*\.?\d*$/.test(nextValue)) {
                setValue(nextValue)
            }
            return
        }

        if (type === "date") {
            const digits = nextValue.replace(/\D/g, "")
            if (digits.length > 8) return

            let formatted = digits
            if (digits.length > 4) {
                formatted = digits.slice(0, 4) + "/" + digits.slice(4)
            }
            if (digits.length > 6) {
                formatted =
                    digits.slice(0, 4) +
                    "/" +
                    digits.slice(4, 6) +
                    "/" +
                    digits.slice(6)
            }

            setValue(formatted)
            return
        }

        if (type === "time") {
            if (!/^[\d:]*$/.test(nextValue)) return
            if (nextValue.length > 5) return
            setValue(nextValue)
        }
    }

    const isValidDate = (val: string) => {
        if (!/^\d{4}\/\d{2}\/\d{2}$/.test(val)) return false
        const [year, month, day] = val.split("/").map(Number)
        const date = new Date(year, month - 1, day)
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        )
    }

    const isValidTime = (val: string) => {
        if (!/^\d{2}:\d{2}$/.test(val)) return false
        const [hour, minute] = val.split(":").map(Number)
        return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59
    }

    /**
     * 保存 / 確定
     */
    const handleConfirm = async () => {
        const trimmedValue = value.trim()

        if (required && trimmedValue === "") {
            inputRef.current?.focus()
            return
        }

        if (type === "number" && trimmedValue !== "") {
            const numberValue = Number(trimmedValue)
            if (Number.isNaN(numberValue)) {
                inputRef.current?.focus()
                return
            }
            if (min !== undefined && numberValue < min) {
                inputRef.current?.focus()
                return
            }
            if (max !== undefined && numberValue > max) {
                inputRef.current?.focus()
                return
            }
        }

        if (type === "date" && trimmedValue !== "") {
            if (!isValidDate(trimmedValue)) {
                inputRef.current?.focus()
                return
            }
        }

        if (type === "time" && trimmedValue !== "") {
            if (!isValidTime(trimmedValue)) {
                inputRef.current?.focus()
                return
            }
        }

        onConfirm(trimmedValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleConfirm()
        }
    }

    const resolvedPlaceholder =
        placeholder ||
        (type === "date"
            ? "YYYY/MM/DD"
            : type === "time"
                ? "HH:mm"
                : "")

    const confirmButtonClasses = {
        teal: "bg-teal-700 hover:bg-teal-800 text-white focus:ring-teal-600/20",
        danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-600/20",
        blue: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-600/20",
        slate: "bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-700/20",
    }[confirmVariant] || "bg-teal-700 hover:bg-teal-800 text-white"

    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title={title}
            maxWidth="max-w-md"
        >
            <div className="bg-slate-50 p-4 sm:p-5">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="space-y-4">
                        {label && (
                            <label className="block text-xs font-bold tracking-wide text-slate-700">
                                {label}
                                {required && (
                                    <span className="ml-1 text-rose-600">*</span>
                                )}
                            </label>
                        )}

                        {description && (
                            <p className="text-xs text-slate-500 -mt-2">
                                {description}
                            </p>
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
                            onKeyDown={handleKeyDown}
                            placeholder={resolvedPlaceholder}
                            className="
                                h-11 w-full rounded-lg
                                border border-slate-300
                                bg-white px-3
                                text-sm font-medium text-slate-900
                                outline-none
                                transition-colors
                                placeholder:text-slate-400
                                focus:border-teal-600
                                focus:ring-2
                                focus:ring-teal-600/15
                            "
                        />

                        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                            {resolvedCancelText !== null && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="
                                        h-10 rounded-lg
                                        border border-slate-200
                                        bg-slate-50 px-4
                                        text-xs font-bold text-slate-700
                                        transition-colors
                                        hover:bg-slate-100
                                        cursor-pointer
                                    "
                                >
                                    {resolvedCancelText}
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleConfirm}
                                className={`
                                    h-10 rounded-lg px-4
                                    text-xs font-bold
                                    transition-colors
                                    active:scale-[0.99]
                                    cursor-pointer
                                    ${confirmButtonClasses}
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