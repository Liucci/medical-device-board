import { useState } from "react"

type Props = {
    leftLabel: string
    rightLabel: string
}

export function InspectionTwoChoiceInput({
    leftLabel,
    rightLabel
}: Props) {
    console.log("InspectionTwoChoiceInput")

    const [selected, setSelected] = useState<"left" | "right" | null>(null)

    return (
        <div className="flex gap-2">
            <button
                type="button"
                onClick={() => setSelected("left")}
                className={`
                    min-w-28
                    rounded-lg
                    border
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    shadow-sm
                    transition
                    ${
                        selected === "left"
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-500 bg-white text-gray-700 hover:bg-gray-50"
                    }
                `}
            >
                {leftLabel}
            </button>

            <button
                type="button"
                onClick={() => setSelected("right")}
                className={`
                    min-w-28
                    rounded-lg
                    border
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    shadow-sm
                    transition
                    ${
                        selected === "right"
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-500 bg-white text-gray-700 hover:bg-gray-50"
                    }
                `}
            >
                {rightLabel}
            </button>
        </div>
    )
}