"use client"

import { useEffect, useState } from "react"

import type {
    InspectionItemType,
} from "../../types/inspectionTypes/inspectionItemTypeTypes"

import type {
    InspectionChecklistItemOption,
} from "../../types/inspectionTypes/inspectionChecklistItemOptionTypes"

import type {
    InspectionItemCategoryType,
} from "../../types/inspectionTypes/inspectionItemCategoryTypes"

//checklist idはtype内に不要
type InspectionChecklistItem = {
    id: number
    name: string
    categoryId: number | null
    itemTypeId: number
    displayOrder: number
    required: boolean
    defaultValue: string | null
    options: InspectionChecklistItemOption[]
    unit: string | null
}


type Props = {
    open: boolean
    item: InspectionChecklistItem | null
    inspectionItemTypes: InspectionItemType[]
    inspectionItemCategories: InspectionItemCategoryType[]
    onClose: () => void
    onSave: (
        itemId: number,
        name: string,
        categoryId: number,
        itemTypeId: number,
        options: InspectionChecklistItemOption[]
    ) => void
}


export default function EditInspectionChecklistItemModal({
    open,
    item,
    inspectionItemTypes,
    inspectionItemCategories,
    onClose,
    onSave,
}: Props)
{
    const [name, setName] = useState("")
    const [categoryId, setCategoryId] = useState<number | null>(null)
    const [itemTypeId, setItemTypeId] = useState<number | null>(null)
    const [options, setOptions] =useState<InspectionChecklistItemOption[]>([])


    // =========================================
    // 初期化
    // =========================================

    useEffect(() =>
    {
        if (open && item)
        {
            setName(item.name)
            setCategoryId(item.categoryId)
            setItemTypeId(item.itemTypeId)

            setOptions(
                item.options
                    ? item.options.map((option, index) => ({
                        value: option.value,
                        displayOrder: index + 1,
                    }))
                    : []
            )
        }

        if (!open)
        {
            setName("")
            setCategoryId(null)
            setItemTypeId(null)
            setOptions([])
        }

    }, [open, item])


    // =========================================
    // 選択中の入力方式
    // =========================================

    const selectedItemType =inspectionItemTypes.find(
            (itemType) =>
                itemType.id === itemTypeId
        )
    const isCustomOption =selectedItemType?.isCustomOption === true
    if (!open)
    {
        return null
    }


    // =========================================
    // 入力方式変更
    // =========================================

    const handleItemTypeChange = (
        value: string
    ) =>
    {
        const nextItemTypeId =
            value === ""
                ? null
                : Number(value)

        setItemTypeId(nextItemTypeId)

        const nextItemType =
            inspectionItemTypes.find(
                (itemType) =>
                    itemType.id === nextItemTypeId
            )

        if (nextItemType?.isCustomOption === true)
        {
            if (options.length === 0)
            {
                setOptions([
                    {
                        value: "",
                        displayOrder: 1,
                    },
                ])
            }
        }
        else
        {
            setOptions([])
        }
    }


    // =========================================
    // 選択肢変更
    // =========================================

    const handleOptionChange = (
        index: number,
        value: string
    ) =>
    {
        setOptions((currentOptions) =>
            currentOptions.map(
                (option, optionIndex) =>
                    optionIndex === index
                        ? {
                            ...option,
                            value,
                        }
                        : option
            )
        )
    }


    // =========================================
    // 選択肢追加
    // =========================================

    const handleAddOption = () =>
    {
        setOptions((currentOptions) => [
            ...currentOptions,
            {
                value: "",
                displayOrder:
                    currentOptions.length + 1,
            },
        ])
    }


    // =========================================
    // 選択肢削除
    // =========================================

    const handleDeleteOption = (
        index: number
    ) =>
    {
        setOptions((currentOptions) =>
            currentOptions
                .filter(
                    (_, optionIndex) =>
                        optionIndex !== index
                )
                .map(
                    (option, optionIndex) => ({
                        ...option,
                        displayOrder:
                            optionIndex + 1,
                    })
                )
        )
    }


    // =========================================
    // 保存
    // =========================================

    const handleSave = () =>
    {
        if (!item){return}
        if (!name.trim()){
            alert("項目名を入力してください")
            return}
        if (categoryId === null){
            alert("カテゴリを選択してください")
            return}
        if (itemTypeId === null){
            alert("入力方式を選択してください")
            return}


        let normalizedOptions:InspectionChecklistItemOption[] = []


        if (isCustomOption)
        {
            normalizedOptions =
                options
                    .map((option) => ({
                        value: option.value.trim(),
                        displayOrder:
                            option.displayOrder,
                    }))
                    .filter(
                        (option) =>
                            option.value !== ""
                    )
                    .map(
                        (option, index) => ({
                            ...option,
                            displayOrder:
                                index + 1,
                        })
                    )

            if (normalizedOptions.length === 0)
            {alert("選択肢を1つ以上入力してください")
            return}
        }
        if (
            isCustomOption &&
            new Set(normalizedOptions.map((option) => 
                option.value)).size !==normalizedOptions.length)
            {alert("同じ選択肢は登録できません")
            return}

        onSave(
            item.id,
            name.trim(),
            categoryId,
            itemTypeId,
            normalizedOptions
        )
    }


    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                p-4
            "
            onMouseDown={(event) =>
            {
                if (
                    event.target ===
                    event.currentTarget
                )
                {
                    onClose()
                }
            }}
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-xl
                    bg-white
                    shadow-xl
                "
            >

                {/* Header */}

                <div
                    className="
                        px-6
                        py-4
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-gray-800
                        "
                    >
                        点検項目を編集
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-gray-500
                        "
                    >
                        点検項目の内容・大項目・入力方式を編集してください
                    </p>

                </div>


                {/* Body */}

                <div
                    className="
                        space-y-5
                        px-6
                        py-6
                    "
                >

                    {/* 項目名 */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            項目名
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="例：電源が正常に入ること"
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-500
                                px-4
                                py-2.5
                                text-sm
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>


                    {/* 大項目 */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            大項目
                        </label>

                        <select
                            value={categoryId ?? ""}
                            onChange={(event) =>
                            {
                                setCategoryId(
                                    event.target.value === ""
                                        ? null
                                        : Number(event.target.value)
                                )
                            }}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-500
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        >

                            <option value="">
                                選択してください
                            </option>

                            {inspectionItemCategories.map(
                                (category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                )
                            )}

                        </select>

                    </div>


                    {/* 入力方式 */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            入力方式
                        </label>

                        <select
                            value={itemTypeId ?? ""}
                            onChange={(event) =>
                                handleItemTypeChange(
                                    event.target.value
                                )
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-500
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        >

                            <option value="">
                                選択してください
                            </option>

                            {inspectionItemTypes.map(
                                (itemType) => (
                                    <option
                                        key={itemType.id}
                                        value={itemType.id}
                                    >
                                        {itemType.name}
                                    </option>
                                )
                            )}

                        </select>

                    </div>


                    {/* 任意選択肢 */}

                    {isCustomOption && (
                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                "
                            >
                                選択肢
                            </label>

                            <div
                                className="
                                    space-y-2
                                "
                            >

                                {options.map(
                                    (option, index) => (
                                        <div
                                            key={index}
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <input
                                                type="text"
                                                value={
                                                    option.value
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleOptionChange(
                                                        index,
                                                        event.target.value
                                                    )
                                                }
                                                placeholder={`選択肢 ${index + 1}`}
                                                className="
                                                    flex-1
                                                    rounded-lg
                                                    border
                                                    border-gray-500
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    outline-none
                                                    focus:border-blue-500
                                                    focus:ring-2
                                                    focus:ring-blue-100
                                                "
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteOption(
                                                        index
                                                    )
                                                }
                                                disabled={
                                                    options.length <= 1
                                                }
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-gray-400
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    text-gray-600
                                                    hover:bg-gray-50
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-30
                                                "
                                            >
                                                削除
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>


                            <button
                                type="button"
                                onClick={handleAddOption}
                                className="
                                    mt-3
                                    rounded-lg
                                    border
                                    border-blue-500
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-blue-600
                                    hover:bg-blue-50
                                "
                            >
                                ＋ 選択肢を追加
                            </button>

                        </div>
                    )}

                </div>


                {/* Footer */}

                <div
                    className="
                        flex
                        justify-end
                        gap-3
                        px-6
                        py-4
                    "
                >

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            border
                            border-gray-500
                            bg-white
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-gray-700
                            hover:bg-gray-50
                        "
                    >
                        キャンセル
                    </button>


                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={
                            !name.trim() ||
                            categoryId === null ||
                            itemTypeId === null ||
                            (
                                isCustomOption &&
                                options.filter(
                                    (option) =>
                                        option.value.trim() !== ""
                                ).length === 0
                            )
                        }
                        className="
                            rounded-lg
                            bg-blue-600
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        保存
                    </button>

                </div>

            </div>

        </div>
    )
}