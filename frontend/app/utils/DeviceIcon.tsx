// DeviceIcon.tsx
// 機器アイコン表示コンポーネント
import { useState } from "react"
import { createPortal } from "react-dom"
import { TodayInspectionFrontType } from "../types/inspectionTypes/inspectionTypes"

type Props = {
  deviceId: number
  typeName: string
  modelName: string
  assetType: string
  iconColor: string
  managementNumber?: string
  serialNumber?: string

  rentalEndDate?: string

  mAlert?: "red" | "yellow" | "green"| null

  cellSize: number
  isUnderMaintenance?: boolean
  standby?: boolean
  standbyStartedAt?: string
  createAt?: string
  inspectionCount?: number
  todayInspections?: TodayInspectionFrontType[]
}

export default function DeviceIcon({
  deviceId,
  typeName,
  modelName,
  assetType,
  iconColor,
  managementNumber,
  serialNumber,
  rentalEndDate,
  mAlert,
  cellSize,
  isUnderMaintenance,
  standby,
  standbyStartedAt,
  createAt,
  inspectionCount = 0,
  todayInspections,
}: Props) {
  // ===== 点検日時ツールチップ =====
  // z-indexでは解決できない親要素のstacking contextを避けるため、
  // ツールチップはdocument.bodyへPortal表示する。
  const [inspectionTooltip, setInspectionTooltip] = useState<{
    top: number
    left: number
  } | null>(null)

  const showInspectionTooltip = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect()

    setInspectionTooltip({
      top: rect.bottom + 4,
      left: rect.right,
    })
  }

  const hideInspectionTooltip = () => {
    setInspectionTooltip(null)
  }

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
  const isStandbyOverOneMonth = (() => {
    if (!standby || !standbyStartedAt) return false

    const start = new Date(standbyStartedAt)
    const limit = new Date(start)
    limit.setMonth(limit.getMonth() + 1)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    limit.setHours(0, 0, 0, 0)

    return today >= limit
  })()

    // ===== 光る =====
  const isGlow =
  mAlert === "red" ||
  rentalAlert === "red" ||
  isStandbyOverOneMonth

  //新規登録から30秒以内はisNewがture
  const isNew =
    createAt
      ? Date.now() - new Date(createAt+"Z").getTime() < 30 * 1000
      : false
 
  return (
    <div
      className={`
        relative
        device-icon
        ${isGlow ? "new-glow" : ""}
        ${isNew ?  "blink": ""}
      `}
    >

      {showIndicator && standby && (
        <div
          className={`
            absolute
            z-40
            inline-flex
            items-center
            justify-center
            rounded
            px-1
            font-bold
            text-center
            whitespace-nowrap
            shadow-sm

            ${
              isStandbyOverOneMonth
                ? "bg-red-600 text-white animate-pulse"
                : "bg-yellow-300 text-black"
            }
          `}
          style={{
            left: "50%",
            bottom: 4,
            transform: "translateX(-50%)",
            minWidth: cellSize >= 88 ? 36 : 30,
            height: cellSize >= 88 ? 16 : 14,
            fontSize: cellSize >= 88 ? 10 : 8,
            lineHeight: 1
          }}
        >
          待機中
        </div>
      )}

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

      {/* ===== 点検実施インジケータ ===== */}
      {showIndicator && inspectionCount > 0 && (
        <div
          className="absolute top-0.5 right-1 z-30"
          onMouseEnter={showInspectionTooltip}
          onMouseLeave={hideInspectionTooltip}
        >
          {/* インジケータ */}
          <div
            className="
              rounded-full
              bg-white
              text-black
              font-bold
              flex
              items-center
              justify-center
              shadow-sm
              border
            "
            style={{
              width: cellSize >= 88 ? 18 : 14,
              height: cellSize >= 88 ? 18 : 14,
              fontSize: cellSize >= 88 ? 10 : 10,
              lineHeight: 2,
            }}
          >
            {inspectionCount}
          </div>
        </div>
      )}

      {/* ===== 点検日時ツールチップ ===== */}
      {inspectionTooltip &&
        createPortal(
          <div
            className="
              fixed
              z-[999999]
              -translate-x-full
              bg-black
              text-white
              text-xs
              rounded-md
              px-3
              py-2
              whitespace-nowrap
              shadow-lg
              pointer-events-none
            "
            style={{
              top: inspectionTooltip.top,
              left: inspectionTooltip.left,
            }}
          >
            <div className="font-semibold mb-1">
              本日の点検
            </div>

            {todayInspections
              ?.filter(
                inspection => inspection.deviceId === deviceId
              )
              .map((inspection, index) => (
                <div key={index}>
                  {new Date(inspection.createdAt).toLocaleTimeString(
                    "ja-JP",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </div>
              ))}
          </div>,
          document.body
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
        className="
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
          pt-1
          text-center
        "

          style={{
          width: cellSize,
          height: cellSize * 0.8,

          fontSize: `${fontSize}px`,
          lineHeight,

          userSelect: "none",
          backgroundColor: iconColor
        }}
      >

        {/* ===== MAX ===== */}
        {displayLevel === "max" && (
          <>
            <div className="font-bold truncate w-full">
              {typeName}
            </div>

            <div 
              className="w-full break-words text-center"
              style={{
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                lineHeight: 1.0
              }}
            >
              {modelName}
            </div>

            {managementNumber && (
              <div 
                className="w-full break-words text-center"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  lineHeight: 1.0
                }}
              >
                {managementNumber}
              </div>
            )}

            {serialNumber && (
              <div 
                className="w-full break-words text-center"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  lineHeight: 1.0
                }}
              >
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
                  animate-pulse
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

            <div 
              className="w-full break-words text-center"
              style={{
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                lineHeight: 1.0
              }}
            >
              {modelName}
            </div>

            {managementNumber && (
              <div 
                className="w-full break-words text-center"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  lineHeight: 1.0
                }}
              >
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
                  animate-pulse
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

            <div
              className="w-full break-words text-center"
              style={{
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                lineHeight: 1.0
              }}
            >
              {modelName}
            </div>
            {isUnderMaintenance && (
              <div
                className="
                  mt-1
                  px-1
                  rounded
                  bg-red-600
                  animate-pulse
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
          <div 
            className="w-full break-words text-center"
            style={{
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              lineHeight: 1.0
            }}
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
