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
      ${isNew ? "blink" : ""}
    `}
  >
    {/* ===== 本体 ===== */}
    <div
      className="
        relative
        overflow-hidden
        select-none
        rounded-xl
        border
        flex
        flex-col
        text-center
        transition-all
        duration-200
      "
      style={{
        width: cellSize,
        height: Math.round(cellSize * 0.85),
        backgroundColor: iconColor,
        boxShadow: `
          inset 0 1.5px 0.5px rgba(255,255,255,0.55),
          inset 1px 0 0.5px rgba(255,255,255,0.35),
          inset 0 -2px 1.5px rgba(0,0,0,0.38),
          inset -1px 0 1px rgba(0,0,0,0.25),
          0 4px 8px -1px rgba(0,0,0,0.28),
          0 2px 4px -2px rgba(0,0,0,0.18)
        `,
        border: "1px solid rgba(255,255,255,0.25)",
      }}
    >
      {/* ===== ガラス光沢 ===== */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.14) 42%, rgba(255,255,255,0) 48%, rgba(0,0,0,0.10) 100%)",
        }}
      />

      {/* ===== 上部エッジ ===== */}
      <div className="absolute inset-x-1.5 top-0.5 h-[1.5px] bg-gradient-to-r from-transparent via-white/75 to-transparent pointer-events-none rounded-full" />

      {/* ===== コンテンツ ===== */}
      <div className="relative z-10 flex flex-col justify-between h-full p-1.5 text-white overflow-hidden">

        {/* ===== 上段：機種名・ステータス ===== */}
        <div className="flex items-center justify-between gap-1 w-full shrink-0">

          <div className="min-w-0 flex-1">
            {(displayLevel === "max" ||
              displayLevel === "large" ||
              displayLevel === "normal") && (
              <div
                className={`
                  font-black
                  tracking-tight
                  text-white
                  truncate
                  leading-tight
                  drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]
                  ${displayLevel === "max" ? "text-[11px]" : ""}
                  ${displayLevel === "large" ? "text-[10px]" : ""}
                  ${displayLevel === "normal" ? "text-[9px]" : ""}
                `}
                title={`機種名: ${typeName}`}
                style={{
                  WebkitTextStroke: "0.25px rgba(0,0,0,0.3)",
                }}
              >
                {typeName}
              </div>
            )}

          </div>

          <div className="flex items-center gap-1 shrink-0">

            {/* ===== レンタル ===== */}
            {showIndicator && assetType === "レンタル" && (
              <div
                className={`
                  font-extrabold
                  rounded-md
                  border
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  ${
                    rentalAlert === "red"
                      ? "bg-red-500 text-white border-red-300 animate-pulse"
                      : rentalAlert === "yellow"
                      ? "bg-amber-300 text-slate-900 border-amber-400"
                      : "bg-emerald-500 text-white border-emerald-300"
                  }
                `}
                style={{
                  width: assetMarkSize,
                  height: assetMarkSize,
                  fontSize: assetFontSize,
                  lineHeight: 1,
                }}
                title={`資産区分: ${assetType}`}
              >
                レ
              </div>
            )}

            {/* ===== 代替機 ===== */}
            {showIndicator && assetType === "代替機" && (
              <div
                className={`
                  font-extrabold
                  rounded-md
                  border
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  ${
                    rentalAlert === "red"
                      ? "bg-red-500 text-white border-red-300 animate-pulse"
                      : rentalAlert === "yellow"
                      ? "bg-amber-300 text-slate-900 border-amber-400"
                      : "bg-emerald-500 text-white border-emerald-300"
                  }
                `}
                style={{
                  width: assetMarkSize,
                  height: assetMarkSize,
                  fontSize: assetFontSize,
                  lineHeight: 1,
                }}
                title={`資産区分: ${assetType}`}
              >
                代
              </div>
            )}

            {/* ===== メンテインジケータ ===== */}
            {showIndicator && mAlert && (
              <div
                className={`
                  rounded-full
                  border
                  border-black/30
                  shrink-0
                  ${
                    mAlert === "red"
                      ? "bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"
                      : mAlert === "yellow"
                      ? "bg-amber-300 shadow-[0_0_6px_#fcd34d]"
                      : "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                  }
                `}
                style={{
                  width: cellSize >= 88 ? 10 : 8,
                  height: cellSize >= 88 ? 10 : 8,
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)",
                }}
              />
            )}

            {/* ===== 点検実施インジケータ ===== */}
            {showIndicator && inspectionCount > 0 && (
              <div
                className="relative"
                onMouseEnter={showInspectionTooltip}
                onMouseLeave={hideInspectionTooltip}
              >
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    rounded-full
                    bg-white/95
                    text-slate-900
                    font-black
                    shadow-sm
                    border
                    border-white/80
                  "
                  style={{
                    width: cellSize >= 88 ? 20 : 16,
                    height: cellSize >= 88 ? 20 : 16,
                    fontSize: cellSize >= 88 ? 9 : 8,
                    lineHeight: 1,
                  }}
                >
                  {inspectionCount}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ===== 中央：型式 ===== */}
        <div className="my-auto text-center w-full px-0.5 py-0.5">

          {(displayLevel === "max" ||
            displayLevel === "large" ||
            displayLevel === "normal") && (
            <div
              className={`
                font-black
                tracking-tight
                text-white
                truncate
                leading-none
                drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]
                ${
                  displayLevel === "max"
                    ? "text-[15px]"
                    : displayLevel === "large"
                    ? "text-[13px]"
                    : "text-[11px]"
                }
              `}
              title={`型式: ${modelName}`}
              style={{
                WebkitTextStroke: "0.35px rgba(0,0,0,0.35)",
              }}
            >
              {modelName}
            </div>
          )}

          {/* ===== 管理番号 ===== */}
          {displayLevel === "max" && managementNumber && (
            <div
              className="
                mt-1
                font-mono
                font-semibold
                text-white/85
                tracking-tight
                truncate
                drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]
              "
              style={{
                fontSize: 9,
              }}
              title={`管理番号: ${managementNumber}`}
            >
              {managementNumber}
            </div>
          )}

          {displayLevel === "large" && managementNumber && (
            <div
              className="
                mt-0.5
                font-mono
                font-semibold
                text-white/80
                tracking-tight
                truncate
                drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]
              "
              style={{
                fontSize: 8,
              }}
              title={`管理番号: ${managementNumber}`}
            >
              {managementNumber}
            </div>
          )}

        </div>

        {/* ===== 下段：状態 ===== */}
        <div className="shrink-0 pt-0.5 w-full">

          {isUnderMaintenance ? (
            <div
              className="
                flex
                items-center
                justify-center
                gap-1
                w-full
                bg-red-600/95
                text-white
                text-[8px]
                font-bold
                rounded-md
                py-0.5
                leading-none
                shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]
                border
                border-red-400
              "
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>保守中</span>
            </div>
          ) : standby ? (
            <div
              className={`
                flex
                items-center
                justify-center
                gap-0.5
                w-full
                text-[8px]
                font-bold
                rounded-md
                py-0.5
                leading-none
                shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]
                border
                ${
                  isStandbyOverOneMonth
                    ? "bg-red-600 text-white border-red-300 animate-pulse"
                    : "bg-amber-300 text-slate-900 border-amber-200"
                }
              `}
            >
              <span>待機中</span>
            </div>
          ) : displayLevel === "max" && serialNumber ? (
            <div
              className="
                flex
                items-center
                justify-between
                text-[7px]
                font-mono
                text-white/75
                px-0.5
              "
            >
              <span>SN</span>
              <span className="truncate ml-1">{serialNumber}</span>
            </div>
          ) : null}

        </div>
      </div>

      {/* ===== 点検日時ツールチップ ===== */}
      {inspectionTooltip &&
        createPortal(
          <div
            className="
              fixed
              z-[999999]
              -translate-x-full
              bg-slate-900/95
              backdrop-blur-md
              text-white
              text-xs
              rounded-lg
              px-3
              py-2
              whitespace-nowrap
              shadow-xl
              border
              border-slate-700
              pointer-events-none
            "
            style={{
              top: inspectionTooltip.top,
              left: inspectionTooltip.left,
            }}
          >
            <div className="font-semibold text-slate-200 border-b border-slate-700 pb-1 mb-1">
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
    </div>
  </div>
)

}
