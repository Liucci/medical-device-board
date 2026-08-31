"use client"

import { useState } from "react"

import type {
    InspectionItemCategoryType,
    CreateInspectionItemCategoryFrontType,
    UpdateInspectionItemCategoryFrontType,
} from "../../../types/inspectionTypes/inspectionItemCategoryTypes"

import { createInspectionItemCategoryTransaction } from "../../../api/transactions/inspection/inspectionItemCategories/createInspectionItemCategories"
import { updateInspectionItemCategoryTransaction } from "../../../api/transactions/inspection/inspectionItemCategories/updateInspectionItemCategories"

import { executeWithErrorAndLoading } from "../../common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../../common/LoadingOverlay"


type Props = {
    inspectionItemCategories: InspectionItemCategoryType[]
    setInspectionItemCategories: React.Dispatch<
        React.SetStateAction<InspectionItemCategoryType[]>
    >
}


export default function EditChecklistItemCategoryModal({
    inspectionItemCategories,
    setInspectionItemCategories,
}: Props) {

    const [newName, setNewName] = useState("")
    const [loading, setLoading] = useState(false)


    // =========================
    // 編集
    // =========================

    const handleRename = async (
        category: InspectionItemCategoryType
    ) => {

        // 基本設定は編集不可
        if (category.hospitalId === null) {
            return
        }

        const newName = prompt(
            "新しい大項目名を入力",
            category.name
        )

        if (!newName) {
            return
        }

        const trimmed = newName.trim()

        if (!trimmed) {
            return
        }

        if (trimmed === category.name) {
            return
        }

        // 同名チェック
        const exists = inspectionItemCategories.some(
            item =>
                item.id !== category.id &&
                item.name.trim().toLowerCase() ===
                    trimmed.toLowerCase()
        )

        if (exists) {
            alert("同名の大項目がすでに存在します")
            return
        }

        const updateData: UpdateInspectionItemCategoryFrontType = {
            id: category.id,
            name: trimmed,
            displayOrder: category.displayOrder,
            isActive: category.isActive,
        }

        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {

                await updateInspectionItemCategoryTransaction({
                    inspectionItemCategory: updateData,
                    setInspectionItemCategories,
                })

            },
        })
    }


    // =========================
    // 有効 / 無効
    // =========================

    const handleToggleActive = async (
        category: InspectionItemCategoryType
    ) => {

        // 基本設定は変更不可
        if (category.hospitalId === null) {
            return
        }

        const nextIsActive = !category.isActive

        const updateData: UpdateInspectionItemCategoryFrontType = {
            id: category.id,
            name: category.name,
            displayOrder: category.displayOrder,
            isActive: nextIsActive,
        }

        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {

                await updateInspectionItemCategoryTransaction({
                    inspectionItemCategory: updateData,
                    setInspectionItemCategories,
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
        const exists = inspectionItemCategories.some(
            category =>
                category.name.trim().toLowerCase() ===
                    trimmed.toLowerCase()
        )

        if (exists) {
            alert("同名の大項目がすでに存在します")
            return
        }

        const inspectionItemCategory: CreateInspectionItemCategoryFrontType = {
            name: trimmed,
        }

        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {

                await createInspectionItemCategoryTransaction({
                    inspectionItemCategory,
                    setInspectionItemCategories,
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

                    {inspectionItemCategories.length === 0 ? (

                        <div
                            className="
                                py-4
                                text-center
                                text-gray-500
                            "
                        >
                            大項目がありません
                        </div>

                    ) : (

                            inspectionItemCategories
                                .slice()
                                .sort((a, b) => {
                                    // 基本設定（hospitalId === null）を上に
                                    if (a.hospitalId === null && b.hospitalId !== null) {
                                        return -1
                                    }

                                    if (a.hospitalId !== null && b.hospitalId === null) {
                                        return 1
                                    }

                                    // 同じグループ内では displayOrder 順
                                    return a.displayOrder - b.displayOrder
                                })
                                .map(category => (

                                <div
                                    key={category.id}
                                    className={`
                                        flex
                                        items-center
                                        gap-2
                                        py-2
                                        px-2
                                        border-b
                                        last:border-b-0
                                        ${
                                            category.hospitalId === null
                                                ? "bg-gray-100"
                                                : "bg-white"
                                        }
                                    `}
                                >

                                    {/* 名前 */}

                                    <span className="flex-1">
                                        {category.name}
                                    </span>


                                    {/* =========================
                                        共通設定
                                    ========================= */}

                                    {category.hospitalId === null ? (

                                        <span className="text-gray-500 text-sm">
                                            編集不可
                                        </span>

                                    ) : (

                                        <>
                                            {/* 状態 */}

                                            <span
                                                className={
                                                    category.isActive
                                                        ? "text-green-600 text-sm"
                                                        : "text-gray-400 text-sm"
                                                }
                                            >
                                                {category.isActive
                                                    ? "有効"
                                                    : "無効"
                                                }
                                            </span>


                                            {/* 編集 */}

                                            <button
                                                onClick={() =>
                                                    handleRename(
                                                        category
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
                                                        category
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
                                                {category.isActive
                                                    ? "無効"
                                                    : "有効"
                                                }
                                            </button>
                                        </>

                                    )}

                                </div>
                            ))
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
                        placeholder="新規大項目名"
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