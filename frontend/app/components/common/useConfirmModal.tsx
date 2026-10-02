"use client"

import { useState, useRef, useCallback } from "react"
import { ConfirmButtonPattern, ConfirmVariant } from "./ConfirmModal"

export type OpenConfirmModalParams = {
  title?: string
  message: React.ReactNode
  subMessage?: string
  icon?: "question" | "warning" | "info" | "success" | "none"
  buttonPattern?: ConfirmButtonPattern
  confirmText?: string
  cancelText?: string
  confirmVariant?: ConfirmVariant
  onConfirm?: () => Promise<void> | void
}

export default function useConfirmModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("確認")
  const [message, setMessage] = useState<React.ReactNode>("")
  const [subMessage, setSubMessage] = useState<string | undefined>(undefined)
  const [icon, setIcon] = useState<"question" | "warning" | "info" | "success" | "none">("question")
  const [buttonPattern, setButtonPattern] = useState<ConfirmButtonPattern>("yes_no")
  const [confirmText, setConfirmText] = useState<string | undefined>(undefined)
  const [cancelText, setCancelText] = useState<string | undefined>(undefined)
  const [confirmVariant, setConfirmVariant] = useState<ConfirmVariant>("teal")
  const [onConfirmAction, setOnConfirmAction] = useState<() => Promise<void> | void>(() => () => {})

  const resolverRef = useRef<((value: boolean) => void) | null>(null)

  // モーダルを閉じる
  const closeConfirmModal = useCallback(() => {
    setIsOpen(false)
    if (resolverRef.current) {
      resolverRef.current(false)
      resolverRef.current = null
    }
  }, [])

  // ① コールバック式（openInputModal と同形式）
  const openConfirmModal = useCallback(
    ({
      title = "確認",
      message,
      subMessage,
      icon = "question",
      buttonPattern = "yes_no",
      confirmText,
      cancelText,
      confirmVariant = "teal",
      onConfirm,
    }: OpenConfirmModalParams) => {
      setTitle(title)
      setMessage(message)
      setSubMessage(subMessage)
      setIcon(icon)
      setButtonPattern(buttonPattern)
      setConfirmText(confirmText)
      setCancelText(cancelText)
      setConfirmVariant(confirmVariant)
      setOnConfirmAction(() => onConfirm ?? (() => {}))
      setIsOpen(true)
    },
    []
  )

  // ② await 式（if (!await confirmModal.confirm(...)) return で書ける）
  const confirm = useCallback(
    (params: Omit<OpenConfirmModalParams, "onConfirm">): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve
        openConfirmModal({
          ...params,
          onConfirm: () => {
            resolve(true)
            resolverRef.current = null
          },
        })
      })
    },
    [openConfirmModal]
  )

  // 確定ボタン押下時
  const handleConfirm = useCallback(async () => {
    await onConfirmAction()
    closeConfirmModal()
  }, [onConfirmAction, closeConfirmModal])

  return {
    isOpen,
    title,
    message,
    subMessage,
    icon,
    buttonPattern,
    confirmText,
    cancelText,
    confirmVariant,
    onConfirm: handleConfirm,
    openConfirmModal,
    closeConfirmModal,
    confirm,
  }
}