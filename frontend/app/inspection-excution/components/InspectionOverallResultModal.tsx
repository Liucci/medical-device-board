"use client"

import CommonModal from "../../components/common/CommonModal"

type InspectionOverallResultModalProps = {
    isOpen: boolean
    onClose: () => void
    onSelect: (result: "OK" | "NG") => void
}

export default function InspectionOverallResultModal({
    isOpen,
    onClose,
    onSelect,
}: InspectionOverallResultModalProps) {

    return (
        <CommonModal
            open={isOpen}
            onClose={onClose}
            title="点検総合判定"
        >
            <div className="space-y-7">

                {/* 説明 */}
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                        今回の点検結果を選択してください
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        選択した判定は点検記録に保存されます
                    </p>
                </div>

                {/* 判定選択 */}
                <div className="grid grid-cols-2 gap-4">

                    {/* OK */}
                    <button
                        type="button"
                        onClick={() => onSelect("OK")}
                        className="
                            group
                            flex
                            min-h-[140px]
                            flex-col
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            p-5
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-y-1
                            hover:border-green-300
                            hover:bg-green-50
                            hover:shadow-lg
                            active:translate-y-0
                        "
                    >
                        <div
                            className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-full
                                bg-green-100
                                text-2xl
                                font-bold
                                text-green-600
                                transition
                                group-hover:bg-green-600
                                group-hover:text-white
                            "
                        >
                            ✓
                        </div>

                        <span
                            className="
                                mt-4
                                text-xl
                                font-bold
                                tracking-wide
                                text-gray-800
                            "
                        >
                            OK
                        </span>

                        <span className="mt-1 text-xs text-gray-400">
                            問題なし
                        </span>
                    </button>

                    {/* NG */}
                    <button
                        type="button"
                        onClick={() => onSelect("NG")}
                        className="
                            group
                            flex
                            min-h-[140px]
                            flex-col
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            p-5
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-y-1
                            hover:border-red-300
                            hover:bg-red-50
                            hover:shadow-lg
                            active:translate-y-0
                        "
                    >
                        <div
                            className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-full
                                bg-red-100
                                text-2xl
                                font-bold
                                text-red-600
                                transition
                                group-hover:bg-red-600
                                group-hover:text-white
                            "
                        >
                            ×
                        </div>

                        <span
                            className="
                                mt-4
                                text-xl
                                font-bold
                                tracking-wide
                                text-gray-800
                            "
                        >
                            NG
                        </span>

                        <span className="mt-1 text-xs text-gray-400">
                            要確認
                        </span>
                    </button>

                </div>

                {/* キャンセル */}
                <div className="flex justify-center pt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            px-5
                            py-2
                            text-sm
                            font-medium
                            text-gray-500
                            transition
                            hover:bg-gray-100
                            hover:text-gray-700
                        "
                    >
                        キャンセル
                    </button>
                </div>

            </div>
        </CommonModal>
    )
}