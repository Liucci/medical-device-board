"use client"

import { useState } from "react"
import StockGrid from "./StockGrid"
import Stock from "./Stock"
import { Device } from "../types/deviceTypes"
import { StockAreaType } from "../types/stockTypes"
import { DeviceTypeType } from "../types/deviceTypeTypes"
import { DeviceModelType } from "../types/deviceModelTypes"
import {TodayInspectionFrontType}from"../types/inspectionTypes/inspectionTypes"
import { formatDateTime } from "../utils/dateTime/dateUtils"
import { StockLastUpdatedResponse } from "../types/deviceTypes"

import { QuickScrollBar } from "./common/QuickScrollBar"


// page.tsxより
type Props = {  
  deviceList: Device[]
  stockAreas: StockAreaType[]
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
  managementNumber: string | undefined
  serialNumber: string | undefined
  startDrag: (target: HTMLElement, clientX: number, clientY: number, device: Device) => void
  handleMouseMove: (e: React.PointerEvent) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
  pendingDevice: Device | null
  onDrop: (device: Device, stockAreaId: number) => void
  openStockInfoModal: (device: Device) => void
  getMAlert: (deviceId?: number) => "red" | "yellow" | "green" | null
  stockCellSize: number
  setStockCellSize: React.Dispatch<React.SetStateAction<number>>
  currentUser: any
  scrollRef: React.RefObject<HTMLDivElement | null>
  isDragging: boolean
  stockLastUpdated: StockLastUpdatedResponse
   inspectionCounts?: Record<number, number>
  todayInspections?: TodayInspectionFrontType[]
}

export default function StockAreas({
  deviceList,
  stockAreas,
  deviceTypes,
  deviceModels,
  managementNumber,
  serialNumber,
  startDrag,
  handleMouseMove,
  deleteDevice,
  draggingDevice,
  pendingDevice,
  onDrop,
  openStockInfoModal,
  getMAlert,
  stockCellSize,
  setStockCellSize,
  currentUser,
  scrollRef,
  isDragging,
  stockLastUpdated,
  inspectionCounts= {},
  todayInspections = []
}: Props) {
  // スマホ画面用：最終更新日とズームコントロールの折りたたみ状態
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false)

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#091b22] p-2 sm:px-3 sm:py-2 select-none">
      {/* ─── エリアヘッダー ＆ ツールバー（ペトロールティール調・スマホ時は極小▼展開式・PC時極小スリム） ─── */}
      <div className="flex-shrink-0 border-b border-teal-900/80 pb-1.5 mb-1.5 sm:pb-1.5 sm:mb-2 transition-all">
        {/* 1行目：タイトル ＋ スマホ用▼展開ボタン ＋ PC用更新日時・ズーム */}
        <div className="flex items-center justify-between gap-2">
          {/* 左側：タイトル ＆ スマホ用▼ボタン ＆ PC用更新日時 */}
          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
            <h2 className="text-sm font-bold text-teal-100 tracking-tight whitespace-nowrap">
              ストックエリア一覧
            </h2>

            {/* スマホ用：▼/▲ トグルボタン */}
            <button
              type="button"
              onClick={() => setIsHeaderExpanded((prev) => !prev)}
              className="sm:hidden flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#102832] hover:bg-[#173a49] active:bg-[#0c222b] text-teal-200 text-xs border border-teal-800/80 transition-colors cursor-pointer"
              aria-label={isHeaderExpanded ? "更新日・ズームバーを閉じる" : "更新日・ズームバーを表示"}
              title={isHeaderExpanded ? "閉じる" : "最終更新・ズームを表示"}
            >
              <span className="text-[11px] font-mono leading-none">{isHeaderExpanded ? "▲" : "▼"}</span>
              <span className="text-[10px] text-teal-400">{isHeaderExpanded ? "閉じる" : "詳細"}</span>
            </button>

            {/* PC表示（sm以上）：最終更新日時（高さを抑えたコンパクト文字） */}
            <span className="hidden sm:inline font-mono text-[11px] text-teal-400/80 whitespace-nowrap ml-2">
              最終更新：{stockLastUpdated.updatedAt
                ? formatDateTime(stockLastUpdated.updatedAt)
                : "-"}
            </span>
          </div>

          {/* PC表示（sm以上）：ズームコントロールバー（極小・省スペース設計） */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#102832] px-1.5 py-0.5 rounded-lg border border-teal-800/80 shadow-xs">
            <span className="font-mono text-[11px] font-bold text-teal-200 bg-[#091b22] border border-teal-850 px-1.5 py-0.5 rounded min-w-[38px] text-center leading-none">
              {Math.round((stockCellSize / 80) * 100)}%
            </span>

            <button
              type="button"
              onClick={() => setStockCellSize((s) => Math.max(24, s - 4))}
              className="h-5 w-5 rounded-md border border-teal-700/70 bg-[#173a49] hover:bg-[#1f4b5f] active:bg-[#0c222b] text-teal-200 flex items-center justify-center font-bold text-[11px] transition-all cursor-pointer leading-none"
              title="縮小"
            >
              −
            </button>

            <button
              type="button"
              onClick={() => setStockCellSize((s) => Math.min(120, s + 4))}
              className="h-5 w-5 rounded-md border border-teal-700/70 bg-[#173a49] hover:bg-[#1f4b5f] active:bg-[#0c222b] text-teal-200 flex items-center justify-center font-bold text-[11px] transition-all cursor-pointer leading-none"
              title="拡大"
            >
              ＋
            </button>

            <input
              type="range"
              min={24}
              max={120}
              step={4}
              value={stockCellSize}
              onChange={(e) => setStockCellSize(Number(e.target.value))}
              className="w-16 sm:w-24 h-1 bg-teal-950 rounded-md appearance-none cursor-pointer accent-teal-400"
              title="セルサイズ調整"
            />
          </div>
        </div>

        {/* スマホ表示時（sm未満）かつ ▼ボタン展開時：最終更新日・ズームコントロールを表示 */}
        {isHeaderExpanded && (
          <div className="sm:hidden mt-2 pt-2 border-t border-teal-900/60 flex flex-col gap-2 bg-[#0c252e] p-2.5 rounded-lg border border-teal-800/60 shadow-inner">
            <div className="flex items-center justify-between text-xs text-teal-200">
              <span className="text-[11px] text-teal-400">最終更新</span>
              <span className="font-mono text-xs text-teal-300">
                {stockLastUpdated.updatedAt
                  ? formatDateTime(stockLastUpdated.updatedAt)
                  : "-"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 bg-[#091b22] px-2 py-1.5 rounded-lg border border-teal-800">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-teal-200 bg-[#102832] border border-teal-850 px-1.5 py-0.5 rounded text-center min-w-[42px]">
                  {Math.round((stockCellSize / 80) * 100)}%
                </span>

                <button
                  type="button"
                  onClick={() => setStockCellSize((s) => Math.max(24, s - 4))}
                  className="h-6 w-6 rounded border border-teal-700/70 bg-[#173a49] active:bg-[#0c222b] text-teal-200 flex items-center justify-center font-bold text-xs"
                  title="縮小"
                >
                  −
                </button>

                <button
                  type="button"
                  onClick={() => setStockCellSize((s) => Math.min(120, s + 4))}
                  className="h-6 w-6 rounded border border-teal-700/70 bg-[#173a49] active:bg-[#0c222b] text-teal-200 flex items-center justify-center font-bold text-xs"
                  title="拡大"
                >
                  ＋
                </button>
              </div>

              <input
                type="range"
                min={24}
                max={120}
                step={4}
                value={stockCellSize}
                onChange={(e) => setStockCellSize(Number(e.target.value))}
                className="flex-1 max-w-[140px] h-2 bg-teal-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
                title="セルサイズ調整"
              />
            </div>
          </div>
        )}
      </div>

{/* ─── スクロール可能メインエリア ─── */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {/* スクロール本体：標準バー非表示クラスを追加して二重表示を防止 */}
        <div
          ref={scrollRef}
          className="h-full w-full overflow-auto rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="flex flex-row flex-wrap items-start gap-4 p-1 pb-6 pr-7">
            {[...stockAreas]
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((area) => (
                <div
                  key={area.id}
                  data-stock-area-id={area.id}
                  style={{
                    gridColumn: area.id === 1 ? "span 3" : undefined,
                  }}
                >
                  <StockGrid
                    title={area.name}
                    cellSize={stockCellSize}
                  >
                    <Stock
                      deviceList={deviceList}
                      stockAreaId={area.id}
                      deviceTypes={deviceTypes}
                      deviceModels={deviceModels}
                      startDrag={startDrag}
                      handleMouseMove={handleMouseMove}
                      deleteDevice={deleteDevice}
                      draggingDevice={draggingDevice}
                      pendingDevice={pendingDevice}
                      openStockInfoModal={openStockInfoModal}
                      getMAlert={getMAlert}
                      cellSize={stockCellSize}
                      managementNumber={managementNumber}
                      serialNumber={serialNumber}
                      currentUser={currentUser}
                      isDragging={isDragging}
                      inspectionCounts={inspectionCounts}  
                      todayInspections={todayInspections}
                    />
                  </StockGrid>
                </div>
              ))}
          </div>
        </div>

        {/* ★ 追加：ストックエリア用クイックスクロールレール（ペトロールティール調：teal） */}
        <QuickScrollBar targetRef={scrollRef} colorScheme="teal" mobileOnly={false} />
      </div>
    </div>
  )
}