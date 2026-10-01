"use client"

import StockGrid from "./StockGrid"
import Stock from "./Stock"
import { Device } from "../types/deviceTypes"
import { StockAreaType } from "../types/stockTypes"
import { DeviceTypeType } from "../types/deviceTypeTypes"
import { DeviceModelType } from "../types/deviceModelTypes"
import { formatDateTime } from "../utils/dateTime/dateUtils"
import { StockLastUpdatedResponse} from "../types/deviceTypes"
//page.tsxより
type Props = {  
  deviceList: Device[]
  stockAreas: StockAreaType[]
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
  managementNumber: string | undefined
  serialNumber: string | undefined
  startDrag: (target: HTMLElement,clientX: number,  clientY: number,device: Device) => void
  handleMouseMove: (e: React.PointerEvent) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
  pendingDevice: Device | null
  onDrop:(device: Device, stockAreaId: number) => void
  openStockInfoModal: (device: Device) => void
  getMAlert: (deviceId?: number) => "red" | "yellow" | "green"| null
  stockCellSize: number
  setStockCellSize: React.Dispatch<React.SetStateAction<number>>
  currentUser: any
  scrollRef: React.RefObject<HTMLDivElement | null>
  isDragging: boolean
  stockLastUpdated: StockLastUpdatedResponse


}

export default function StockAreas({ deviceList,
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
                                    stockLastUpdated
                                    }: Props) {

return (
    <div className="h-full flex flex-col overflow-hidden bg-[#091b22] p-3 sm:p-4 select-none">
      {/* ─── エリアヘッダー ＆ ツールバー（ペトロールティール調） ─── */}
      <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-teal-900/80">
        
        {/* 左側：タイトル ＆ 最終更新日時 */}
        <div className="flex items-center">
          <h2 className="text-sm font-bold text-teal-100 tracking-tight whitespace-nowrap">
            ストックエリア一覧
          </h2>

          <span className="ml-3 font-mono text-xs text-teal-400/80 whitespace-nowrap">
            最終更新：{stockLastUpdated.updatedAt
              ? formatDateTime(stockLastUpdated.updatedAt)
              : "-"}
          </span>
        </div>

        {/* 右側：ズームコントロールバー（WardAreaと統一された操作感） */}
        <div className="flex items-center gap-2 bg-[#102832] px-2.5 py-1 rounded-xl border border-teal-800/80 shadow-md">
          <span className="font-mono text-xs font-bold text-teal-200 bg-[#091b22] border border-teal-850 px-2 py-0.5 rounded-md min-w-[46px] text-center">
            {Math.round((stockCellSize / 80) * 100)}%
          </span>

          <button
            type="button"
            onClick={() => setStockCellSize((s) => Math.max(24, s - 4))}
            className="h-7 w-7 rounded-lg border border-teal-700/70 bg-[#173a49] hover:bg-[#1f4b5f] active:bg-[#0c222b] text-teal-200 flex items-center justify-center font-bold text-xs transition-all cursor-pointer"
            title="縮小"
          >
            −
          </button>

          <button
            type="button"
            onClick={() => setStockCellSize((s) => Math.min(120, s + 4))}
            className="h-7 w-7 rounded-lg border border-teal-700/70 bg-[#173a49] hover:bg-[#1f4b5f] active:bg-[#0c222b] text-teal-200 flex items-center justify-center font-bold text-xs transition-all cursor-pointer"
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
            className="w-28 sm:w-36 h-1.5 bg-teal-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
            title="セルサイズ調整"
          />
        </div>
      </div>

      {/* ─── スクロール可能メインエリア ─── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto rounded-xl"
      >
        <div className="flex flex-row flex-wrap items-start gap-4 p-1 pb-6">
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
                {/* ストックグリッドコンテナ */}
                <StockGrid
                  title={area.name}
                  cellSize={stockCellSize}
                >
                  {/* 機器アイコン描画コンポーネント */}
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
                  />
                </StockGrid>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}