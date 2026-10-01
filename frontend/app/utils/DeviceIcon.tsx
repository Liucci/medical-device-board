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
      cursor-pointer
      transition-all
      duration-200
      ease-out
      hover:-translate-y-1
      hover:scale-[1.04]
      hover:z-20
      ${isNew ? "blink" : ""}
    `}
  >
    {/* ===== 角丸の形に完全に沿って光る 赤色輪郭ネオンフレーム (感染・警告時) ===== */}
    {isGlow && (
      <div
        className="
          absolute
          -inset-[2.5px]
          rounded-[18px]
          border-2
          border-red-500
          pointer-events-none
          animate-pulse
          z-30
        "
        style={{
          boxShadow: `
            0 0 16px rgba(239, 68, 68, 0.95),
            0 0 32px rgba(239, 68, 68, 0.6),
            inset 0 0 8px rgba(239, 68, 68, 0.5)
          `,
        }}
      />
    )}

    {/* ===== 本体カード ===== */}
    <div
      className="
        relative
        overflow-hidden
        select-none
        rounded-xl
        flex
        flex-col
        text-center
        transition-all
        duration-200
        group
      "
      style={{
        width: cellSize,
        height: Math.round(cellSize * 0.85),
        backgroundColor: iconColor,
        boxShadow: `
          inset 0 1.5px 1px rgba(255,255,255,0.75),
          inset 1px 0 1px rgba(255,255,255,0.4),
          inset 0 -2.5px 2px rgba(0,0,0,0.35),
          0 4px 10px -2px rgba(0,0,0,0.35),
          0 1px 3px -1px rgba(0,0,0,0.2)
        `,
        border: "1px solid rgba(255,255,255,0.38)",
      }}
    >
      {/* ===== 上部エッジ：ブラッシュド光彩（ホバー時に明るく発光） ===== */}
      <div className="absolute inset-x-2 top-0.5 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-full transition-opacity duration-200 group-hover:via-white" />

      {/* ===== ガラス・サテン反射ハイライト ===== */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-200 group-hover:opacity-90"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 35%, transparent 50%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      {/* ===== コンテンツエリア ===== */}
      <div className="relative z-10 flex flex-col justify-between h-full p-1.5 overflow-hidden">

        {/* ===== 上段：機種名 & ステータスバッジ ===== */}
        <div className="flex items-center justify-between gap-1 w-full shrink-0">
          <div className="min-w-0 flex-1">
            {(displayLevel === "max" ||
              displayLevel === "large" ||
              displayLevel === "normal") && (
              <div
                className={`
                  font-bold
                  tracking-tight
                  truncate
                  leading-tight
                  ${displayLevel === "max" ? "text-[11px]" : ""}
                  ${displayLevel === "large" ? "text-[10px]" : ""}
                  ${displayLevel === "normal" ? "text-[9px]" : ""}
                `}
                title={`機種名: ${typeName}`}
                style={{
                  color: "#0f172a",
                  textShadow:
                    "0 1px 0.5px rgba(255,255,255,0.85), 0 -0.5px 0.5px rgba(0,0,0,0.25)",
                }}
              >
                {typeName}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* レンタルバッジ */}
            {showIndicator && assetType === "レンタル" && (
              <div
                className={`
                  font-black
                  rounded-md
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  transition-transform
                  duration-150
                  group-hover:scale-105
                  ${
                    rentalAlert === "red"
                      ? "bg-gradient-to-b from-red-500 to-red-700 text-white border border-red-300 animate-pulse"
                      : rentalAlert === "yellow"
                      ? "bg-gradient-to-b from-amber-200 to-amber-400 text-slate-900 border border-amber-100"
                      : "bg-gradient-to-b from-emerald-500 to-emerald-700 text-white border border-emerald-300"
                  }
                `}
                style={{
                  width: assetMarkSize,
                  height: assetMarkSize,
                  fontSize: assetFontSize,
                  lineHeight: 1,
                  boxShadow:
                    "inset 0 1px 1px rgba(255,255,255,0.7), 0 1.5px 3px rgba(0,0,0,0.3)",
                }}
                title={`資産区分: ${assetType}`}
              >
                レ
              </div>
            )}

            {/* 代替機バッジ */}
            {showIndicator && assetType === "代替機" && (
              <div
                className={`
                  font-black
                  rounded-md
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  transition-transform
                  duration-150
                  group-hover:scale-105
                  ${
                    rentalAlert === "red"
                      ? "bg-gradient-to-b from-red-500 to-red-700 text-white border border-red-300 animate-pulse"
                      : rentalAlert === "yellow"
                      ? "bg-gradient-to-b from-amber-200 to-amber-400 text-slate-900 border border-amber-100"
                      : "bg-gradient-to-b from-emerald-500 to-emerald-700 text-white border border-emerald-300"
                  }
                `}
                style={{
                  width: assetMarkSize,
                  height: assetMarkSize,
                  fontSize: assetFontSize,
                  lineHeight: 1,
                  boxShadow:
                    "inset 0 1px 1px rgba(255,255,255,0.7), 0 1.5px 3px rgba(0,0,0,0.3)",
                }}
                title={`資産区分: ${assetType}`}
              >
                代
              </div>
            )}

            {/* ===== メンテナンス警告インジケータ ===== */}
            {showIndicator && mAlert && (
              <div className="relative flex items-center justify-center shrink-0">
                {mAlert === "red" ? (
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      width: cellSize >= 88 ? 15 : 18,
                      height: cellSize >= 88 ? 15 : 18,
                    }}
                  >
                    <span className="absolute inset-0 rounded-full bg-red-500 opacity-80 animate-ping" />
                    <span className="absolute -inset-0.5 rounded-full bg-red-400/50 animate-pulse" />
                    <span
                      className="relative block rounded-full bg-gradient-to-br from-red-500 to-rose-700 border border-white"
                      style={{
                        width: cellSize >= 88 ? 12 : 12,
                        height: cellSize >= 88 ? 12 : 12,
                        boxShadow: "0 0 10px #ef4444, inset 0 1px 1px #fff",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className={`
                      rounded-full
                      shrink-0
                      ${
                        mAlert === "yellow"
                          ? "bg-amber-300 shadow-[0_0_7px_#fcd34d]"
                          : "bg-emerald-400 shadow-[0_0_7px_#34d399]"
                      }
                    `}
                    style={{
                      width: cellSize >= 88 ? 12 : 12,
                      height: cellSize >= 88 ? 12 : 12,
                      border: "1.2px solid rgba(255,255,255,0.9)",
                      boxShadow:
                        "inset 0 1px 1px rgba(255,255,255,0.95), 0 1.5px 3px rgba(0,0,0,0.35)",
                    }}
                  />
                )}
              </div>
            )}

            {/* 点検回数インジケータ */}
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
                    bg-slate-900
                    text-white
                    font-black
                    border
                    border-white/80
                    shadow-md
                    transition-transform
                    duration-150
                    group-hover:scale-110
                  "
                  style={{
                    width: cellSize >= 88 ? 20 : 16,
                    height: cellSize >= 88 ? 20 : 16,
                    fontSize: cellSize >= 88 ? 9 : 8,
                    lineHeight: 1,
                    boxShadow:
                      "0 2px 5px rgba(0,0,0,0.4), inset 0 1px 0.5px rgba(255,255,255,0.3)",
                  }}
                >
                  {inspectionCount}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== 中央：型式 ＆ 管理番号 ===== */}
        <div className="flex flex-col items-center justify-center my-auto min-w-0 w-full">
          <div
            className={`
              font-black
              tracking-tight
              truncate
              leading-none
              transition-transform
              duration-200
              group-hover:scale-[1.02]
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
              /* ★ ここで Outfit を適用（日本語や他はBIZ UDのまま型式だけが変わります） */
              fontFamily: "'Outfit', sans-serif",
              color: "#0f172a",
              fontWeight: 900,
              WebkitTextStroke: cellSize >= 88 ? "0.65px #0f172a" : "0.5px #0f172a",
              textShadow:"0 0.5px 1px rgba(255,255,255,0.9), 0 -1px 0.5px rgba(0,0,0,0.25)",
              letterSpacing: "-0.01em",
            }}
          >
            {modelName}
          </div>

          {/* ★ 型式の下：管理番号（アイコン拡大時のみ表示） */}
          {(displayLevel === "max" || displayLevel === "large") && managementNumber && (
            <div
              className={`
                font-mono
                font-bold
                tracking-tight
                truncate
                mt-1
                px-1.5
                py-px
                rounded-md
                bg-slate-900/10
                border border-black/10
                shadow-[inset_0_1px_1px_rgba(0,0,0,0.08)]
                ${displayLevel === "max" ? "text-[10px]" : "text-[8.5px]"}
              `}
              title={`管理番号: ${managementNumber}`}
              style={{
                fontFamily: "'Outfit', sans-serif",
                color: "#0f172a",
                textShadow: "0 1px 0.5px rgba(255,255,255,0.85)",
                lineHeight: 1.1,
                maxWidth: "96%",
              }}
            >
              <span className="text-[7.5px] font-sans font-bold text-slate-800/70 mr-0.5">No.</span>
              <span>{managementNumber}</span>
            </div>
          )}
        </div>

        {/* ===== 下段：状態表示 ===== */}
        <div className="shrink-0 pt-0.5 w-full">
          {isUnderMaintenance ? (
            <div
              className="
                flex
                items-center
                justify-center
                gap-1
                w-full
                bg-gradient-to-r from-red-600 to-rose-600
                text-white
                text-[10px]
                font-bold
                rounded-md
                py-0.5
                leading-none
                border border-red-300/60
                shadow-sm
              "
              style={{
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.4), 0 1.5px 3px rgba(0,0,0,0.3)",
              }}
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
                text-[10px]
                font-bold
                rounded-md
                py-0.5
                leading-none
                border
                shadow-sm
                ${
                  isStandbyOverOneMonth
                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-300 animate-pulse"
                    : "bg-gradient-to-b from-amber-200 to-amber-300 text-slate-900 border-amber-100"
                }
              `}
              style={{
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.5), 0 1.5px 3px rgba(0,0,0,0.25)",
              }}
            >
              <span>待機中</span>
            </div>
          ) : displayLevel === "max" && serialNumber ? (
            <div
              className="
                flex
                items-center
                justify-between
                text-[8px]
                font-mono
                font-bold
                text-slate-900/80
                px-0.5
              "
            >
              <span className="text-slate-800/60">SN</span>
              <span className="truncate ml-1">{serialNumber}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* ===== 点検日時ツールチップ (Portal表示) ===== */}
      {inspectionTooltip &&
        createPortal(
          <div
            className="
              fixed
              z-[999999]
              -translate-x-full
              bg-slate-950/95
              backdrop-blur-md
              text-white
              text-xs
              rounded-xl
              px-3.5
              py-2.5
              whitespace-nowrap
              shadow-2xl
              border border-slate-700
              pointer-events-none
            "
            style={{
              top: inspectionTooltip.top,
              left: inspectionTooltip.left,
            }}
          >
            <div className="font-semibold text-slate-200 border-b border-slate-700 pb-1 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>本日の点検記録</span>
            </div>

            {todayInspections
              ?.filter((inspection) => inspection.deviceId === deviceId)
              .map((inspection, index) => (
                <div
                  key={index}
                  className="text-slate-300 py-0.5 font-mono text-[11px]"
                >
                  {new Date(inspection.createdAt).toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              ))}
          </div>,
          document.body
        )}
    </div>
  </div>
);
}
