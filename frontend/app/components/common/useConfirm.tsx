"use client"

import React, { useState, useCallback, useRef } from "react"
import ConfirmModal, {
    ConfirmModalVariant,
    ConfirmModalButtonPattern,
} from "./ConfirmModal"

export type ConfirmOptions = {
    title?: string
    message: React.ReactNode
    subMessage?: string
    buttonPattern?: ConfirmModalButtonPattern
    confirmText?: string
    cancelText?: string
    confirmVariant?: ConfirmModalVariant
    icon?: "question" | "warning" | "info" | "success" | "none"
}

export function useConfirm() {
    const [state, setState] = useState<{
        open: boolean
        options: ConfirmOptions
    }>({
        open: false,
        options: {
            title: "確認",
            message: "",
        },
    })

    const resolverRef = useRef<((value: boolean) => void) | null>(null)

    const confirmAsync = useCallback(
        (optionsOrMessage: ConfirmOptions | string): Promise<boolean> => {
            const options: ConfirmOptions =
                typeof optionsOrMessage === "string"
                    ? { message: optionsOrMessage, title: "確認" }
                    : optionsOrMessage

            return new Promise<boolean>((resolve) => {
                resolverRef.current = resolve
                setState({
                    open: true,
                    options: {
                        buttonPattern: "yes_no",
                        title: options.title || "確認",
                        ...options,
                    },
                })
            })
        },
        []
    )

    const handleConfirm = useCallback(() => {
        setState((prev) => ({ ...prev, open: false }))
        if (resolverRef.current) {
            resolverRef.current(true)
            resolverRef.current = null
        }
    }, [])

    const handleClose = useCallback(() => {
        setState((prev) => ({ ...prev, open: false }))
        if (resolverRef.current) {
            resolverRef.current(false)
            resolverRef.current = null
        }
    }, [])

    const ConfirmModalElement = (
        <ConfirmModal
            open={state.open}
            onClose={handleClose}
            onConfirm={handleConfirm}
            title={state.options.title || "確認"}
            message={state.options.message}
            subMessage={state.options.subMessage}
            buttonPattern={state.options.buttonPattern ?? "yes_no"}
            confirmText={state.options.confirmText}
            cancelText={state.options.cancelText}
            confirmVariant={state.options.confirmVariant ?? "teal"}
            icon={state.options.icon ?? "question"}
        />
    )

    return {
        confirmAsync,
        ConfirmModalElement,
        isConfirmOpen: state.open,
    }
}