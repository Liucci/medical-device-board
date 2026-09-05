type Props = {
    leftLabel: string
    rightLabel: string
    value: string | null
    onChange: (value: string | null) => void
}

export function InspectionTwoChoiceInput({
    leftLabel,
    rightLabel,
    value,
    onChange
}: Props) {
    console.log("InspectionTwoChoiceInput")

    return (
        <div className="flex gap-2">
            <button
                type="button"
                onClick={() => onChange(leftLabel)}
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
                        value === leftLabel
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-500 bg-white text-gray-700 hover:bg-gray-50"
                    }
                `}
            >
                {leftLabel}
            </button>

            <button
                type="button"
                onClick={() => onChange(rightLabel)}
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
                        value === rightLabel
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