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
    style={{ fontFamily: "BIZ UDGothic" }}
  >
        {/* ===== ★ アイコンの角丸にピッタリ添う 控えめな赤色発光フレーム ===== */}
    {isGlow && (
      <div
        className="
          absolute
          -inset-[1.5px]
          rounded-[13.5px]
          border-[1.5px]
          border-red-500/60
          pointer-events-none
          animate-pulse
          z-20
        "
        style={{
          /* 眩しすぎない、控えめで品のある赤色アンビエント光 */
          boxShadow: "0 0 12px 2px rgba(239, 68, 68, 0.75), 0 0 20px 4px rgba(239, 68, 68, 0.35)",        }}
      />
    )}

    
    {/* ===== セラミック・マットリュクス 本体 ===== */}
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
      "
      style={{
        width: cellSize,
        height: Math.round(cellSize * 0.85),
        backgroundColor: iconColor,
        /* マットセラミック風のソフトディープシャドウ */
        boxShadow: `
          inset 0 1px 1px rgba(255,255,255,0.4),
          inset 0 -2px 3px rgba(0,0,0,0.4),
          0 6px 14px -2px rgba(0,0,0,0.38),
          0 2px 4px -1px rgba(0,0,0,0.25)
        `,
        border: "1px solid rgba(255,255,255,0.22)",
      }}
    >
      {/* ===== サテンセラミック 微光グラデーション ===== */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.06) 40%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      {/* ===== コンテンツ ===== */}
      <div className="relative z-10 flex flex-col justify-between h-full p-1.5 overflow-hidden">

        {/* ===== 上段：機種名・ステータス ===== */}
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
                  color: "#FDFBF7",
                  textShadow: "0 1px 1.5px rgba(0,0,0,0.7), 0 -0.5px 0.5px rgba(255,255,255,0.15)",
                }}
              >
                {typeName}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* レンタルバッジ（マットインセット） */}
            {showIndicator && assetType === "レンタル" && (
              <div
                className={`
                  font-extrabold
                  rounded-md
                  flex
                  items-center
                  justify-center
                  ${
                    rentalAlert === "red"
                      ? "bg-red-600 text-white border border-red-300/80 animate-pulse"
                      : rentalAlert === "yellow"
                      ? "bg-amber-300 text-stone-900 border border-amber-200"
                      : "bg-emerald-600 text-white border border-emerald-300/80"
                  }
                `}
                style={{
                  width: assetMarkSize,
                  height: assetMarkSize,
                  fontSize: assetFontSize,
                  lineHeight: 1,
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.3)",
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
                  font-extrabold
                  rounded-md
                  flex
                  items-center
                  justify-center
                  ${
                    rentalAlert === "red"
                      ? "bg-red-600 text-white border border-red-300/80 animate-pulse"
                      : rentalAlert === "yellow"
                      ? "bg-amber-300 text-stone-900 border border-amber-200"
                      : "bg-emerald-600 text-white border border-emerald-300/80"
                  }
                `}
                style={{
                  width: assetMarkSize,
                  height: assetMarkSize,
                  fontSize: assetFontSize,
                  lineHeight: 1,
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.3)",
                }}
                title={`資産区分: ${assetType}`}
              >
                代
              </div>
            )}
            {/* メンテインジケータ */}
            {showIndicator && mAlert && (
              <div
                className="relative flex items-center justify-center shrink-0"
                style={{
                  width: cellSize >= 88 ? 10 : 8,
                  height: cellSize >= 88 ? 10 : 8,
                }}
              >
                {mAlert === "red" ? (
                  <>
                    {/* ★ スマホ画面（sm未満）：GPU負荷ゼロ・静止したシンプルな赤丸 */}
                    <div
                      className="block sm:hidden rounded-full bg-rose-600 shrink-0"
                      style={{
                        width: cellSize >= 88 ? 10 : 8,
                        height: cellSize >= 88 ? 10 : 8,
                        border: "1.2px solid #ffffff",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    />

                    {/* ★ PC画面（sm以上）：放射状ソナー波紋 ＋ 高輝度鼓動コア */}
                    <div className="hidden sm:flex relative items-center justify-center">
                      <style>{`
                        @keyframes devixSonarSpread {
                          0% {
                            transform: scale(0.6);
                            opacity: 1;
                            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.9);
                          }
                          50% {
                            opacity: 0.8;
                          }
                          100% {
                            transform: scale(3.5);
                            opacity: 0;
                            box-shadow: 0 0 16px 6px rgba(239, 68, 68, 0);
                          }
                        }
                        @keyframes devixCoreBeacon {
                          0%, 100% {
                            transform: scale(0.9);
                            box-shadow: 0 0 6px 1px #ef4444, inset 0 1px 1px #ffffff;
                          }
                          20% {
                            transform: scale(1.25);
                            box-shadow: 0 0 16px 4px #ff0000, 0 0 24px 8px rgba(239, 68, 68, 0.7), inset 0 1px 2px #ffffff;
                          }
                        }
                      `}</style>

                      {/* 放射波紋 1波目：中心から外側へ3.5倍の大きさまで光を拡散 */}
                      <span
                        className="absolute rounded-full border border-red-500 bg-red-500/20 pointer-events-none"
                        style={{
                          width: cellSize >= 88 ? 10 : 8,
                          height: cellSize >= 88 ? 10 : 8,
                          animation: "devixSonarSpread 1.6s cubic-bezier(0, 0.6, 0.35, 1) infinite",
                        }}
                      />

                      {/* 放射波紋 2波目：0.55秒遅れで追従する第2の光の輪 */}
                      <span
                        className="absolute rounded-full border border-rose-400 bg-rose-500/15 pointer-events-none"
                        style={{
                          width: cellSize >= 88 ? 10 : 8,
                          height: cellSize >= 88 ? 10 : 8,
                          animation: "devixSonarSpread 1.6s cubic-bezier(0, 0.6, 0.35, 1) 0.55s infinite",
                        }}
                      />

                      {/* 中心コア：波紋を放つ瞬間に強く白熱発光するLEDビーコン */}
                      <div
                        className="relative rounded-full bg-gradient-to-br from-white via-red-500 to-rose-700 shrink-0"
                        style={{
                          width: cellSize >= 88 ? 10 : 8,
                          height: cellSize >= 88 ? 10 : 8,
                          border: "1.5px solid #ffffff",
                          animation: "devixCoreBeacon 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                        }}
                      />
                    </div>
                  </>
                ) : (
                  /* 黄・緑の時：通常インジケータ */
                  <div
                    className={`rounded-full shrink-0 ${mAlert === "yellow" ? "bg-amber-300 shadow-[0_0_6px_#fcd34d]" : "bg-emerald-400 shadow-[0_0_6px_#34d399]"}`}
                    style={{
                      width: cellSize >= 88 ? 10 : 8,
                      height: cellSize >= 88 ? 10 : 8,
                      border: "1.2px solid rgba(255,255,255,0.75)",
                      boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.4)",
                    }}
                  />
                )}
              </div>
            )}

            {/* 点検回数バッジ */}
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
                    bg-stone-50
                    text-stone-900
                    font-extrabold
                    border border-stone-200
                  "
                  style={{
                    width: cellSize >= 88 ? 20 : 16,
                    height: cellSize >= 88 ? 20 : 16,
                    fontSize: cellSize >= 88 ? 9 : 8,
                    lineHeight: 1,
                    boxShadow: "0 1.5px 3px rgba(0,0,0,0.3)",
                  }}
                >
                  {inspectionCount}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== 中央：型式（デボス調アイボリー） ===== */}
        <div
          className={`
            font-bold
            tracking-tight
            truncate
            leading-none
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
            fontFamily: "'Outfit', sans-serif",
            color: "#FDFBF7",
            textShadow: "0 1.5px 2px rgba(0,0,0,0.8), 0 -0.5px 0.5px rgba(255,255,255,0.2)",
          }}
        >
          {modelName}
        </div>
        {/* 管理番号 */}
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
                color: "#FDFBF7",
                textShadow: "0 1.5px 2px rgba(0,0,0,0.8), 0 -0.5px 0.5px rgba(255,255,255,0.2)",
                lineHeight: 1.1,
                maxWidth: "96%",
              }}
            >
              <span className="text-[7.5px] font-sans font-bold text-white mr-0.5">No.</span>
              <span>{managementNumber}</span>
            </div>
          )}

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
                bg-red-600
                text-stone-50
                text-[8px]
                font-bold
                rounded-md
                py-0.5
                leading-none
                border border-red-400/80
              "
              style={{
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.35), 0 1.5px 3px rgba(0,0,0,0.3)",
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
                text-[8px]
                font-bold
                rounded-md
                py-0.5
                leading-none
                border
                ${
                  isStandbyOverOneMonth
                    ? "bg-red-600 text-white border-red-300 animate-pulse"
                    : "bg-amber-300 text-stone-900 border-amber-200"
                }
              `}
              style={{
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 1.5px 3px rgba(0,0,0,0.3)",
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
                text-[7px]
                font-mono
                text-stone-200/90
                px-0.5
              "
            >
              <span className="text-stone-300/70">SN</span>
              <span className="truncate ml-1 font-medium">{serialNumber}</span>
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
              bg-stone-900/95
              backdrop-blur-md
              text-stone-100
              text-xs
              rounded-xl
              px-3.5
              py-2.5
              whitespace-nowrap
              shadow-2xl
              border border-stone-700
              pointer-events-none
            "
            style={{
              top: inspectionTooltip.top,
              left: inspectionTooltip.left,
            }}
          >
            <div className="font-semibold text-stone-200 border-b border-stone-700 pb-1 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>本日の点検記録</span>
            </div>
            {todayInspections
              ?.filter(inspection => inspection.deviceId === deviceId)
              .map((inspection, index) => (
                <div key={index} className="text-stone-300 py-0.5 font-mono text-[11px]">
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
