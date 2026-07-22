"use client"

import { ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"
type Props = {
    open: boolean
    onClose: () => void
    children: ReactNode
    maxWidth?: string
    title?: string
    rightContent?: ReactNode
    height?: string
}

export default function CommonModal({
    open,
    onClose,
    children,
    maxWidth = "max-w-md",
    title,
    rightContent,
    height
}: Props)
{
    useEffect(() => {

        if (!open) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose()
            }
        }
        document.addEventListener("keydown", handleKeyDown)
        document.body.style.overflow = "hidden"
        return () => {
                        document.removeEventListener("keydown", handleKeyDown)
                        document.body.style.overflow = ""
        }
    }, [open, onClose])
    if (!open) return null

    return createPortal(

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/30
                p-4
            "
            onClick={onClose}
        >

            <div
                className={`
                    relative
                    w-full
                    ${maxWidth}
                    ${height ?? ""}
                    rounded-xl
                    bg-white
                    shadow-xl
                    p-6
                    flex
                    flex-col
                `}
                onClick={(e) => e.stopPropagation()}
            >

                    <div className="flex items-center justify-between mb-4">

                        <button
                            onClick={onClose}
                            className="text-xl text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold">
                            {title}
                        </h2>

                        <div>
                            {rightContent}
                        </div>

                    </div>

                {children}

            </div>

        </div>,

        document.body

    )
}