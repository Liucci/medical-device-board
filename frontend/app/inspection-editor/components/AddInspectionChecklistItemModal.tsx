"use client"

import { useEffect, useState } from "react"

import type {
    InspectionItemType,
} from "../../types/inspectionTypes/inspectionItemTypeTypes"


type Props = {
    open: boolean
    inspectionItemTypes: InspectionItemType[]
    onClose: () => void
    onAdd: (
        name: string,
        itemTypeId: number
    ) => void
}


export default function AddInspectionChecklistItemModal({
    open,
    inspectionItemTypes,
    onClose,
    onAdd,
}: Props)
{
    const [name, setName] = useState("")
    const [itemTypeId, setItemTypeId] = useState<number | null>(null)


    useEffect(() =>
    {
        if (!open)
        {
            setName("")
            setItemTypeId(null)
        }
    }, [open])


    if (!open)
    {
        return null
    }


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

        onAdd(
            name.trim(),
            itemTypeId
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
                <div className="border-b px-6 py-4">

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
                                border border-gray-300
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
                                setItemTypeId(
                                    event.target.value === ""
                                        ? null
                                        : Number(event.target.value)
                                )
                            }}
                            className="
                                w-full
                                rounded-lg
                                border border-gray-300
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

                </div>


                {/* Footer */}
                <div className="flex justify-end gap-3 border-t px-6 py-4">

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
                            itemTypeId === null
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