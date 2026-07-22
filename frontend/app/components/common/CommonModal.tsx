"use client"

import { ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"

type Props = {
                open: boolean
                onClose: () => void
                children: ReactNode
                maxWidth?: string
}

export default function CommonModal({
                                        open,
                                        onClose,
                                        children,
                                        maxWidth = "max-w-md"
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
                    rounded-xl
                    bg-white
                    shadow-xl
                `}
                onClick={(e) => e.stopPropagation()}
            >

                {children}

            </div>

        </div>,

        document.body

    )
}