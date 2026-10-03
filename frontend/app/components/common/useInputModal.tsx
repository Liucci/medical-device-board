"use client"

import React, { useState, useRef, useCallback } from "react"
// InputModalのインポートパスを確認してください
import InputModal, {
    InputModalButtonPattern,
    InputModalVariant,
    InputModalType,
} from "./InputModal"

export type OpenInputModalParams = {
    title: string
    label?: string
    description?: string

    // 二択用
    message?: React.ReactNode
    subMessage?: string
    icon?: "question" | "warning" | "info" | "success" | "none"

    type?: InputModalType
    value?: string
    placeholder?: string
    required?: boolean

    min?: number
    max?: number
    step?: number

    buttonPattern?: InputModalButtonPattern
    confirmText?: string
    cancelText?: string
    confirmVariant?: InputModalVariant

    onConfirm?: (value: string) => Promise<void> | void
}

export type ConfirmParams = {
    title?: string
    message: React.ReactNode
    subMessage?: string
    buttonPattern?: InputModalButtonPattern
    confirmText?: string
    cancelText?: string
    confirmVariant?: InputModalVariant
    icon?: "question" | "warning" | "info" | "success" | "none"
}

export default function useInputModal() {
    const [isOpen, setIsOpen] = useState(false)

    const [title, setTitle] = useState("")
    const [message, setMessage] = useState<React.ReactNode | undefined>(undefined)
    const [subMessage, setSubMessage] = useState<string | undefined>(undefined)
    const [icon, setIcon] = useState<"question" | "warning" | "info" | "success" | "none" | undefined>(undefined)

    const [label, setLabel] = useState("")
    const [description, setDescription] = useState<string | undefined>(undefined)
    const [type, setType] = useState<InputModalType>("text")
    const [value, setValue] = useState("")
    const [placeholder, setPlaceholder] = useState("")
    const [required, setRequired] = useState(true)

    const [min, setMin] = useState<number | undefined>(undefined)
    const [max, setMax] = useState<number | undefined>(undefined)
    const [step, setStep] = useState<number | undefined>(undefined)

    const [buttonPattern, setButtonPattern] = useState<InputModalButtonPattern | undefined>(undefined)
    const [confirmText, setConfirmText] = useState<string | undefined>(undefined)
    const [cancelText, setCancelText] = useState<string | undefined>(undefined)
    const [confirmVariant, setConfirmVariant] = useState<InputModalVariant | undefined>("teal")

    const [onConfirm, setOnConfirm] = useState<(value: string) => Promise<void> | void>(() => () => {})

    const confirmResolverRef = useRef<((value: boolean) => void) | null>(null)

    // ① 通常の入力モーダル（RoomDeviceInfoModal や StockInfoModal が使用）
    const openInputModal = ({
        title,
        message,
        subMessage,
        icon,
        label,
        description,
        type = "text",
        value = "",
        placeholder = "",
        required = true,
        min,
        max,
        step,
        buttonPattern,
        confirmText,
        cancelText,
        confirmVariant = "teal",
        onConfirm,
    }: OpenInputModalParams) => {
        setTitle(title)
        setMessage(message)
        setSubMessage(subMessage)
        setIcon(icon)
        setLabel(label ?? "")
        setDescription(description)
        setType(type)
        setValue(value)
        setPlaceholder(placeholder)
        setRequired(required)
        setMin(min)
        setMax(max)
        setStep(step)
        setButtonPattern(buttonPattern)
        setConfirmText(confirmText)
        setCancelText(cancelText)
        setConfirmVariant(confirmVariant)
        setOnConfirm(() => onConfirm ?? (() => {}))
        setIsOpen(true)
    }

    // ② 二択確認用メソッド（Page.tsx が await inputModal.confirm で使用）
    const confirm = useCallback(
        (optionsOrMessage: ConfirmParams | string): Promise<boolean> => {
            const options: ConfirmParams =
                typeof optionsOrMessage === "string"
                    ? { message: optionsOrMessage, title: "確認" }
                    : optionsOrMessage

            return new Promise<boolean>((resolve) => {
                confirmResolverRef.current = resolve

                openInputModal({
                    title: options.title || "確認",
                    message: options.message,
                    subMessage: options.subMessage,
                    icon: options.icon ?? "question",
                    type: "confirm", // 二択モード
                    buttonPattern: options.buttonPattern ?? "yes_no", // はい / いいえ
                    confirmText: options.confirmText,
                    cancelText: options.cancelText,
                    confirmVariant: options.confirmVariant ?? "teal",
                    onConfirm: () => {
                        resolve(true)
                        confirmResolverRef.current = null
                    },
                })
            })
        },
        []
    )

    const closeInputModal = useCallback(() => {
        setIsOpen(false)
        if (confirmResolverRef.current) {
            confirmResolverRef.current(false)
            confirmResolverRef.current = null
        }
    }, [])

    // ③ JSX用エレメント（Page.tsx の最下部で {inputModal.ModalElement} と置くだけ）
    const ModalElement = (
        <InputModal
            open={isOpen}
            onClose={closeInputModal}
            onConfirm={async (val) => {
                await onConfirm(val)
                closeInputModal()
            }}
            title={title}
            message={message}
            subMessage={subMessage}
            icon={icon}
            label={label}
            description={description}
            type={type}
            defaultValue={value}
            placeholder={placeholder}
            required={required}
            min={min}
            max={max}
            step={step}
            buttonPattern={buttonPattern}
            confirmText={confirmText}
            cancelText={cancelText}
            confirmVariant={confirmVariant}
        />
    )

    return {
        isOpen,
        title,
        message,
        subMessage,
        icon,
        label,
        description,
        type,
        value,
        placeholder,
        required,
        min,
        max,
        step,
        buttonPattern,
        confirmText,
        cancelText,
        confirmVariant,
        onConfirm,
        openInputModal,
        closeInputModal,
        confirm,
        ModalElement,
    }
}