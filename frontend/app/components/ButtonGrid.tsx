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
      onClick={onAdd}
        className="
          w-full
          h-20
          rounded-2xl

          bg-white
          text-black

          border
          border-gray-300

          shadow-sm

          flex
          flex-col
          items-center
          justify-center
          gap-1

          hover:bg-gray-100
          hover:shadow-md

          transition
        "    
        >
      <span className={titleSize}>
        {title}
      </span>

      {icon && (
        <span
          className={`
            flex
            items-center
            justify-center
            ${iconSize}
          `}
        >
          {icon}
        </span>
      )}
    </button>
  )
}