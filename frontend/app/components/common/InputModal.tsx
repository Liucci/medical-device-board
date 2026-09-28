"use client"

import { useEffect, useRef, useState } from "react"
import CommonModal from "./CommonModal"

type InputModalProps = {
open: boolean
onClose: () => void
onConfirm: (value: string) => void


title: string
label?: string

type?: "text" | "number"

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

    // CommonModalの表示後にフォーカス
    requestAnimationFrame(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
    })
}, [open, defaultValue])

const handleConfirm = () => {
    const trimmedValue = value.trim()

    // 必須入力の場合
    if (required && trimmedValue === "") {
        inputRef.current?.focus()
        return
    }

    // 数値入力の場合
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

    onConfirm(trimmedValue)
}

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        e.preventDefault()
        handleConfirm()
    }
}

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
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                min={type === "number" ? min : undefined}
                max={type === "number" ? max : undefined}
                step={type === "number" ? step : undefined}
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
