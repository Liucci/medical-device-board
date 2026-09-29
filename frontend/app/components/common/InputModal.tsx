"use client"

import { useEffect, useRef, useState } from "react"
import CommonModal from "./CommonModal"

type InputModalProps = {
    open: boolean
    onClose: () => void
    onConfirm: (value: string) => void
    title: string
    label?: string

    type?: "text" | "number" | "date" | "time"

    defaultValue?: string
    placeholder?: string

    min?: number
    max?: number
    step?: number

    confirmText?: string
    cancelText?: string

    required?: boolean
}

export default function InputModal({
    open,
    onClose,
    onConfirm,

    title,
    label,

    type = "text",

    defaultValue = "",
    placeholder = "",

    min,
    max,
    step,

    confirmText = "保存",
    cancelText = "キャンセル",

    required = true,
}: InputModalProps) {
    const [value, setValue] = useState(defaultValue)
    const inputRef = useRef<HTMLInputElement>(null)

    // Modalを開いたときに初期値を設定
    // 同時に入力欄へフォーカス
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
        // text
        // 入力制限なし
        if (type === "text") {
            setValue(nextValue)
            return
        }

        // number
        // 数字・小数点・マイナスを許可
        if (type === "number") {
            // 入力途中の状態も許可
            if (
                nextValue === "" ||
                nextValue === "-" ||
                nextValue === "." ||
                nextValue === "-."
            ) {
                setValue(nextValue)
                return
            }

            // 数値として成立する文字列のみ許可
            if (/^-?\d*\.?\d*$/.test(nextValue)) {
                setValue(nextValue)
            }

            return
        }

        // date
        // YYYY/MM/DD
        if (type === "date") {
            const digits = nextValue.replace(/\D/g, "")

            if (digits.length > 8) {
                return
            }

        let formatted = digits

        if (digits.length > 4) {
            formatted =
                digits.slice(0, 4) +
                "/" +
                digits.slice(4)
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

        // time
        // HH:mm
        if (type === "time") {
            // 数字と : 以外は入力不可
            if (!/^[\d:]*$/.test(nextValue)) {
                return
            }

            // 最大5文字
            if (nextValue.length > 5) {
                return
            }

            setValue(nextValue)
        }
    }

    /**
     * date形式を検証
     * YYYY/MM/DD
     */
    const isValidDate = (value: string) => {
        if (!/^\d{4}\/\d{2}\/\d{2}$/.test(value)) {
            return false
        }

        const [year, month, day] = value.split("/").map(Number)

        const date = new Date(year, month - 1, day)

        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        )
    }

    /**
     * time形式を検証
     * HH:mm
     */
    const isValidTime = (value: string) => {
        if (!/^\d{2}:\d{2}$/.test(value)) {
            return false
        }

        const [hour, minute] = value.split(":").map(Number)

        return (
            hour >= 0 &&
            hour <= 23 &&
            minute >= 0 &&
            minute <= 59
        )
    }

    /**
     * 保存
     */
    const handleConfirm = async () => {
        const trimmedValue = value.trim()



        // number
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

        // date
        if (type === "date" && trimmedValue !== "") {
            if (!isValidDate(trimmedValue)) {
                inputRef.current?.focus()
                return
            }
        }

        // time
        if (type === "time" && trimmedValue !== "") {
            if (!isValidTime(trimmedValue)) {
                inputRef.current?.focus()
                return
            }
        }

    onConfirm(trimmedValue)

    }

    /**
     * Enterで保存
     */
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleConfirm()
        }
    }

    /**
     * placeholder
     */
    const resolvedPlaceholder =
        placeholder ||
        (type === "date"
            ? "YYYY/MM/DD"
            : type === "time"
                ? "HH:mm"
                : "")

    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title={title}
            maxWidth="max-w-sm"
        >
            <div className="space-y-5">

                {label && (
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                    </label>
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
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        px-3
                        py-2.5
                        text-sm
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-500/20
                    "
                />

                <div className="flex justify-end gap-2 pt-1">

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-gray-700
                            hover:bg-gray-50
                        "
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="
                            rounded-lg
                            bg-blue-600
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-white
                            hover:bg-blue-700
                        "
                    >
                        {confirmText}
                    </button>

                </div>
            </div>
        </CommonModal>
    )
}