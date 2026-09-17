"use client"

import { useEffect, useState } from "react"

import {
DndContext,
closestCenter,
type DragEndEvent,
} from "@dnd-kit/core"

import {
SortableContext,
verticalListSortingStrategy,
arrayMove,
} from "@dnd-kit/sortable"

import {
Plus,
Save,
X,
} from "lucide-react"

import type {
InspectionItemCategoryType,
InspectionItemCategoryEditType,
} from "../../../types/inspectionTypes/inspectionItemCategoryTypes"

import { toSaveInspectionItemCategoriesRequest,normalizeInspectionItemCategory } from "../../../mapper/inspectionMapper/inspectionItemCategoryMapper"

import { saveInspectionItemCategories } from "../../../api/transactions/inspection/inspectionItemCategories/saveInspectionItemCategories"

import { executeWithErrorAndLoading } from "../../common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../../common/LoadingOverlay"

import SortableInspectionItemCategory from "./SortableInspectionItemCategory"

type Props = {
inspectionItemCategories: InspectionItemCategoryType[]
setInspectionItemCategories: React.Dispatch<React.SetStateAction<InspectionItemCategoryType[]>>
onclose: () => void
}

export default function EditChecklistItemCategoryModal({
inspectionItemCategories,
setInspectionItemCategories,
onclose
}: Props) {

// =========================================================
// 編集用local state
// =========================================================

const [editCategories, setEditCategories] = useState<
    InspectionItemCategoryEditType[]
>([])

const [newName, setNewName] = useState("")
const [loading, setLoading] = useState(false)


// =========================================================
// Modal表示時に編集用stateを作成
// =========================================================

useEffect(() => {

    setEditCategories(
        inspectionItemCategories
            .slice()
            .sort(
                (a, b) =>
                    a.displayOrder - b.displayOrder
            )
            .map((category) => ({
                id: category.id,
                name: category.name,
                displayOrder: category.displayOrder,
                isActive: category.isActive,
            }))
    )

}, [inspectionItemCategories])


// =========================================================
// Sortable ID
// =========================================================

const getSortableId = (
    category: InspectionItemCategoryEditType,
    index: number
) => {
    return category.id !== null
        ? `category-${category.id}`
        : `new-category-${index}`
}


const sortableIds = editCategories.map(
    (category, index) =>
        getSortableId(category, index)
)


// =========================================================
// 並び替え
// =========================================================

const handleDragEnd = (event: DragEndEvent) => {

    const {
        active,
        over,
    } = event

    if (!over || active.id === over.id) {
        return
    }


    setEditCategories((current) => {

        const oldIndex = current.findIndex(
            (category, index) =>
                getSortableId(category, index) === active.id
        )

        const newIndex = current.findIndex(
            (category, index) =>
                getSortableId(category, index) === over.id
        )


        if (
            oldIndex === -1 ||
            newIndex === -1
        ) {
            return current
        }


        const moved = arrayMove(
            current,
            oldIndex,
            newIndex
        )


        return moved.map(
            (category, index) => ({
                ...category,
                displayOrder: index,
            })
        )
    })
}


// =========================================================
// 名前編集
// =========================================================

const handleEdit = (
    category: InspectionItemCategoryEditType
) => {

    const newName = window.prompt(
        "新しい大項目名を入力",
        category.name
    )


    if (newName === null) {
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
    const exists = editCategories.some(
        (item) =>
            item.id !== category.id &&
            item.name.trim().toLowerCase() ===
                trimmed.toLowerCase()
    )


    if (exists) {
        window.alert(
            "同名の大項目がすでに存在します"
        )
        return
    }


    setEditCategories((current) =>
        current.map((item) =>
            item.id === category.id
                ? {
                    ...item,
                    name: trimmed,
                }
                : item
        )
    )
}


// =========================================================
// 有効 / 無効
// =========================================================

const handleToggleActive = (
    category: InspectionItemCategoryEditType
) => {

    setEditCategories((current) =>
        current.map((item) =>
            item.id === category.id
                ? {
                    ...item,
                    isActive: !item.isActive,
                }
                : item
        )
    )
}


// =========================================================
// 大項目追加
// =========================================================

const handleAdd = () => {

    const trimmed = newName.trim()


    if (!trimmed) {
        return
    }


    // 同名チェック
    const exists = editCategories.some(
        (category) =>
            category.name.trim().toLowerCase() ===
                trimmed.toLowerCase()
    )


    if (exists) {
        window.alert(
            "同名の大項目がすでに存在します"
        )
        return
    }


    const nextDisplayOrder =
        editCategories.length


    const newCategory: InspectionItemCategoryEditType = {
        id: null,
        name: trimmed,
        displayOrder: nextDisplayOrder,
        isActive: true,
    }


    setEditCategories((current) => [
        ...current,
        newCategory,
    ])


    setNewName("")
}


// =========================================================
// 保存
// =========================================================

const handleSave = async () => {

    // 保存前にdisplayOrderを現在の並び順から再構成
    const categoriesToSave =editCategories.map(
            (category, index) => ({
                ...category,
                displayOrder: index,
            })
        )


    const request =
        toSaveInspectionItemCategoriesRequest({
            categories: categoriesToSave,
        })
    console.log("request:",request)    

    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {

            const savedCategories =await saveInspectionItemCategories(request)
            setInspectionItemCategories(
                savedCategories.map(normalizeInspectionItemCategory)            )
        },
    })
}


// =========================================================
// Render
// =========================================================

return (
    <>
        <div className="w-full rounded-2xl bg-gray-200 p-5">

            <div className="
                flex
                h-[600px]
                min-h-0
                w-full
                flex-col
                rounded-xl
                bg-white
                p-6
                shadow-sm
            ">

                {/* ================================================= */}
                {/* Header */}
                {/* ================================================= */}

                <div className="mb-6 shrink-0">

                    <div className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    ">

                        <div>

                            <h3 className="
                                text-lg
                                font-semibold
                                text-gray-800
                            ">
                                点検項目の大項目
                            </h3>

                            <p className="
                                mt-1
                                text-sm
                                text-gray-500
                            ">
                                大項目の追加、名前の変更、有効・無効の切り替え、
                                並び順の変更を行います
                            </p>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* List Header */}
                {/* ================================================= */}

                <div className="
                    mb-3
                    flex
                    shrink-0
                    items-center
                    justify-between
                ">

                    <div>

                        <div className="
                            text-sm
                            font-semibold
                            text-gray-800
                        ">
                            登録されている大項目
                        </div>

                        <div className="
                            mt-1
                            text-xs
                            text-gray-500
                        ">
                            {editCategories.length} 件
                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* Category List */}
                {/* ================================================= */}

                <div className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                ">

                    {editCategories.length === 0 ? (

                        <div className="
                            py-12
                            text-center
                            text-sm
                            text-gray-400
                        ">
                            登録されている大項目はありません
                        </div>

                    ) : (

                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >

                            <SortableContext
                                items={sortableIds}
                                strategy={
                                    verticalListSortingStrategy
                                }
                            >

                                <div className="space-y-2">

                                    {editCategories.map(
                                        (category, index) => (

                                            <SortableInspectionItemCategory
                                                key={
                                                    getSortableId(
                                                        category,
                                                        index
                                                    )
                                                }
                                                category={category}
                                                index={index}
                                                onEdit={handleEdit}
                                                onToggleActive={
                                                    handleToggleActive
                                                }
                                            />

                                        )
                                    )}

                                </div>

                            </SortableContext>

                        </DndContext>

                    )}

                </div>


                {/* ================================================= */}
                {/* Add Category */}
                {/* ================================================= */}

                <div className="
                    mt-6
                    shrink-0
                    border-t
                    border-gray-100
                    pt-5
                ">

                    <div className="mb-3">

                        <h4 className="
                            text-sm
                            font-semibold
                            text-gray-800
                        ">
                            新しい大項目を追加
                        </h4>

                        <p className="
                            mt-1
                            text-xs
                            text-gray-500
                        ">
                            追加した項目は保存するまでデータベースには登録されません
                        </p>

                    </div>


                    <div className="flex gap-3">

                        <input
                            type="text"
                            value={newName}
                            onChange={(e) =>
                                setNewName(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAdd()
                                }
                            }}
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
                            type="button"
                            onClick={handleAdd}
                            className="
                                flex
                                shrink-0
                                items-center
                                gap-1.5
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
                            <Plus size={16} />
                            追加
                        </button>

                    </div>

                </div>


                {/* ================================================= */}
                {/* Footer */}
                {/* ================================================= */}

                <div className="
                    mt-5
                    flex
                    shrink-0
                    justify-end
                    gap-3
                    border-t
                    border-gray-100
                    pt-5
                ">

                    <button
                        type="button"
                        onClick={onclose}
                        className="
                            flex
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-gray-100
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-gray-600
                            transition
                            hover:bg-gray-200
                            hover:text-gray-800
                        "
                    >
                        <X size={16} />
                        キャンセル
                    </button>


                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading}
                        className="
                            flex
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-blue-500
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-blue-600
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <Save size={16} />
                        保存
                    </button>

                </div>

            </div>

        </div>


        <LoadingOverlay loading={loading} />
    </>
)


}
