"use client"

import { useState } from "react"

import type {
    InspectionType,
    CreateInspectionTypeFrontType,
    UpdateInspectionTypeFrontType,
} from "../../../types/inspectionTypes/inspectionTypeTypes"

import { createInspectionTypeTransaction } from "../../../api/transactions/inspection/inspectionTypes/createInspectionTypeTransaction"
import { updateInspectionTypeTransaction } from "../../../api/transactions/inspection/inspectionTypes/updateInspectionTypeTransaction"

import { executeWithErrorAndLoading } from "../../common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../../common/LoadingOverlay"


type Props = {
    inspectionTypes: InspectionType[]
    setInspectionTypes: React.Dispatch<
        React.SetStateAction<InspectionType[]>
    >
}


export default function EditChecklistTypeModal({
    inspectionTypes,
    setInspectionTypes,
}: Props) {

    const [newName, setNewName] = useState("")
    const [loading, setLoading] = useState(false)


    // =========================
    // 編集
    // =========================

    const handleRename = async (
        inspectionType: InspectionType
    ) => {

        const newName = prompt(
            "新しい点検表種類名を入力",
            inspectionType.name
        )

        if (!newName) {
            return
        }

        const trimmed = newName.trim()

        if (!trimmed) {
            return
        }

        if (trimmed === inspectionType.name) {
            return
        }

        // 同名チェック
        const exists = inspectionTypes.some(
            type =>
                type.id !== inspectionType.id &&
                type.name.trim().toLowerCase() ===
                    trimmed.toLowerCase()
        )

        if (exists) {
            alert("同名の点検表種類がすでに存在します")
            return
        }

        const updateData: UpdateInspectionTypeFrontType = {
            id: inspectionType.id,
            name: trimmed,
            isActive: inspectionType.isActive,
        }

        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {

                await updateInspectionTypeTransaction({
                    inspectionType: updateData,
                    setInspectionTypes,
                })

            },
        })
    }


    // =========================
    // 有効 / 無効
    // =========================

    const handleToggleActive = async (
        inspectionType: InspectionType
    ) => {

        const nextIsActive = !inspectionType.isActive

        const updateData: UpdateInspectionTypeFrontType = {
            id: inspectionType.id,
            name: inspectionType.name,
            isActive: nextIsActive,
        }

        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {

                await updateInspectionTypeTransaction({
                    inspectionType: updateData,
                    setInspectionTypes,
                })

            },
        })
    }


    // =========================
    // 追加
    // =========================

    const handleAdd = async () => {

        const trimmed = newName.trim()

        if (!trimmed) {
            return
        }

        // 同名チェック
        const exists = inspectionTypes.some(
            type =>
                type.name.trim().toLowerCase() ===
                trimmed.toLowerCase()
        )

        if (exists) {
            alert("同名の点検表種類がすでに存在します")
            return
        }

        const inspectionType: CreateInspectionTypeFrontType = {
            name: trimmed,
        }

        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {

                await createInspectionTypeTransaction({
                    inspectionType,
                    setInspectionTypes,
                })

            },
        })

        setNewName("")
    }


return (
    <>
        <div className="space-y-4">

            {/* =========================
                一覧
            ========================= */}

            <div
                className="
                    border
                    border-gray-300
                    rounded
                    p-2
                    max-h-60
                    overflow-y-auto
                "
            >

                {inspectionTypes.length === 0 ? (

                    <div
                        className="
                            py-4
                            text-center
                            text-gray-500
                        "
                    >
                        点検表種類がありません
                    </div>

                ) : (

                    inspectionTypes.map(
                        (inspectionType) => (

                            <div
                                key={inspectionType.id}
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    py-2
                                    px-2
                                    border-b
                                    last:border-b-0
                                    ${
                                        inspectionType.hospitalId === null
                                            ? "bg-gray-100"
                                            : "bg-white"
                                    }
                                `}
                            >

                                {/* 名前 */}

                                <span className="flex-1">
                                    {inspectionType.name}
                                </span>


                                {/* =========================
                                    共通Type
                                ========================= */}

                                {inspectionType.hospitalId === null ? (

                                    <span className="text-gray-500 text-sm">
                                        編集不可
                                    </span>

                                ) : (

                                    <>
                                        {/* 状態 */}

                                        <span
                                            className={
                                                inspectionType.isActive
                                                    ? "text-green-600 text-sm"
                                                    : "text-gray-400 text-sm"
                                            }
                                        >
                                            {inspectionType.isActive
                                                ? "有効"
                                                : "無効"
                                            }
                                        </span>


                                        {/* 編集 */}

                                        <button
                                            onClick={() =>
                                                handleRename(
                                                    inspectionType
                                                )
                                            }
                                            className="
                                                px-2
                                                py-1
                                                bg-gray-200
                                                rounded
                                                hover:bg-gray-300
                                            "
                                        >
                                            編集
                                        </button>


                                        {/* 有効 / 無効 */}

                                        <button
                                            onClick={() =>
                                                handleToggleActive(
                                                    inspectionType
                                                )
                                            }
                                            className="
                                                px-2
                                                py-1
                                                bg-gray-200
                                                rounded
                                                hover:bg-gray-300
                                            "
                                        >
                                            {inspectionType.isActive
                                                ? "無効"
                                                : "有効"
                                            }
                                        </button>
                                    </>

                                )}

                            </div>
                        )
                    )
                )}

            </div>


            {/* =========================
                追加
            ========================= */}

            <div className="flex gap-2">

                <input
                    type="text"
                    value={newName}
                    onChange={(e) =>
                        setNewName(e.target.value)
                    }
                    placeholder="新規点検表種類名"
                    className="
                        border
                        border-gray-400
                        px-2
                        py-1
                        flex-1
                        rounded
                    "
                />

                <button
                    onClick={handleAdd}
                    className="
                        px-3
                        py-1
                        bg-blue-500
                        text-white
                        rounded
                        hover:bg-blue-600
                    "
                >
                    追加
                </button>

            </div>

        </div>

        <LoadingOverlay loading={loading} />
    </>
    )
}
