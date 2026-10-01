import { useState } from "react"

type InputModalType = "text" | "number" | "date" | "time"

type OpenInputModalParams = {
    title: string
    label?: string
    type?: InputModalType
    value?: string
    placeholder?: string
    required?: boolean
    min?: number
    max?: number
    step?: number
    onConfirm: (value: string) => Promise<void> | void
}

export default function useInputModal() {
    const [isOpen, setIsOpen] = useState(false)

    const [title, setTitle] = useState("")
    const [label, setLabel] = useState("")
    const [type, setType] = useState<InputModalType>("text")
    const [value, setValue] = useState("")
    const [placeholder, setPlaceholder] = useState("")
    const [required, setRequired] = useState(true)

    const [min, setMin] = useState<number | undefined>(undefined)
    const [max, setMax] = useState<number | undefined>(undefined)
    const [step, setStep] = useState<number | undefined>(undefined)

    const [onConfirm, setOnConfirm] = useState<
        (value: string) => Promise<void> | void
    >(() => {})

    const openInputModal = ({
        title,
        label,
        type = "text",
        value = "",
        placeholder = "",
        required = true,
        min,
        max,
        step,
        onConfirm,
    }: OpenInputModalParams) => {
        setTitle(title)
        setLabel(label ?? "")
        setType(type)
        setValue(value)
        setPlaceholder(placeholder)
        setRequired(required)

        setMin(min)
        setMax(max)
        setStep(step)

        setOnConfirm(() => onConfirm)

        setIsOpen(true)
    }

    const closeInputModal = () => {
        setIsOpen(false)
    }

    return {
        isOpen,

        title,
        label,
        type,
        value,
        placeholder,
        required,
        min,
        max,
        step,

        onConfirm,

        openInputModal,
        closeInputModal,
    }
}