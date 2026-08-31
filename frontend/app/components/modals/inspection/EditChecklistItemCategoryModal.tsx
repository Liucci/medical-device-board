"use client"

import { useState } from "react"


type InspectionItemCategory = {
    id: number
    name: string
    displayOrder: number
    isActive: boolean
}


type Props = {
    inspectionItemCategories: InspectionItemCategory[]
    setInspectionItemCategories: React.Dispatch<React.SetStateAction<InspectionItemCategory[]>>
}


export default function EditChecklistItemCategoryModal({
    inspectionItemCategories,
    setInspectionItemCategories,
}: Props) {

    const [newName, setNewName] = useState("")


    // =========================
    // 編集
    // =========================

    const handleRename = (
        category: InspectionItemCategory
    ) => {

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

        setInspectionItemCategories(prev =>
            prev.map(item =>
                item.id === category.id
                    ? {
                        ...item,
                        name: trimmed,
                    }
                    : item
            )
        )
    }


    // =========================
    // 有効 / 無効
    // =========================

    const handleToggleActive = (
        category: InspectionItemCategory
    ) => {

        setInspectionItemCategories(prev =>
            prev.map(item =>
                item.id === category.id
                    ? {
                        ...item,
                        isActive: !item.isActive,
                    }
                    : item
            )
        )
    }


    // =========================
    // 表示順変更
    // =========================

    const handleMove = (
        category: InspectionItemCategory,
        direction: "up" | "down"
    ) => {

        const currentIndex =
            inspectionItemCategories.findIndex(
                item => item.id === category.id
            )

        if (currentIndex === -1) {
            return
        }

        const targetIndex =
            direction === "up"
                ? currentIndex - 1
                : currentIndex + 1

        if (
            targetIndex < 0 ||
            targetIndex >= inspectionItemCategories.length
        ) {
            return
        }

        setInspectionItemCategories(prev => {

            const newCategories = [...prev]

            const temp = newCategories[currentIndex]

            newCategories[currentIndex] =
                newCategories[targetIndex]

            newCategories[targetIndex] = temp

            return newCategories.map(
                (item, index) => ({
                    ...item,
                    displayOrder: index + 1,
                })
            )
        })
    }


    // =========================
    // 追加
    // =========================

    const handleAdd = () => {

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

        const newCategory: InspectionItemCategory = {
            id: Date.now(),
            name: trimmed,
            displayOrder:
                inspectionItemCategories.length + 1,
            isActive: true,
        }

        setInspectionItemCategories(prev => [
            ...prev,
            newCategory,
        ])

        setNewName("")
    }


    return (
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
                        .sort(
                            (a, b) =>
                                a.displayOrder -
                                b.displayOrder
                        )
                        .map(category => (

                            <div
                                key={category.id}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    py-2
                                    px-2
                                    border-b
                                    last:border-b-0
                                "
                            >

                                {/* 名前 */}

                                <span className="flex-1">
                                    {category.name}
                                </span>


                                {/* =========================
                                    表示順
                                ========================= */}

                                <div className="flex gap-1">

                                    <button
                                        onClick={() =>
                                            handleMove(
                                                category,
                                                "up"
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
                                        ↑
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleMove(
                                                category,
                                                "down"
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
                                        ↓
                                    </button>

                                </div>


                                {/* =========================
                                    状態
                                ========================= */}

                                <span
                                    className={
                                        category.isActive
                                            ? "text-green-600 text-sm"
                                            : "text-gray-400 text-sm"
                                    }
                                >
                                    {category.isActive
                                        ? "有効"
                                        : "無効"}
                                </span>


                                {/* =========================
                                    編集
                                ========================= */}

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


                                {/* =========================
                                    有効 / 無効
                                ========================= */}

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
                                        : "有効"}
                                </button>

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
    )
}