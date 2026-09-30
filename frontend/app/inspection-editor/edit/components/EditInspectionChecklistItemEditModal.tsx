"use client"

import { useEffect, useState } from "react"
import type { InspectionItemType } from "../../../types/inspectionTypes/inspectionItemTypeTypes"
import type { InspectionChecklistItem } from "../../../types/inspectionTypes/inspectionChecklistItemTypes"
import type { InspectionChecklistItemOption } from "../../../types/inspectionTypes/inspectionChecklistItemOptionTypes"
import type { InspectionItemCategoryType } from "../../../types/inspectionTypes/inspectionItemCategoryTypes"

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
        required: boolean,
        options: InspectionChecklistItemOption[],
        unit: string | null
    ) => void
}

export default function EditInspectionChecklistItemEditModal({
    open,
    item,
    inspectionItemTypes,
    inspectionItemCategories,
    onClose,
    onSave,
}: Props)
{
    const [name, setName] = useState("")
    const [unit, setUnit] = useState("")
    const [categoryId, setCategoryId] = useState<number | null>(null)
    const [itemTypeId, setItemTypeId] = useState<number | null>(null)
    const [required, setRequired] = useState(true)
    const [options, setOptions] =
        useState<InspectionChecklistItemOption[]>([])


    useEffect(() =>
    {
        if (open && item)
        {
            setName(item.itemName)
            setUnit(item.unit ?? "")
            setCategoryId(item.categoryId)
            setItemTypeId(item.itemTypeId)
            setRequired(item.required)

            setOptions(
                Array.isArray(item.options)
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
            setUnit("")
            setCategoryId(null)
            setItemTypeId(null)
            setRequired(true)
            setOptions([])
        }

    }, [open, item])


    const selectedItemType =
        inspectionItemTypes.find(
            (itemType) => itemType.id === itemTypeId
        )


    const isCustomOption =
        selectedItemType?.isCustomOption === true


    const isNumberInput =
        selectedItemType?.name === "数値入力"


    if (!open)
    {
        return null
    }


    // ==============================
    // 入力方式変更
    // ==============================

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


        if (nextItemType?.name !== "数値入力")
        {
            setUnit("")
        }
    }


    // ==============================
    // 選択肢変更
    // ==============================

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


    // ==============================
    // 選択肢追加
    // ==============================

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


    // ==============================
    // 選択肢削除
    // ==============================

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


    // ==============================
    // 保存
    // ==============================

    const handleSave = () =>
    {
        if (!item)
        {
            return
        }


        if (!name.trim())
        {
            alert("項目名を入力してください")
            return
        }


        if (categoryId === null)
        {
            alert("カテゴリを選択してください")
            return
        }


        if (itemTypeId === null)
        {
            alert("入力方式を選択してください")
            return
        }


        let normalizedOptions:
            InspectionChecklistItemOption[] = []


        if (isCustomOption)
        {
            normalizedOptions = options
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
            {
                alert(
                    "選択肢を1つ以上入力してください"
                )
                return
            }
        }


        if (
            isCustomOption &&
            new Set(
                normalizedOptions.map(
                    (option) => option.value
                )
            ).size !== normalizedOptions.length
        )
        {
            alert("同じ選択肢は登録できません")
            return
        }


        onSave(
            item.id,
            name.trim(),
            categoryId,
            itemTypeId,
            required,
            normalizedOptions,
            isNumberInput
                ? unit.trim() || null
                : null
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
                bg-slate-950/65
                p-0
                backdrop-blur-sm
                sm:p-4
            "
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose()
                }
            }}
        >

            <div className="
                flex
                h-full
                w-full
                flex-col
                overflow-hidden
                bg-slate-50
                sm:h-auto
                sm:max-h-[94vh]
                sm:max-w-xl
                sm:rounded-2xl
                sm:border
                sm:border-slate-300
                sm:shadow-2xl
            ">

                {/* Header */}
                <div className="
                    flex
                    items-start
                    justify-between
                    bg-slate-900
                    px-4
                    py-3
                    text-white
                    sm:px-5
                ">

                    <div>

                        <h2 className="text-sm font-bold sm:text-base">
                            点検項目を編集
                        </h2>

                        <p className="mt-1 text-[11px] text-slate-300">
                            点検項目の内容・大項目・入力方式を設定してください
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-300
                            transition-colors
                            hover:bg-white/10
                            hover:text-white
                        "
                        title="閉じる"
                        aria-label="閉じる"
                    >
                        ×
                    </button>

                </div>


                {/* Body */}
                <div className="
                    min-h-0
                    flex-1
                    space-y-4
                    overflow-y-auto
                    px-4
                    py-4
                    sm:px-5
                    sm:py-5
                ">

                    {/* 項目名 */}
                    <div>

                        <label className="mb-2 block text-xs font-medium text-slate-500">
                            項目名
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="例：電源が正常に入ること"
                            className="
                                w-full
                                rounded-lg
                                border border-slate-200
                                px-4 py-2.5
                                text-sm
                                outline-none
                                focus:border-teal-600
                                focus:ring-2
                                focus:ring-teal-100
                            "
                        />

                    </div>


                    {/* 入力任意 */}
                    <div className="flex items-center">

                        <label className="flex cursor-pointer items-center gap-2">

                            <input
                                type="checkbox"
                                checked={!required}
                                onChange={(event) =>
                                    setRequired(
                                        !event.target.checked
                                    )
                                }
                                className="
                                    h-4
                                    w-4
                                    rounded
                                    border-slate-300
                                    text-teal-700
                                    focus:ring-teal-600
                                "
                            />

                            <span className="text-xs font-medium text-slate-500">
                                入力任意
                            </span>

                        </label>

                    </div>


                    {/* 大項目 */}
                    <div>

                        <label className="mb-2 block text-xs font-medium text-slate-500">
                            大項目
                        </label>

                        <select
                            value={categoryId ?? ""}
                            onChange={(event) => {
                                setCategoryId(
                                    event.target.value === ""
                                        ? null
                                        : Number(event.target.value)
                                )
                            }}
                            className="
                                w-full
                                rounded-lg
                                border border-slate-200
                                bg-white
                                px-4 py-2.5
                                text-sm
                                outline-none
                                focus:border-teal-600
                                focus:ring-2
                                focus:ring-teal-100
                            "
                        >

                            <option value="">
                                選択してください
                            </option>

                            {inspectionItemCategories
                                .filter((category) => category.isActive)
                                .map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}

                        </select>

                    </div>


                    {/* 入力方式 */}
                    <div>

                        <label className="mb-2 block text-xs font-medium text-slate-500">
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
                                border border-slate-200
                                bg-white
                                px-4 py-2.5
                                text-sm
                                outline-none
                                focus:border-teal-600
                                focus:ring-2
                                focus:ring-teal-100
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


                    {/* 任意の選択肢 */}
                    {isCustomOption && (
                        <div>

                            <label className="mb-2 block text-xs font-medium text-slate-500">
                                選択肢
                            </label>

                            <div className="space-y-2">

                                {options.map(
                                    (option, index) => (

                                        <div
                                            key={index}
                                            className="flex items-center gap-2"
                                        >

                                            <input
                                                type="text"
                                                value={option.value}
                                                onChange={(event) =>
                                                    handleOptionChange(
                                                        index,
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="選択肢を入力"
                                                className="
                                                    min-w-0
                                                    flex-1
                                                    rounded-lg
                                                    border border-slate-200
                                                    px-4 py-2.5
                                                    text-sm
                                                    outline-none
                                                    focus:border-teal-600
                                                    focus:ring-2
                                                    focus:ring-teal-100
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
                                                    flex
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    border
                                                    border-slate-200
                                                    text-slate-500
                                                    hover:border-rose-300
                                                    hover:bg-rose-50
                                                    hover:text-rose-700
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-30
                                                "
                                                title="削除"
                                                aria-label="選択肢を削除"
                                            >
                                                ×
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
                                    text-sm
                                    font-medium
                                    text-teal-700
                                    hover:text-teal-800
                                "
                            >
                                ＋ 選択肢を追加
                            </button>

                        </div>
                    )}


                    {/* 単位 */}
                    {isNumberInput && (
                        <div>

                            <label className="mb-2 block text-xs font-medium text-slate-500">
                                単位
                            </label>

                            <input
                                type="text"
                                value={unit}
                                onChange={(event) =>
                                    setUnit(
                                        event.target.value
                                    )
                                }
                                placeholder="例：mmHg、回、個"
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-200
                                    bg-white
                                    px-4 py-2.5
                                    text-sm
                                    outline-none
                                    focus:border-teal-600
                                    focus:ring-2
                                    focus:ring-teal-100
                                "
                            />

                        </div>
                    )}

                </div>


                {/* Footer */}
                <div className="
                    flex
                    justify-end
                    gap-3
                    border-t
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    sm:px-5
                ">

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            h-9
                            w-24
                            rounded-lg
                            border border-slate-200
                            bg-white
                            text-sm
                            font-medium
                            text-slate-700
                            hover:bg-slate-50
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
                                options.every(
                                    (option) =>
                                        !option.value.trim()
                                )
                            )
                        }
                        className="
                            h-9
                            w-24
                            rounded-lg
                            bg-teal-700
                            text-sm
                            font-bold
                            text-white
                            hover:bg-teal-800
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