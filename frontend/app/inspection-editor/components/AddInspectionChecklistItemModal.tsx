"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import type { InspectionItemType } from "../../types/inspectionTypes/inspectionItemTypeTypes"
import type { InspectionItemCategoryType } from "../../types/inspectionTypes/inspectionItemCategoryTypes"
import type { InspectionChecklistItemOption } from "../../types/inspectionTypes/inspectionChecklistItemOptionTypes"

type Props = {
    open: boolean
    inspectionItemTypes: InspectionItemType[]
    inspectionItemCategories: InspectionItemCategoryType[]
    onClose: () => void
    onAdd: (
        name: string,
        categoryId: number,
        itemTypeId: number,
        required: boolean,
        options: InspectionChecklistItemOption[],
        unit: string | null
    ) => void
}

export default function AddInspectionChecklistItemModal({
    open,
    inspectionItemTypes,
    inspectionItemCategories,
    onClose,
    onAdd,
}: Props) {
    const [name, setName] = useState("")
    const [unit, setUnit] = useState("")
    const [categoryId, setCategoryId] = useState<number | null>(null)
    const [itemTypeId, setItemTypeId] = useState<number | null>(null)
    const [required, setRequired] = useState(true)
    const [options, setOptions] = useState<InspectionChecklistItemOption[]>([])

    // ② モーダル表示時に背面のスクロールを抑止（クローズ時に自動復元）
    useEffect(() => {
        if (!open) return
        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = originalOverflow }
    }, [open])

    useEffect(() => {
        if (!open) {
            setName("")
            setCategoryId(null)
            setItemTypeId(null)
            setRequired(true)
            setOptions([])
            setUnit("")
        }
    }, [open])

    if (!open) return null

    const selectedItemType = inspectionItemTypes.find((itemType) => itemType.id === itemTypeId)
    const isCustomOption = selectedItemType?.isCustomOption === true
    const isNumberInput = selectedItemType?.name === "数値入力"

    const handleAdd = () => {
        if (!name.trim()) { alert("項目名を入力してください"); return }
        if (categoryId === null) { alert("カテゴリを選択してください"); return }
        if (itemTypeId === null) { alert("入力方式を選択してください"); return }

        const normalizedOptions = isCustomOption
            ? options.map((option, index) => ({ value: option.value.trim(), displayOrder: index + 1 })).filter((option) => option.value)
            : []

        if (isCustomOption && normalizedOptions.length === 0) {
            alert("選択肢を1つ以上入力してください")
            return
        }

        if (isCustomOption && new Set(normalizedOptions.map((option) => option.value)).size !== normalizedOptions.length) {
            alert("同じ選択肢は登録できません")
            return
        }

        onAdd(
            name.trim(),
            categoryId,
            itemTypeId,
            required,
            normalizedOptions,
            unit.trim() || null
        )
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
        >
            {/* スマホ：下から約2/5高さ(h-[40vh])でスライドイン / PC：中央配置 */}
            <div className="flex h-[45vh] w-full flex-col overflow-hidden rounded-t-2xl border-t border-slate-300 bg-slate-50 shadow-2xl transition-transform duration-200 animate-in slide-in-from-bottom sm:h-auto sm:max-h-[94vh] sm:max-w-xl sm:rounded-2xl sm:border sm:border-slate-300 sm:animate-none">
                {/* Header */}
                <div className="bg-slate-900 px-4 py-2.5 text-white sm:px-5 sm:py-3">
                    <div className="flex justify-center pb-1.5 sm:hidden">
                        <div className="h-1 w-10 rounded-full bg-slate-600" />
                    </div>
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-sm font-bold sm:text-base">点検項目を追加</h2>
                            <p className="mt-0.5 text-[11px] text-slate-300">点検項目の内容・大項目・入力方式を設定してください</p>
                        </div>
                        <button type="button" onClick={onClose} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white sm:h-8 sm:w-8" title="閉じる" aria-label="閉じる">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="min-h-0 flex-1 overflow-y-auto space-y-3.5 px-4 py-3.5 sm:space-y-4 sm:px-5 sm:py-5">
                    {/* 項目名 */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-500 sm:mb-2">項目名</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="例：電源が正常に入ること"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:px-4 sm:py-2.5"
                        />
                    </div>

                    {/* 入力任意 */}
                    <div className="flex items-center">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                checked={!required}
                                onChange={(event) => setRequired(!event.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                            />
                            <span className="text-xs font-medium text-slate-500">入力任意</span>
                        </label>
                    </div>

                    {/* 大項目 */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-500 sm:mb-2">大項目</label>
                        <select
                            value={categoryId ?? ""}
                            onChange={(event) => setCategoryId(event.target.value === "" ? null : Number(event.target.value))}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:px-4 sm:py-2.5"
                        >
                            <option value="">選択してください</option>
                            {inspectionItemCategories.filter((category) => category.isActive).map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 入力方式 */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-500 sm:mb-2">入力方式</label>
                        <select
                            value={itemTypeId ?? ""}
                            onChange={(event) => {
                                const newItemTypeId = event.target.value === "" ? null : Number(event.target.value)
                                setItemTypeId(newItemTypeId)
                                const selected = inspectionItemTypes.find((it) => it.id === newItemTypeId)
                                if (!selected?.isCustomOption) setOptions([])
                                else if (options.length === 0) setOptions([{ value: "", displayOrder: 1 }])
                                if (selected?.name !== "数値入力") setUnit("")
                            }}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:px-4 sm:py-2.5"
                        >
                            <option value="">選択してください</option>
                            {inspectionItemTypes.map((itemType) => (
                                <option key={itemType.id} value={itemType.id}>{itemType.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 任意の選択肢 */}
                    {isCustomOption && (
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-500 sm:mb-2">選択肢</label>
                            <div className="space-y-2">
                                {options.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={option.value}
                                            onChange={(event) => {
                                                setOptions((current) => current.map((cOpt, optIdx) => optIdx === index ? { ...cOpt, value: event.target.value } : cOpt))
                                            }}
                                            placeholder="選択肢を入力"
                                            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:px-4 sm:py-2.5"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setOptions((current) => current.filter((_, optIdx) => optIdx !== index).map((cOpt, optIdx) => ({ ...cOpt, displayOrder: optIdx + 1 })))}
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-slate-500 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                                            title="削除"
                                            aria-label="選択肢を削除"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => setOptions((current) => [...current, { value: "", displayOrder: current.length + 1 }])}
                                className="mt-2.5 text-xs font-medium text-teal-700 hover:text-teal-800 sm:mt-3 sm:text-sm"
                            >
                                ＋ 選択肢を追加
                            </button>
                        </div>
                    )}

                    {/* 単位 */}
                    {isNumberInput && (
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-500 sm:mb-2">単位</label>
                            <input
                                type="text"
                                value={unit}
                                onChange={(event) => setUnit(event.target.value)}
                                placeholder="例：mmHg、回、個"
                                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:px-4 sm:py-2.5"
                            />
                        </div>
                    )}
                </div>

                {/* ① Footer: スマホでは横幅100%を2分割横並び(flex-1・h-10) / PCでは右寄せ(w-24・h-9) */}
                <div className="flex w-full gap-2 border-t border-slate-200 bg-white p-3 sm:justify-end sm:gap-3 sm:px-5 sm:py-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 sm:h-9 sm:w-24 sm:flex-none sm:text-sm"
                    >
                        キャンセル
                    </button>
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={!name.trim() || categoryId === null || itemTypeId === null || (isCustomOption && options.every((option) => !option.value.trim()))}
                        className="flex h-10 flex-1 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-24 sm:flex-none sm:text-sm"
                    >
                        追加
                    </button>
                </div>
            </div>
        </div>
    )
}