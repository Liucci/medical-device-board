//点検項目情報
import type { InspectionChecklist } from "../../types/inspectionTypes/inspectionChecklistTypes"
import type { InspectionChecklistItem } from "../../types/inspectionTypes/inspectionChecklistItemTypes"
import type { InspectionChecklistItemOptionFrontType } from "../../types/inspectionTypes/inspectionChecklistItemOptionTypes"
import type { InspectionItemCategoryType } from "../../types/inspectionTypes/inspectionItemCategoryTypes"
import type { InspectionItemType } from "../../types/inspectionTypes/inspectionItemTypeTypes"

//UI構築用
import { InspectionTwoChoiceInput } from "../components/InspectionTwoChoiceInput"

type BuildInspectionProps = {
    checklist: InspectionChecklist
    items: InspectionChecklistItem[]
    categories: InspectionItemCategoryType[]
    itemTypes: InspectionItemType[]
    optionsByChecklistItemId: Record<number, InspectionChecklistItemOptionFrontType[]>
}

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

function getInspectionChecklistItemInput(
    item: InspectionChecklistItem,
    itemTypes: InspectionItemType[],
    options: InspectionChecklistItemOptionFrontType[]
) {
    const itemType = itemTypes.find(
        itemType => itemType.id === item.itemTypeId
    )

    if (!itemType) {
        return null
    }

    switch (itemType.inputType) {
        case "number":
            return (
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        inputMode="numeric"
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
                            event.target.value =
                                event.target.value.replace(/[^0-9]/g, "")
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
                <label className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                ">
                    <input
                        type="checkbox"
                        className="
                            h-5
                            w-5
                            rounded
                            border-gray-400
                            text-blue-600
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    />

                    <span className="text-sm text-gray-700">
                        確認済み
                    </span>
                </label>
            )

        case "select":
            return (
                <select
                    className="
                        min-w-40
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
                >
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
                </select>
            )

        case "two_choice":
            return (
                <InspectionTwoChoiceInput
                    leftLabel={itemType.options?.[0] ?? ""}
                    rightLabel={itemType.options?.[1] ?? ""}
                />
            )

        default:
            return null
    }
}

export function buildInspection({
    items,
    categories,
    itemTypes,
    optionsByChecklistItemId
}: BuildInspectionProps) {
    console.log("buildInspection")

    const groups = getInspectionChecklistItemGroups(
        items,
        categories
    )

    return (
        <div className="space-y-8">
            {groups.map(group => (
                <section key={group.category.id}>

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
                            <div
                                key={item.id}
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-6
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    px-5
                                    py-4
                                    shadow-sm
                                    transition
                                    hover:shadow
                                "
                            >
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
                                        <span className="
                                            text-sm
                                            font-medium
                                            text-gray-700
                                        ">
                                            {item.itemName}
                                        </span>

                                        {item.required && (
                                            <span className="
                                                rounded
                                                bg-red-50
                                                px-2
                                                py-0.5
                                                text-xs
                                                font-medium
                                                text-red-500
                                            ">
                                                必須
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* 入力UI */}
                                <div className="shrink-0">
                                    {getInspectionChecklistItemInput(
                                        item,
                                        itemTypes,
                                        optionsByChecklistItemId[item.id] ?? []
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}