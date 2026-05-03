import { colorMap } from "../utils/deviceColors"

// DeviceIcon.tsx
// 機器アイコン表示コンポーネント

type Props = {
  typeName: string
  modelName: string
  assetType: string

  managementNumber?: string
  serialNumber?: string

  rentalEndDate?: string

  mAlert?: "red" | "yellow" | "green"

  cellSize: number
  isUnderMaintenance?: boolean
}

export default function DeviceIcon({
  typeName,
  modelName,
  assetType,
  managementNumber,
  serialNumber,
  rentalEndDate,
  mAlert,
  cellSize,
  isUnderMaintenance
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
  const assetLeft =
    cellSize >= 88 ? 18 : 14

  // ===== 返却アラート判定 =====
  const getRentalAlert = (
    assetType?: string,
    rentalEndDate?: string
  ): "red" | "yellow" | "normal" => {

    // 対象外
    if (
      assetType !== "レンタル" &&
      assetType !== "代替機"
    ) {
      return "normal"
    }

    // 返却日なし
    if (!rentalEndDate) {
      return "normal"
    }

    const today = new Date()
    const end = new Date(rentalEndDate)

    // 時刻ズレ対策
    today.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    const diff =
      end.getTime() - today.getTime()

    const days =
      Math.ceil(diff / (1000 * 60 * 60 * 24))

    // 超過
    if (days < 0) {
      return "red"
    }

    // 2日前以内
    if (days <= 2) {
      return "yellow"
    }

    return "normal"
  }

  const rentalAlert =
    getRentalAlert(
      assetType,
      rentalEndDate
    )

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

      {/* ===== レンタル ===== */}
      {showIndicator && assetType === "レンタル" && (
        <div
          className={`
            absolute
            z-30
            font-bold
            rounded-full
            border
            flex
            items-center
            justify-center
            shadow-sm

            ${
              rentalAlert === "red"
                ? "bg-red-500 text-white border-red-700 animate-pulse"
                : rentalAlert === "yellow"
                ? "bg-yellow-300 text-black border-yellow-500"
                : "bg-green-500 text-white border-green-700"            }
          `}
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

      {/* ===== 代替機 ===== */}
      {showIndicator && assetType === "代替機" && (
        <div
          className={`
            absolute
            z-30
            font-bold
            rounded-full
            border
            flex
            items-center
            justify-center
            shadow-sm

            ${
              rentalAlert === "red"
                ? "bg-red-500 text-white border-red-700 animate-pulse"
                : rentalAlert === "yellow"
                ? "bg-yellow-300 text-black border-yellow-500"
                : "bg-green-500 text-white border-green-700"            }
          `}
          
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
            {isUnderMaintenance && (
              <div
                className="
                  mt-1
                  px-1
                  rounded
                  bg-red-600
                  text-white
                  text-[10px]
                  font-bold
                "
              >
                保守中
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
            {isUnderMaintenance && (
              <div
                className="
                  mt-1
                  px-1
                  rounded
                  bg-red-600
                  text-white
                  text-[10px]
                  font-bold
                "
              >
                保守中
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
            {isUnderMaintenance && (
              <div
                className="
                  mt-1
                  px-1
                  rounded
                  bg-red-600
                  text-white
                  text-[10px]
                  font-bold
                "
              >
                保守中
              </div>
            )}
          </>
        )}

        {/* ===== MID ===== */}
        {displayLevel === "mid" && (
          <div className="font-bold truncate w-full">
            {modelName}
          </div>
        )}

        {/* ===== SMALL ===== */}
        {displayLevel === "small" && (
          <div className="truncate w-full">
            {modelName}
          </div>
        )}

        {/* ===== MINI ===== */}
        {displayLevel === "mini" && null}

      </div>
    </div>
  )
}