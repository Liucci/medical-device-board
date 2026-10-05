"use client"

type Props = {
    leftLabel: string
    rightLabel: string
    value: string | null
    onChange: (value: string | null) => void
    disabled?: boolean
}

export function InspectionTwoChoiceInput({
    leftLabel,
    rightLabel,
    value,
    onChange,
    disabled,
}: Props) {
    return (
        <div className="flex w-full gap-2 sm:w-auto">
            <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(leftLabel)}
                className={`flex h-10 flex-1 items-center justify-center rounded-lg border px-4 text-xs font-bold transition-all sm:h-9 sm:min-w-24 sm:flex-none sm:text-sm ${
                    disabled
                        ? "cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200"
                        : value === leftLabel
                        ? "border-teal-700 bg-teal-700 text-white shadow-sm"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                }`}
            >
                {leftLabel}
            </button>
            <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(rightLabel)}
                className={`flex h-10 flex-1 items-center justify-center rounded-lg border px-4 text-xs font-bold transition-all sm:h-9 sm:min-w-24 sm:flex-none sm:text-sm ${
                    disabled
                        ? "cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200"
                        : value === rightLabel
                        ? "border-teal-700 bg-teal-700 text-white shadow-sm"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                }`}
            >
                {rightLabel}
            </button>
        </div>
    )
}