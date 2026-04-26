import { colorMap } from "../utils/deviceColors"
//DeviceIcon.tsxは機器のアイコンを表示するためのコンポーネント
//
type Props = {
  typeName: string
  modelName: string
  assetType: string
  mAlert?: "red" | "yellow" | "green"
}
//機器アイコンのUIを定義する関数コンポーネント
export default function DeviceIcon({ typeName, modelName,assetType, mAlert }: Props) {
  return (
  <div className="relative">   {/* ← 追加 */}

    {mAlert && (
      <div
        className={`
          absolute top-1 left-1
          w-3 h-3 rounded-full
          ${mAlert === "red" ? "bg-red-500" : ""}
          ${mAlert === "yellow" ? "bg-yellow-400" : ""}
          ${mAlert === "green" ? "bg-green-500" : ""}
        `}
      />
    )}

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
      {assetType !== "資産" && <div>{assetType}</div>}
    </div>

  </div>
  )
}