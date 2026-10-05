"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import type { InspectionChecklist } from "../../types/inspectionTypes/inspectionChecklistTypes"
import type { InspectionChecklistItem } from "../../types/inspectionTypes/inspectionChecklistItemTypes"
import type { InspectionChecklistItemOptionFrontType } from "../../types/inspectionTypes/inspectionChecklistItemOptionTypes"
import type { InspectionItemCategoryType } from "../../types/inspectionTypes/inspectionItemCategoryTypes"
import type { InspectionItemType } from "../../types/inspectionTypes/inspectionItemTypeTypes"
import { InspectionTwoChoiceInput } from "../components/InspectionTwoChoiceInput"

type BuildInspectionProps = {
    checklist: InspectionChecklist
    items: InspectionChecklistItem[]
    categories: InspectionItemCategoryType[]
    itemTypes: InspectionItemType[]
    optionsByChecklistItemId: Record<number, InspectionChecklistItemOptionFrontType[]>
    inspectionResults: Record<number, string | null>
    inspectionDate: string
    onChange: (itemId: number, value: string | null) => void
}

const NOT_APPLICABLE_VALUE = "-"
const LONG_PRESS_DURATION = 800

function getHourOptions() {
    return Array.from({ length: 24 }, (_, index) => index + 1)
}

function getMinuteOptions() {
    return Array.from({ length: 60 }, (_, index) => index)
}

function getDateTimeParts(value: string | null) {
    if (!value || value === "-" || value.length < 16) return { date: "", hour: "", minute: "" }
    const hour24 = Number(value.slice(11, 13))
    const hour = hour24 === 0 ? "24" : String(hour24)
    return { date: value.slice(0, 10), hour, minute: value.slice(14, 16) }
}

function buildDateTimeValue(date: string, hour: string, minute: string) {
    if (!date || !hour || !minute) return null
    const hourNumber = Number(hour)
    if (hourNumber < 1 || hourNumber > 24) return null
    const hourValue = hourNumber === 24 ? "00" : String(hourNumber).padStart(2, "0")
    return `${date} ${hourValue}:${minute}:00`
}

function getInspectionChecklistItemGroups(items: InspectionChecklistItem[], categories: InspectionItemCategoryType[]) {
    return categories
        .filter((category) => category.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((category) => ({
            category,
            items: items.filter((item) => item.categoryId === category.id).sort((a, b) => a.displayOrder - b.displayOrder),
        }))
        .filter((group) => group.items.length > 0)
}

type InspectionChecklistItemRowProps = {
    item: InspectionChecklistItem
    index: number
    itemTypes: InspectionItemType[]
    optionsByChecklistItemId: Record<number, InspectionChecklistItemOptionFrontType[]>
    inspectionResults: Record<number, string | null>
    inspectionDate: string
    onChange: (itemId: number, value: string | null) => void
}

function InspectionChecklistItemRow({
    item,
    index,
    itemTypes,
    optionsByChecklistItemId,
    inspectionResults,
    inspectionDate,
    onChange,
}: InspectionChecklistItemRowProps) {
    const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [isPressing, setIsPressing] = useState(false)
    const value = inspectionResults[item.id] ?? null
    const isNotApplicable = value === NOT_APPLICABLE_VALUE
    const itemType = itemTypes.find((it) => it.id === item.itemTypeId)
    const options = optionsByChecklistItemId[item.id] ?? []
    const initialDateTimeParts = getDateTimeParts(value)
    const [timeHour, setTimeHour] = useState(initialDateTimeParts.hour)
    const [timeMinute, setTimeMinute] = useState(initialDateTimeParts.minute)
    const [dateTimeDate, setDateTimeDate] = useState(initialDateTimeParts.date)
    const [dateTimeHour, setDateTimeHour] = useState(initialDateTimeParts.hour)
    const [dateTimeMinute, setDateTimeMinute] = useState(initialDateTimeParts.minute)

    useEffect(() => {
        const parts = getDateTimeParts(value)
        if (itemType?.inputType === "time") { setTimeHour(parts.hour); setTimeMinute(parts.minute) }
        if (itemType?.inputType === "datetime") { setDateTimeDate(parts.date); setDateTimeHour(parts.hour); setDateTimeMinute(parts.minute) }
    }, [value, itemType?.inputType])

    const clearLongPressTimer = () => {
        if (longPressTimerRef.current !== null) { clearTimeout(longPressTimerRef.current); longPressTimerRef.current = null }
        setIsPressing(false)
    }

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse" && event.button !== 0) return
        const target = event.target as HTMLElement
        if (["INPUT", "SELECT", "BUTTON", "LABEL"].includes(target.tagName)) return
        clearLongPressTimer()
        setIsPressing(true)
        longPressTimerRef.current = setTimeout(() => {
            if (isNotApplicable) onChange(item.id, null)
            else onChange(item.id, NOT_APPLICABLE_VALUE)
            clearLongPressTimer()
        }, LONG_PRESS_DURATION)
    }

    useEffect(() => { return () => clearLongPressTimer() }, [])

    if (!itemType) return null

    const renderInput = () => {
        switch (itemType.inputType) {
            case "number":
                return (
                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <input
                            type="text"
                            inputMode="decimal"
                            value={isNotApplicable ? "" : value ?? ""}
                            disabled={isNotApplicable}
                            placeholder="数値入力"
                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:w-36"
                            onChange={(event) => {
                                const inputVal = event.target.value.replace(/[^0-9.]/g, "")
                                const decIdx = inputVal.indexOf(".")
                                const normVal = decIdx === -1 ? inputVal : inputVal.slice(0, decIdx + 1) + inputVal.slice(decIdx + 1).replace(/\./g, "")
                                onChange(item.id, normVal || null)
                            }}
                        />
                        {item.unit && <span className="shrink-0 text-xs font-bold text-slate-600">{item.unit}</span>}
                    </div>
                )
            case "text":
                return (
                    <input
                        type="text"
                        value={isNotApplicable ? "" : value ?? ""}
                        disabled={isNotApplicable}
                        placeholder="テキスト入力"
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:w-64"
                        onChange={(event) => onChange(item.id, event.target.value || null)}
                    />
                )
            case "date":
                return (
                    <input
                        type="date"
                        value={isNotApplicable ? "" : value?.slice(0, 10) ?? ""}
                        disabled={isNotApplicable}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:w-48"
                        onChange={(event) => {
                            const date = event.target.value
                            onChange(item.id, date ? `${date} 00:00:00` : null)
                        }}
                    />
                )
            case "time":
                return (
                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <select
                            value={isNotApplicable ? "" : timeHour}
                            disabled={isNotApplicable}
                            className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:min-w-20 sm:flex-none"
                            onChange={(event) => {
                                const hour = event.target.value
                                setTimeHour(hour)
                                onChange(item.id, buildDateTimeValue(inspectionDate, hour, timeMinute))
                            }}
                        >
                            <option value="">時</option>
                            {getHourOptions().map((h) => (<option key={h} value={h}>{h}</option>))}
                        </select>
                        <span className="text-xs text-slate-500">時</span>
                        <select
                            value={isNotApplicable ? "" : timeMinute}
                            disabled={isNotApplicable}
                            className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:min-w-20 sm:flex-none"
                            onChange={(event) => {
                                const minute = event.target.value
                                setTimeMinute(minute)
                                onChange(item.id, buildDateTimeValue(inspectionDate, timeHour, minute))
                            }}
                        >
                            <option value="">分</option>
                            {getMinuteOptions().map((m) => {
                                const mVal = String(m).padStart(2, "0")
                                return <option key={m} value={mVal}>{mVal}</option>
                            })}
                        </select>
                        <span className="text-xs text-slate-500">分</span>
                    </div>
                )
            case "datetime":
                return (
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                        <input
                            type="date"
                            value={isNotApplicable ? "" : dateTimeDate}
                            disabled={isNotApplicable}
                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 sm:w-40"
                            onChange={(event) => {
                                const date = event.target.value
                                setDateTimeDate(date)
                                onChange(item.id, buildDateTimeValue(date, dateTimeHour, dateTimeMinute))
                            }}
                        />
                        <div className="flex items-center gap-2">
                            <select
                                value={isNotApplicable ? "" : dateTimeHour}
                                disabled={isNotApplicable}
                                className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 sm:w-20 sm:flex-none"
                                onChange={(event) => {
                                    const hour = event.target.value
                                    setDateTimeHour(hour)
                                    onChange(item.id, buildDateTimeValue(dateTimeDate, hour, dateTimeMinute))
                                }}
                            >
                                <option value="">時</option>
                                {getHourOptions().map((h) => (<option key={h} value={h}>{h}</option>))}
                            </select>
                            <span className="text-xs text-slate-500">時</span>
                            <select
                                value={isNotApplicable ? "" : dateTimeMinute}
                                disabled={isNotApplicable}
                                className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 sm:w-20 sm:flex-none"
                                onChange={(event) => {
                                    const minute = event.target.value
                                    setDateTimeMinute(minute)
                                    onChange(item.id, buildDateTimeValue(dateTimeDate, dateTimeHour, minute))
                                }}
                            >
                                <option value="">分</option>
                                {getMinuteOptions().map((m) => {
                                    const mVal = String(m).padStart(2, "0")
                                    return <option key={m} value={mVal}>{mVal}</option>
                                })}
                            </select>
                            <span className="text-xs text-slate-500">分</span>
                        </div>
                    </div>
                )
            case "checkbox":
                return (
                    <label className={`flex h-10 w-full items-center gap-3 rounded-lg border border-slate-200 px-3 transition-colors sm:w-auto ${
                        isNotApplicable ? "cursor-not-allowed bg-slate-100 opacity-50" : "cursor-pointer bg-slate-50 hover:bg-slate-100"
                    }`}>
                        <input
                            type="checkbox"
                            disabled={isNotApplicable}
                            checked={value === "true"}
                            className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                            onChange={(event) => onChange(item.id, String(event.target.checked))}
                        />
                        <span className="text-xs font-bold text-slate-700">確認完了</span>
                    </label>
                )
            case "select":
                return (
                    <select
                        value={isNotApplicable ? "対象外" : value ?? ""}
                        disabled={isNotApplicable}
                        className={`h-10 w-full rounded-lg border px-3 text-sm outline-none transition sm:w-48 ${
                            isNotApplicable
                                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                                : "border-slate-300 bg-white text-slate-800 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                        }`}
                        onChange={(event) => onChange(item.id, event.target.value || null)}
                    >
                        {isNotApplicable ? (
                            <option value="対象外">対象外</option>
                        ) : (
                            <>
                                <option value="">選択してください</option>
                                {options.map((opt) => (<option key={opt.id} value={opt.value}>{opt.value}</option>))}
                            </>
                        )}
                    </select>
                )
            case "two_choice":
                return (
                    <InspectionTwoChoiceInput
                        leftLabel={itemType.options?.[0] ?? "OK"}
                        rightLabel={itemType.options?.[1] ?? "NG"}
                        value={isNotApplicable ? null : value}
                        disabled={isNotApplicable}
                        onChange={(val) => onChange(item.id, val)}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerUp={clearLongPressTimer}
            onPointerCancel={clearLongPressTimer}
            onPointerLeave={clearLongPressTimer}
            onContextMenu={(event) => event.preventDefault()}
            className={`group relative flex flex-col justify-between gap-2.5 rounded-xl border p-3.5 transition-all select-none sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-3 ${
                isNotApplicable
                    ? "border-slate-200 bg-slate-100/90 opacity-70"
                    : isPressing
                    ? "border-teal-400 bg-teal-50/40 ring-2 ring-teal-300/40"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs shadow-2xs"
            }`}
        >
            <div className="flex min-w-0 flex-1 items-start justify-between gap-2 sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                    <span className="shrink-0 font-mono text-xs font-bold text-slate-400">{index + 1}.</span>
                    <span className={`min-w-0 flex-1 text-sm font-bold leading-snug ${
                        isNotApplicable ? "line-through text-slate-400" : "text-slate-800"
                    }`}>
                        {item.itemName}
                    </span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    {isNotApplicable ? (
                        <button
                            type="button"
                            onClick={() => onChange(item.id, null)}
                            className="rounded-md border border-slate-300 bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 transition-colors hover:bg-slate-300"
                            title="タップまたは長押しで解除"
                        >
                            対象外 (解除)
                        </button>
                    ) : item.required ? (
                        <span className="rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                            必須
                        </span>
                    ) : (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                            任意
                        </span>
                    )}
                </div>
            </div>

            <div className="w-full shrink-0 sm:w-auto">
                {renderInput()}
            </div>
        </div>
    )
}

export function buildInspection({
    checklist,
    items,
    categories,
    itemTypes,
    optionsByChecklistItemId,
    inspectionResults,
    inspectionDate,
    onChange,
}: BuildInspectionProps) {
    const groups = getInspectionChecklistItemGroups(items, categories)

    return (
        <div className="space-y-6">
            {groups.map((group) => (
                <section key={group.category.id} className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <h3 className="text-xs font-bold tracking-wide text-slate-700 sm:text-sm">
                            ■ {group.category.name}
                        </h3>
                        <span className="text-[11px] text-slate-400 font-medium">長押しで対象外切替</span>
                    </div>
                    <div className="space-y-2">
                        {group.items.map((item, idx) => (
                            <InspectionChecklistItemRow
                                key={item.id}
                                item={item}
                                index={idx}
                                itemTypes={itemTypes}
                                optionsByChecklistItemId={optionsByChecklistItemId}
                                inspectionResults={inspectionResults}
                                inspectionDate={inspectionDate}
                                onChange={onChange}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}