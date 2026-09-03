"use client"

import { useEffect, useState } from "react"

import type {
    InspectionItemType,
} from "../../../types/inspectionTypes/inspectionItemTypeTypes"
import type {InspectionChecklistItemOption} from "../../../types/inspectionTypes/inspectionChecklistItemOptionTypes"


type Props = {
    open: boolean
    inspectionItemTypes: InspectionItemType[]
    onClose: () => void
    onAdd: (
        name: string,
        itemTypeId: number,
        options: InspectionChecklistItemOption[]
    ) => void
}


export default function AddInspectionChecklistItemEditModal({
    open,
    inspectionItemTypes,
    onClose,
    onAdd,
}: Props)
{
    const [name, setName] = useState("")
    const [itemTypeId, setItemTypeId] = useState<number | null>(null)

    const [options, setOptions] =
        useState<InspectionChecklistItemOption[]>([])


    useEffect(() =>
    {
        if (!open)
        {
            setName("")
            setItemTypeId(null)
            setOptions([])
        }
    }, [open])


    if (!open)
    {
        return null
    }


    const selectedItemType =
        inspectionItemTypes.find(
            (itemType) => itemType.id === itemTypeId
        )


    const isCustomOption =
        selectedItemType?.isCustomOption === true


    const handleAdd = () =>
    {
        if (!name.trim())
        {
            return
        }

        if (itemTypeId === null)
        {
            return
        }


        const normalizedOptions = isCustomOption
            ? options
                .map((option, index) => ({
                    value: option.value.trim(),
                    displayOrder: index + 1,
                }))
                .filter((option) => option.value)
            : []


        if (
            isCustomOption &&
            normalizedOptions.length === 0
        )
        {
            return
        }


        onAdd(
            name.trim(),
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
                if (event.target === event.currentTarget)
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
                <div className="px-6 py-4">

                    <h2 className="text-lg font-semibold text-gray-800">
                        点検項目を追加
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        点検項目の内容と入力方式を設定してください
                    </p>

                </div>


                {/* Body */}
                <div className="space-y-5 px-6 py-6">

                    {/* 項目名 */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
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
                                border border-gray-500
                                px-4 py-2.5
                                text-sm
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>


                    {/* 入力方式 */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            入力方式
                        </label>

                        <select
                            value={itemTypeId ?? ""}
                            onChange={(event) =>
                            {
                                const newItemTypeId =
                                    event.target.value === ""
                                        ? null
                                        : Number(event.target.value)


                                setItemTypeId(newItemTypeId)


                                const selectedItemType =
                                    inspectionItemTypes.find(
                                        (itemType) =>
                                            itemType.id === newItemTypeId
                                    )


                                if (
                                    !selectedItemType?.isCustomOption
                                )
                                {
                                    setOptions([])
                                }
                                else if (options.length === 0)
                                {
                                    setOptions([
                                        {
                                            value: "",
                                            displayOrder: 1,
                                        },
                                    ])
                                }
                            }}
                            className="
                                w-full
                                rounded-lg
                                border border-gray-500
                                bg-white
                                px-4 py-2.5
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

                            {inspectionItemTypes.map((itemType) => (
                                <option
                                    key={itemType.id}
                                    value={itemType.id}
                                >
                                    {itemType.name}
                                </option>
                            ))}

                        </select>

                    </div>


                    {/* 任意の選択肢 */}
                    {isCustomOption && (
                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                選択肢
                            </label>


                            <div className="space-y-2">

                                {options.map((option, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >

                                        <input
                                            type="text"
                                            value={option.value}
                                            onChange={(event) =>
                                            {
                                                setOptions((current) =>
                                                    current.map(
                                                        (
                                                            currentOption,
                                                            optionIndex
                                                        ) =>
                                                            optionIndex === index
                                                                ? {
                                                                    ...currentOption,
                                                                    value: event.target.value,
                                                                }
                                                                : currentOption
                                                    )
                                                )
                                            }}
                                            placeholder="選択肢を入力"
                                            className="
                                                min-w-0
                                                flex-1
                                                rounded-lg
                                                border border-gray-500
                                                px-4 py-2.5
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
                                            {
                                                setOptions((current) =>
                                                    current
                                                        .filter(
                                                            (_, optionIndex) =>
                                                                optionIndex !== index
                                                        )
                                                        .map(
                                                            (
                                                                currentOption,
                                                                optionIndex
                                                            ) => ({
                                                                ...currentOption,
                                                                displayOrder:
                                                                    optionIndex + 1,
                                                            })
                                                        )
                                                )
                                            }}
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                border
                                                border-gray-300
                                                text-gray-500
                                                hover:bg-gray-100
                                            "
                                        >
                                            ×
                                        </button>

                                    </div>
                                ))}


                                <button
                                    type="button"
                                    onClick={() =>
                                    {
                                        setOptions((current) => [
                                            ...current,
                                            {
                                                value: "",
                                                displayOrder:
                                                    current.length + 1,
                                            },
                                        ])
                                    }}
                                    className="
                                        mt-2
                                        text-sm
                                        font-medium
                                        text-blue-600
                                        hover:text-blue-800
                                    "
                                >
                                    ＋ 選択肢を追加
                                </button>

                            </div>

                        </div>
                    )}

                </div>


                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4">

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            border border-gray-300
                            bg-white
                            px-5 py-2.5
                            text-sm font-medium
                            text-gray-700
                            hover:bg-gray-50
                        "
                    >
                        キャンセル
                    </button>


                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={
                            !name.trim() ||
                            itemTypeId === null ||
                            (
                                isCustomOption &&
                                !options.some(
                                    (option) =>
                                        option.value.trim()
                                )
                            )
                        }
                        className="
                            rounded-lg
                            bg-blue-600
                            px-5 py-2.5
                            text-sm font-medium
                            text-white
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        追加
                    </button>

                </div>

            </div>

        </div>
    )
}