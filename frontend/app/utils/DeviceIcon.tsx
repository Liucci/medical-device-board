import { colorMap } from "../utils/deviceColors"

type Props = {
  typeName: string
  modelName: string
}
//機器アイコンのUIを定義する関数コンポーネント
export default function DeviceIcon({ typeName, modelName }: Props) {
  return (
    <div
      className={`
        w-20 h-16
        border
        rounded
        shadow
        ${colorMap[typeName]}
        flex flex-col items-center justify-center
        text-xs
      `}
    >
      <div>{typeName}</div>
      <div>{modelName}</div>
    </div>
  )
}