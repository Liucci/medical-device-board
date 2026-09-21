"use client"

import { useEffect, useState } from "react"
import CommonModal from "../../components/common/CommonModal"

type InspectionCommentModalProps = {
    isOpen: boolean
    initialComment: string
    onClose: () => void
    onSave: (comment: string) => void
}

export default function InspectionCommentModal({
    isOpen,
    initialComment,
    onClose,
    onSave,
}: InspectionCommentModalProps) {

    const [comment, setComment] = useState(initialComment)

    useEffect(() => {
        if (isOpen) {
            setComment(initialComment)
        }
    }, [isOpen, initialComment])

    const handleSave = () => {
        onSave(comment)
    }

    return (
        <CommonModal
            open={isOpen}
            onClose={onClose}
            title="備考"
        >
            <div className="space-y-5">

                <p className="text-sm text-gray-600">
                    点検に関する備考を入力してください。
                </p>

                <textarea
                    value={comment}
                    onChange={event => setComment(event.target.value)}
                    rows={6}
                    className="
                        w-full
                        resize-y
                        rounded-lg
                        border
                        border-gray-400
                        bg-white
                        px-4
                        py-3
                        text-sm
                        text-gray-800
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                    "
                    placeholder="備考を入力してください"
                />

                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            border
                            border-gray-400
                            bg-white
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-gray-700
                            transition
                            hover:bg-gray-50
                        "
                    >
                        キャンセル
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="
                            rounded-lg
                            bg-blue-600
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            shadow-sm
                            transition
                            hover:bg-blue-700
                        "
                    >
                        保存
                    </button>

                </div>

            </div>
        </CommonModal>
    )
}