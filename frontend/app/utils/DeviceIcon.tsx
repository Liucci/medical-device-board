import { colorMap } from "../utils/deviceColors"
//DeviceIcon.tsxは機器のアイコンを表示するためのコンポーネント
//
type Props = {
  typeName: string
  modelName: string
  assetType: string
  mAlert?: "red" | "yellow" | "green"
  cellSize: number
  //isDragging?: boolean 
}
//機器アイコンのUIを定義する関数コンポーネント
export default function DeviceIcon({ 
  typeName, 
  modelName,
  assetType, 
  mAlert,
  cellSize,
  //isDragging 
}: Props) {

  const isBlink = mAlert === "red"
  const displayLevel =
    cellSize >= 64
      ? "full"
      : cellSize >= 40
      ? "compact"
      : "minimal"

  return (
    <div className={`relative ${isBlink ? "blink" : ""} `}>
      
      {mAlert && (
        <div
          className={`
            absolute top-1 left-1
            w-3 h-3 rounded-full
            z-20
            ${mAlert === "red" ? "bg-red-500" : ""}
            ${mAlert === "yellow" ? "bg-yellow-400" : ""}
            ${mAlert === "green" ? "bg-green-500" : ""}
          `}
        />
      )}
      {/*  w-20 h-16はやめて動的サイズ変更可に */}
      <div
        className={`
          border
          rounded
          shadow
          ${colorMap[typeName]}
          flex flex-col items-center justify-center
          text-xs
        `}
      
        // アイコンサイズを動的に調整するためのスタイル
          style={{
            width: cellSize,
            height: cellSize * 0.8
          }}
      >
          {displayLevel === "full" && (
            <>
              <div>{typeName}</div>
              <div>{modelName}</div>
              {assetType !== "資産" && (
                <div>{assetType}</div>
              )}
            </>
          )}

          {displayLevel === "compact" && (
            <div>{modelName}</div>
          )}

          {displayLevel === "minimal" && null}
      </div>

    </div>
  )
}