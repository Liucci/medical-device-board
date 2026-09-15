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
            <div className="w-full rounded-2xl bg-gray-200 p-5">

                <div className="flex h-[600px] min-h-0 w-full flex-col rounded-xl bg-white p-6 shadow-sm">

                    {/* ================================================= */}
                    {/* タイトル */}
                    {/* ================================================= */}
                    <div className="mb-6 shrink-0">

                        <h3 className="text-lg font-semibold text-gray-800">
                            点検項目の大項目
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            大項目の追加、名前の変更、有効・無効の切り替えを行います
                        </p>

                    </div>


                    {/* ================================================= */}
                    {/* 一覧ヘッダー */}
                    {/* ================================================= */}
                    <div className="mb-3 flex shrink-0 items-center justify-between">

                        <div>

                            <div className="text-sm font-semibold text-gray-800">
                                登録されている大項目
                            </div>

                            <div className="mt-1 text-xs text-gray-500">
                                {inspectionItemCategories.length} 件
                            </div>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* 一覧 */}
                    {/* ================================================= */}
                    <div className="min-h-0 flex-1 overflow-y-auto">

                        {inspectionItemCategories.length === 0 ? (

                            <div className="py-12 text-center text-sm text-gray-400">
                                登録されている大項目はありません
                            </div>

                        ) : (

                            <div>

                                {inspectionItemCategories
                                    .slice()
                                    .sort((a, b) => {

                                        // 基本設定を上に
                                        if (
                                            a.hospitalId === null &&
                                            b.hospitalId !== null
                                        ) {
                                            return -1
                                        }

                                        if (
                                            a.hospitalId !== null &&
                                            b.hospitalId === null
                                        ) {
                                            return 1
                                        }

                                        // 同じグループ内では displayOrder 順
                                        return a.displayOrder - b.displayOrder
                                    })
                                    .map((category) => {

                                        const isCommon =
                                            category.hospitalId === null

                                        return (
                                            <div
                                                key={category.id}
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    border-b
                                                    border-gray-100
                                                    py-3
                                                    last:border-b-0
                                                    hover:bg-gray-50
                                                "
                                            >

                                                {/* ================================================= */}
                                                {/* 大項目名 */}
                                                {/* ================================================= */}
                                                <div className="min-w-0 flex-1">

                                                    <div className="truncate text-sm text-gray-800">
                                                        {category.name}
                                                    </div>

                                                    <div className="mt-1">

                                                        {isCommon ? (

                                                            <span className="text-xs text-gray-400">
                                                                共通・編集不可
                                                            </span>

                                                        ) : category.isActive ? (

                                                            <span className="text-xs text-blue-500">
                                                                有効
                                                            </span>

                                                        ) : (

                                                            <span className="text-xs text-gray-400">
                                                                無効
                                                            </span>

                                                        )}

                                                    </div>

                                                </div>


                                                {/* ================================================= */}
                                                {/* 操作 */}
                                                {/* ================================================= */}
                                                {!isCommon && (
                                                    <div className="flex shrink-0 items-center gap-2">

                                                        {/* 編集 */}
                                                        <button
                                                            onClick={() =>
                                                                handleRename(category)
                                                            }
                                                            className="
                                                                rounded-lg
                                                                bg-gray-100
                                                                px-3
                                                                py-1.5
                                                                text-sm
                                                                font-medium
                                                                text-gray-600
                                                                transition
                                                                hover:bg-gray-200
                                                                hover:text-gray-800
                                                            "
                                                        >
                                                            ✏
                                                        </button>


                                                        {/* 有効 / 無効 */}
                                                        <button
                                                            onClick={() =>
                                                                handleToggleActive(category)
                                                            }
                                                            className={`
                                                                rounded-lg
                                                                px-3
                                                                py-1.5
                                                                text-sm
                                                                font-medium
                                                                transition
                                                                ${
                                                                    category.isActive
                                                                        ? `
                                                                            bg-gray-100
                                                                            text-gray-600
                                                                            hover:bg-gray-200
                                                                            hover:text-gray-800
                                                                          `
                                                                        : `
                                                                            bg-blue-50
                                                                            text-blue-600
                                                                            hover:bg-blue-100
                                                                          `
                                                                }
                                                            `}
                                                        >
                                                            {category.isActive
                                                                ? "無効"
                                                                : "有効"}
                                                        </button>

                                                    </div>
                                                )}

                                            </div>
                                        )
                                    })}

                            </div>

                        )}

                    </div>


                    {/* ================================================= */}
                    {/* 大項目追加 */}
                    {/* ================================================= */}
                    <div className="mt-8 shrink-0">

                        <div className="mb-4">

                            <h4 className="text-sm font-semibold text-gray-800">
                                新しい大項目を追加
                            </h4>

                            <p className="mt-1 text-xs text-gray-500">
                                新しい大項目名を入力してください
                            </p>

                        </div>


                        <div className="flex gap-3">

                            <input
                                type="text"
                                value={newName}
                                onChange={(e) =>
                                    setNewName(e.target.value)
                                }
                                placeholder="例：外観・動作確認"
                                className="
                                    min-w-0
                                    flex-1
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-gray-700
                                    outline-none
                                    transition
                                    placeholder:text-gray-400
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />


                            <button
                                onClick={handleAdd}
                                className="
                                    shrink-0
                                    rounded-lg
                                    bg-blue-500
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-blue-600
                                "
                            >
                                追加
                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* Loading */}
            {/* ================================================= */}
            <LoadingOverlay loading={loading} />
        </>
    )
}