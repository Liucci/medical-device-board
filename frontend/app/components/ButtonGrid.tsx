import { ReactNode } from "react"

type Props = {
  onAdd: () => void
  title: string
  icon?: ReactNode

  titleSize?: string
  iconSize?: string
}

export default function ButtonGrid({
  onAdd,
  title,
  icon,
  titleSize = "text-sm",
  iconSize = "text-2xl"
}: Props) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="
        w-full
        h-10
        rounded-lg

        bg-white
        text-slate-700

        border
        border-slate-200

        flex
        items-center
        gap-2

        px-3

        hover:bg-slate-50
        hover:border-slate-300
        hover:text-slate-900

        transition-colors
      "
    >
      {icon && (
        <span
          className={`
            shrink-0
            flex
            items-center
            justify-center
            text-slate-500
            ${iconSize}
          `}
        >
          {icon}
        </span>
      )}

      <span
        className={`
          whitespace-nowrap
          font-bold
          ${titleSize}
        `}
      >
        {title}
      </span>
    </button>
  )
}