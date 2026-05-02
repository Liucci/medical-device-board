import { colorMap } from "../utils/deviceColors"

// DeviceIcon.tsx
// 機器アイコン表示コンポーネント

type Props = {
  typeName: string
  modelName: string
  assetType: string

  managementNumber?: string
  serialNumber?: string

  mAlert?: "red" | "yellow" | "green"

  cellSize: number
}

export default function DeviceIcon({
  typeName,
  modelName,
  assetType,
  managementNumber,
  serialNumber,
  mAlert,
  cellSize
}: Props) {

  // ===== 表示レベル =====
  const displayLevel =
    cellSize >= 104
      ? "max"
      : cellSize >= 88
      ? "large"
      : cellSize >= 72
      ? "normal"
      : cellSize >= 56
      ? "mid"
      : cellSize >= 40
      ? "small"
      : "mini"

  // ===== 点滅 =====
  const isBlink = mAlert === "red"

  // ===== メンテナンスインジケータ表示 =====
  const showIndicator =
    displayLevel !== "small" &&
    displayLevel !== "mini"

  // ===== フォントサイズ =====
  const fontSize =
    displayLevel === "max"
      ? 14
      : displayLevel === "large"
      ? 13
      : displayLevel === "normal"
      ? 11
      : displayLevel === "mid"
      ? 9
      : displayLevel === "small"
      ? 8
      : 7

  // ===== 行間 =====
  const lineHeight =
    displayLevel === "max"
      ? 1.15
      : displayLevel === "large"
      ? 1.1
      : 1.0

  // ===== 資産マークサイズ =====
  const assetMarkSize =
    cellSize >= 88 ? 18 : 14

  const assetFontSize =
    cellSize >= 88 ? 10 : 8

  // ===== 資産マーク位置 =====
  // メンテランプの右横
  const assetLeft =
    cellSize >= 88 ? 18 : 14

  return (
    <div
      className={`
        relative
        device-icon
        ${isBlink ? "blink" : ""}
      `}
    >

      {/* ===== メンテインジケータ ===== */}
      {showIndicator && mAlert && (
        <div
          className={`
            absolute
            top-1
            left-1
            rounded-full
            z-20

            ${mAlert === "red" ? "bg-red-500" : ""}
            ${mAlert === "yellow" ? "bg-yellow-400" : ""}
            ${mAlert === "green" ? "bg-green-500" : ""}
          `}
          style={{
            width: cellSize >= 88 ? 12 : 9,
            height: cellSize >= 88 ? 12 : 9
          }}
        />
      )}

      {/* ===== 資産分類マーク ===== */}
      {showIndicator && assetType === "レンタル" && (
        <div
          className="
            absolute
            z-30
            font-bold
            rounded-full
            bg-white
            border
            border-black
            flex
            items-center
            justify-center
            shadow-sm
          "
          style={{
            top: 2,
            left: assetLeft,

            width: assetMarkSize,
            height: assetMarkSize,

            fontSize: assetFontSize,
            lineHeight: 1
          }}
        >
          レ
        </div>
      )}

      {showIndicator && assetType === "代替機" && (
        <div
          className="
            absolute
            z-30
            font-bold
            rounded-full
            bg-white
            border-2
            border-black
            flex
            items-center
            justify-center
            shadow-sm
          "
          style={{
            top: 2,
            left: assetLeft,

            width: assetMarkSize,
            height: assetMarkSize,

            fontSize: assetFontSize,
            lineHeight: 1
          }}
        >
          代
        </div>
      )}

      {/* ===== 本体 ===== */}
      <div
        className={`
          border
          rounded
          shadow
          flex
          flex-col
          items-center
          justify-center
          overflow-hidden
          select-none
          px-1
          text-center
          ${colorMap[typeName]}
        `}
        style={{
          width: cellSize,
          height: cellSize * 0.8,

          fontSize: `${fontSize}px`,
          lineHeight,

          userSelect: "none"
        }}
      >

        {/* ===== MAX ===== */}
        {displayLevel === "max" && (
          <>
            <div className="font-bold truncate w-full">
              {typeName}
            </div>

            <div className="truncate w-full">
              {modelName}
            </div>

            {managementNumber && (
              <div className="truncate w-full">
                {managementNumber}
              </div>
            )}

            {serialNumber && (
              <div className="truncate w-full">
                {serialNumber}
              </div>
            )}
          </>
        )}

        {/* ===== LARGE ===== */}
        {displayLevel === "large" && (
          <>
            <div className="font-bold truncate w-full">
              {typeName}
            </div>

            <div className="truncate w-full">
              {modelName}
            </div>

            {managementNumber && (
              <div className="truncate w-full">
                {managementNumber}
              </div>
            )}
          </>
        )}

        {/* ===== NORMAL ===== */}
        {displayLevel === "normal" && (
          <>
            <div className="font-bold truncate w-full">
              {typeName}
            </div>

            <div className="truncate w-full">
              {modelName}
            </div>
          </>
        )}

        {/* ===== MID ===== */}
        {displayLevel === "mid" && (
          <div
            className="
              font-bold
              truncate
              w-full
            "
          >
            {modelName}
          </div>
        )}

        {/* ===== SMALL ===== */}
        {displayLevel === "small" && (
          <div
            className="
              truncate
              w-full
            "
          >
            {modelName}
          </div>
        )}

        {/* ===== MINI ===== */}
        {displayLevel === "mini" && null}

      </div>
    </div>
  )
}