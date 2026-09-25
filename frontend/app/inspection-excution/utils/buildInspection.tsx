// 点検項目情報
import type { InspectionChecklist } from "../../types/inspectionTypes/inspectionChecklistTypes"
import type { InspectionChecklistItem } from "../../types/inspectionTypes/inspectionChecklistItemTypes"
import type { InspectionChecklistItemOptionFrontType } from "../../types/inspectionTypes/inspectionChecklistItemOptionTypes"
import type { InspectionItemCategoryType } from "../../types/inspectionTypes/inspectionItemCategoryTypes"
import type { InspectionItemType } from "../../types/inspectionTypes/inspectionItemTypeTypes"

// UI構築用
import { InspectionTwoChoiceInput } from "../components/InspectionTwoChoiceInput"
import { useEffect, useRef, useState } from "react"


type BuildInspectionProps = {
    checklist: InspectionChecklist
    items: InspectionChecklistItem[]
    categories: InspectionItemCategoryType[]
    itemTypes: InspectionItemType[]
    optionsByChecklistItemId: Record<number, InspectionChecklistItemOptionFrontType[]>
    inspectionResults: Record<number, string | null>
    onChange: (itemId: number, value: string | null) => void
}


const NOT_APPLICABLE_VALUE = "-"

const LONG_PRESS_DURATION = 1000

const HOVER_DELAY = 1000
const HOVER_DISPLAY_DURATION = 2000


function getInspectionChecklistItemGroups(
    items: InspectionChecklistItem[],
    categories: InspectionItemCategoryType[]
) {
    return categories
        .filter(category => category.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(category => ({
            category,
            items: items
                .filter(item => item.categoryId === category.id)
                .sort((a, b) => a.displayOrder - b.displayOrder)
        }))
        .filter(group => group.items.length > 0)
}


type InspectionChecklistItemRowProps = {
    item: InspectionChecklistItem
    itemTypes: InspectionItemType[]
    optionsByChecklistItemId: Record<number, InspectionChecklistItemOptionFrontType[]>
    inspectionResults: Record<number, string | null>
    onChange: (itemId: number, value: string | null) => void
}


function InspectionChecklistItemRow({
    item,
    itemTypes,
    optionsByChecklistItemId,
    inspectionResults,
    onChange
}: InspectionChecklistItemRowProps) {

    const [showTooltip, setShowTooltip] = useState(false)

    const longPressTimerRef =
        useRef<ReturnType<typeof setTimeout> | null>(null)

    const hoverTimerRef =
        useRef<ReturnType<typeof setTimeout> | null>(null)

    const tooltipTimerRef =
        useRef<ReturnType<typeof setTimeout> | null>(null)


    const value = inspectionResults[item.id] ?? null

    const isNotApplicable =
        value === NOT_APPLICABLE_VALUE


    const clearLongPressTimer = () => {
        if (longPressTimerRef.current !== null) {
            clearTimeout(longPressTimerRef.current)
            longPressTimerRef.current = null
        }
    }


    const clearHoverTimers = () => {

        if (hoverTimerRef.current !== null) {
            clearTimeout(hoverTimerRef.current)
            hoverTimerRef.current = null
        }

        if (tooltipTimerRef.current !== null) {
            clearTimeout(tooltipTimerRef.current)
            tooltipTimerRef.current = null
        }
    }


    const handlePointerDown = (
        event: React.PointerEvent<HTMLDivElement>
    ) => {

        if (
            event.pointerType === "mouse" &&
            event.button !== 0
        ) {
            return
        }

        clearLongPressTimer()

        longPressTimerRef.current = setTimeout(() => {

            if (isNotApplicable) {
                onChange(item.id, null)
            } else {
                onChange(
                    item.id,
                    NOT_APPLICABLE_VALUE
                )
            }

            longPressTimerRef.current = null

        }, LONG_PRESS_DURATION)
    }


    const handlePointerUp = () => {
        clearLongPressTimer()
    }


    const handlePointerCancel = () => {
        clearLongPressTimer()
    }


    const handlePointerLeave = () => {
        clearLongPressTimer()
    }


    const handleMouseEnter = () => {

        clearHoverTimers()

        hoverTimerRef.current = setTimeout(() => {

            setShowTooltip(true)

            tooltipTimerRef.current = setTimeout(() => {

                setShowTooltip(false)

                tooltipTimerRef.current = null

            }, HOVER_DISPLAY_DURATION)

            hoverTimerRef.current = null

        }, HOVER_DELAY)
    }


    const handleMouseLeave = () => {

        clearHoverTimers()

        setShowTooltip(false)
    }


    useEffect(() => {

        return () => {
            clearLongPressTimer()
            clearHoverTimers()
        }

    }, [])


    const itemType = itemTypes.find(
        itemType =>
            itemType.id === item.itemTypeId
    )

    const options =
        optionsByChecklistItemId[item.id] ?? []


    if (!itemType) {
        return null
    }


    const renderInput = () => {

        switch (itemType.inputType) {

            case "number":

                return (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            inputMode="decimal"
                            value={inspectionResults[item.id] ?? ""}
                            className="
                                w-32
                                rounded-lg
                                border
                                border-gray-500
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                            onChange={event => {
                                const value = event.target.value.replace(/[^0-9.]/g, "")
                                const decimalIndex = value.indexOf(".")
                                const normalizedValue =
                                    decimalIndex === -1
                                        ? value
                                        : value.slice(0, decimalIndex + 1) +
                                        value.slice(decimalIndex + 1).replace(/\./g, "")
                                onChange(item.id, normalizedValue)
                            }}
                        />
                        {item.unit && (
                            <span className="text-sm text-gray-600">
                                {item.unit}
                            </span>
                        )}
                    </div>                    
                )


            case "checkbox":

                return (
                    <label
                        className={`
                            flex
                            items-center
                            gap-3
                            ${
                                isNotApplicable
                                    ? "cursor-not-allowed opacity-50"
                                    : "cursor-pointer"
                            }
                        `}
                    >

                        <input
                            type="checkbox"
                            disabled={isNotApplicable}
                            checked={
                                value === "true"
                            }
                            className="
                                h-5
                                w-5
                                rounded
                                border-gray-400
                                text-blue-600
                                focus:ring-2
                                focus:ring-blue-100
                            "
                            onChange={event => {

                                onChange(
                                    item.id,
                                    String(
                                        event.target.checked
                                    )
                                )
                            }}
                        />

                        <span className="text-sm text-gray-700">
                            確認済み
                        </span>

                    </label>
                )


            case "select":

                return (
                    <select
                        value={
                            isNotApplicable
                                ? "対象外"
                                : value ?? ""
                        }
                        disabled={isNotApplicable}
                        className={`
                            min-w-40
                            rounded-lg
                            border
                            border-gray-500
                            px-4
                            py-2.5
                            text-sm
                            outline-none
                            transition
                            ${
                                isNotApplicable
                                    ? "cursor-not-allowed bg-gray-100 text-gray-500"
                                    : "bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            }
                        `}
                        onChange={event => {

                            onChange(
                                item.id,
                                event.target.value || null
                            )
                        }}
                    >

                        {isNotApplicable ? (

                            <option value="対象外">
                                対象外
                            </option>

                        ) : (

                            <>
                                <option value="">
                                    選択してください
                                </option>

                                {options.map(option => (
                                    <option
                                        key={option.id}
                                        value={option.value}
                                    >
                                        {option.value}
                                    </option>
                                ))}
                            </>

                        )}

                    </select>
                )


            case "two_choice":

                return (
                    <InspectionTwoChoiceInput
                        leftLabel={
                            itemType.options?.[0] ?? ""
                        }
                        rightLabel={
                            itemType.options?.[1] ?? ""
                        }
                        value={
                            isNotApplicable
                                ? null
                                : value
                        }
                        disabled={isNotApplicable}
                        onChange={value =>
                            onChange(
                                item.id,
                                value
                            )
                        }
                    />
                )


            default:
                return null
        }
    }


    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerLeave}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onContextMenu={event => {
                event.preventDefault()
            }}
            className={`
                group
                relative
                flex
                items-center
                justify-between
                gap-6
                rounded-lg
                border
                border-gray-300
                px-5
                py-4
                shadow-sm
                transition
                select-none
                ${
                    isNotApplicable
                        ? "bg-gray-100"
                        : "bg-white hover:shadow"
                }
            `}
        >

            {showTooltip && (
                <div
                    className="
                        pointer-events-none
                        absolute
                        left-[40%]
                        top-1/2
                        z-50
                        -translate-y-1/2
                        whitespace-nowrap
                        text-xs
                        text-red-500/70
                    "
                >
                    {isNotApplicable
                        ? "長押しで対象外を解除できます"
                        : "長押しで対象外にできます"
                    }
                </div>
            )}


            {/* 項目名 */}

            <div className="
                min-w-0
                flex-1
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                ">

                    <span
                        className={`
                            text-sm
                            font-medium
                            text-gray-700
                            ${
                                isNotApplicable
                                    ? "line-through text-gray-400"
                                    : ""
                            }
                        `}
                    >
                        {item.itemName}
                    </span>


                    {isNotApplicable && (
                        <span className="
                            rounded
                            bg-gray-200
                            px-2
                            py-0.5
                            text-xs
                            font-medium
                            text-gray-500
                        ">
                            対象外
                        </span>
                    )}


                    {!item.required &&
                        !isNotApplicable && (
                            <span className="
                                rounded
                                bg-red-50
                                px-2
                                py-0.5
                                text-xs
                                font-medium
                                text-red-500
                            ">
                                入力任意
                            </span>
                        )}

                </div>

            </div>


            {/* 入力UI */}

            <div className="shrink-0">
                {renderInput()}
            </div>

        </div>
    )
}


export function buildInspection({
    items,
    categories,
    itemTypes,
    optionsByChecklistItemId,
    inspectionResults,
    onChange
}: BuildInspectionProps) {

    console.log("buildInspection")


    const groups =
        getInspectionChecklistItemGroups(
            items,
            categories
        )


    return (
        <div className="space-y-8">

            {groups.map(group => (

                <section
                    key={group.category.id}
                >

                    {/* カテゴリ */}

                    <div className="
                        mb-3
                        border-b
                        border-gray-200
                        pb-2
                    ">

                        <h3 className="
                            text-base
                            font-semibold
                            text-gray-800
                        ">
                            {group.category.name}
                        </h3>

                    </div>


                    {/* 項目 */}

                    <div className="space-y-3">

                        {group.items.map(item => (

                            <InspectionChecklistItemRow
                                key={item.id}
                                item={item}
                                itemTypes={itemTypes}
                                optionsByChecklistItemId={
                                    optionsByChecklistItemId
                                }
                                inspectionResults={
                                    inspectionResults
                                }
                                onChange={onChange}
                            />

                        ))}

                    </div>

                </section>

            ))}

        </div>
    )
}