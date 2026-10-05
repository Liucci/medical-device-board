"use client"
import { useState } from "react"
import styles from "../page.module.css"
import WardGrid from "./WardGrid"
import { Device } from "../types/deviceTypes"
import { DeviceTypeType } from "../types/deviceTypeTypes"
import { DeviceModelType } from "../types/deviceModelTypes"
import { WardType } from "../types/wardTypes"
import { CurrentUser } from "../types/userTypes"
import { RoomType } from "../types/roomTypes"
import { WardLastUpdatedResponse } from "../types/deviceTypes"
import { InfectionTypeType } from "../types/infectionTypeTypes"
import { RoomInfectionType } from "../types/roomInfectionTypes"
import { WardInfectionType } from "../types/wardInfectionTypes"
import { HospitalSettingsType } from "../types/hospitalSettingTypes"
import { TodayInspectionFrontType } from "../types/inspectionTypes/inspectionTypes"
import RoomContainer from "./RoomContainer"
import { formatDateTime } from "../utils/dateTime/dateUtils"
import { ActiveAnnouncementFrontType } from "../types/announcementTypes"
import { QuickScrollBar } from "./common/QuickScrollBar"
import LowStockPanel from "../components/LowStockPanel"

type Props = {
  deviceList: Device[]
  lowStockDevices: any[]
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
  wards: WardType[]
  managementNumber?: string
  serialNumber?: string
  startDrag: (target: HTMLElement, clientX: number, clientY: number, device: Device) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
  pendingDevice: Device | null
  onDrop: (device: Device, id: number) => void
  rooms: RoomType[]
  openRoomDeviceInfoModal: (device: Device) => void
  openWardInfoModal: (ward: WardType) => void
  getMAlert: (deviceId?: number) => "red" | "yellow" | "green" | null
  wardCellSize: number
  inspectionCounts: Record<number, number>
  todayInspections?: TodayInspectionFrontType[]
  setWardCellSize: React.Dispatch<React.SetStateAction<number>>
  currentUser: CurrentUser 
  scrollRef: React.RefObject<HTMLDivElement | null>
  isDragging: boolean
  wardLastUpdated: WardLastUpdatedResponse
  infectionTypes: InfectionTypeType[]
  roomInfections: RoomInfectionType[]
  wardInfections: WardInfectionType[]
  activeAnnouncements: ActiveAnnouncementFrontType[]
  hospitalSettings: HospitalSettingsType | null
}

export default function WardArea({
  deviceList,
  lowStockDevices,
  deviceTypes,
  deviceModels,
  wards,
  startDrag,
  deleteDevice,
  draggingDevice,
  pendingDevice,
  onDrop,
  rooms,
  openRoomDeviceInfoModal,
  openWardInfoModal,
  getMAlert,
  wardCellSize,
  managementNumber,
  serialNumber,
  setWardCellSize,
  inspectionCounts,
  todayInspections,
  currentUser,
  scrollRef,
  isDragging,
  wardLastUpdated,
  infectionTypes,
  roomInfections,
  wardInfections,
  activeAnnouncements,
  hospitalSettings
}: Props) {
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false)
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false)

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#0f172a] p-2 sm:px-3 sm:py-2 select-none">
      {/* ─── 1. エリアヘッダー ＆ ツールバー ─── */}
      <div className="flex-shrink-0 border-b border-slate-800 pb-1.5 mb-1.5 sm:pb-1.5 sm:mb-2 transition-all">
        {/* 1行目：タイトル ＋ スマホ用アナウンスボタン ＋ スマホ用▼詳細ボタン ＋ PC用更新日時・お知らせ ＋ 機器残数 ＋ ズーム */}
        <div className="flex items-center justify-between gap-2">
          {/* 左側：タイトル ＆ スマホ用ボタン群 ＆ PC用更新日時・お知らせ */}
          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
            <h2 className="text-sm font-bold text-slate-100 tracking-tight whitespace-nowrap">
              病棟一覧
            </h2>
            {/* スマホ用：▼/▲ 詳細トグルボタン */}
            <button
              type="button"
              onClick={() => setIsHeaderExpanded(prev => !prev)}
              className="sm:hidden flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#1e293b] hover:bg-[#283548] text-slate-300 text-xs border border-slate-700 transition-colors cursor-pointer"
              title={isHeaderExpanded ? "閉じる" : "最終更新・ズームを表示"}
            >
              <span className="text-[11px] font-mono leading-none">{isHeaderExpanded ? "▲" : "▼"}</span>
              <span className="text-[10px] text-slate-400">{isHeaderExpanded ? "閉じる" : "詳細"}</span>
            </button>
            {/* スマホ用：極めてシンプルな [アナウンス ▼] ボタン */}
            <button
              type="button"
              onClick={() => setIsAnnouncementOpen(prev => !prev)}
              className="sm:hidden px-2 py-0.5 rounded border border-amber-600/80 bg-amber-950/70 active:bg-amber-900 text-amber-200 text-xs font-medium cursor-pointer"
            >
              アナウンス {isAnnouncementOpen ? "▲" : "▼"}
            </button>


            {/* PC表示：最終更新日時 */}
            <span className="hidden sm:inline font-mono text-[11px] text-slate-400 whitespace-nowrap ml-2">
              最終更新：{wardLastUpdated.updatedAt ? formatDateTime(wardLastUpdated.updatedAt) : "-"}
            </span>

            {/* PC表示：お知らせティッカー（スクロール幅を最大化） */}
 {activeAnnouncements.length > 0 && (
    <div className="hidden sm:block flex-1 ml-2.5 min-w-0 overflow-hidden">
      <div className="px-2.5 py-0.5 rounded-md bg-amber-950/50 border border-amber-700/80 text-amber-200 text-[11px] overflow-hidden">
        <div className={styles.announcementTicker}>
          <span className="font-bold text-amber-300">【お知らせ】📢</span>{" "}
          {activeAnnouncements.map(a => a.message).join("　◆　")}
        </div>
      </div>
    </div>
  )}
</div>

          {/* 右側：機器残数ボタン ＆ PC用ズームコントロール */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 機器残数ドロップダウン */}
            <LowStockPanel
              devices={lowStockDevices}
              deviceModels={deviceModels}
            />

            {/* PC用ズームコントロール */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#1e293b] px-1.5 py-0.5 rounded-lg border border-slate-700/80 shadow-xs">
              <span className="font-mono text-[11px] font-bold text-slate-200 bg-[#0f172a] border border-slate-700 px-1.5 py-0.5 rounded min-w-[38px] text-center leading-none">
                {Math.round((wardCellSize / 80) * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setWardCellSize(s => Math.max(24, s - 4))}
                className="h-5 w-5 rounded-md border border-slate-600/80 bg-[#283548] hover:bg-[#33435c] text-slate-200 flex items-center justify-center font-bold text-[11px] leading-none cursor-pointer"
                title="縮小"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setWardCellSize(s => Math.min(120, s + 4))}
                className="h-5 w-5 rounded-md border border-slate-600/80 bg-[#283548] hover:bg-[#33435c] text-slate-200 flex items-center justify-center font-bold text-[11px] leading-none cursor-pointer"
                title="拡大"
              >
                ＋
              </button>
              <input
                type="range"
                min={24}
                max={120}
                step={4}
                value={wardCellSize}
                onChange={e => setWardCellSize(Number(e.target.value))}
                className="w-16 sm:w-24 h-1 bg-slate-700 rounded-md appearance-none cursor-pointer accent-sky-400"
                title="セルサイズ調整"
              />
            </div>
          </div>
        </div>

        {/* スマホ表示時かつ ▼詳細ボタン展開時 */}
        {isHeaderExpanded && (
          <div className="sm:hidden mt-2 pt-2 border-t border-slate-800/80 flex flex-col gap-2 bg-[#141e33] p-2.5 rounded-lg border border-slate-700/60 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="text-[11px] text-slate-400">最終更新</span>
              <span className="font-mono text-xs text-sky-300">
                {wardLastUpdated.updatedAt ? formatDateTime(wardLastUpdated.updatedAt) : "-"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 bg-[#0f172a] px-2 py-1.5 rounded-lg border border-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-slate-200 bg-[#1e293b] border border-slate-700 px-1.5 py-0.5 rounded text-center min-w-[42px]">
                  {Math.round((wardCellSize / 80) * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setWardCellSize(s => Math.max(24, s - 4))}
                  className="h-6 w-6 rounded border border-slate-600/80 bg-[#283548] text-slate-200 flex items-center justify-center font-bold text-xs"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => setWardCellSize(s => Math.min(120, s + 4))}
                  className="h-6 w-6 rounded border border-slate-600/80 bg-[#283548] text-slate-200 flex items-center justify-center font-bold text-xs"
                >
                  ＋
                </button>
              </div>

              <input
                type="range"
                min={24}
                max={120}
                step={4}
                value={wardCellSize}
                onChange={e => setWardCellSize(Number(e.target.value))}
                className="flex-1 max-w-[140px] h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>
          </div>
        )}


        {/* スマホ表示時：お知らせアコーディオン展開部（案A） */}
        {isAnnouncementOpen && activeAnnouncements.length > 0 && (
          <div className="sm:hidden mt-2 p-2.5 rounded-lg bg-amber-950/90 border border-amber-700/80 text-amber-100 text-xs shadow-lg space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-amber-800/80 pb-1 text-[11px] font-bold text-amber-300">
              <span className="flex items-center gap-1">
                <span>📢</span>
                <span>運営からのお知らせ</span>
                <span className="font-mono text-[10px] text-amber-400">({activeAnnouncements.length}件)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAnnouncementOpen(false)}
                className="text-amber-400 hover:text-amber-200 px-1 py-0.5 rounded text-[11px] leading-none cursor-pointer"
                title="閉じる"
              >
                ✕
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1.5 divide-y divide-amber-900/60">
              {activeAnnouncements.map((a, idx) => (
                <div key={idx} className="pt-1.5 first:pt-0 text-[11px] leading-relaxed text-amber-100">
                  <div className="flex items-start gap-1">
                    <span className="text-amber-400 shrink-0 font-bold">•</span>
                    <span className="break-words flex-1">{a.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ─── 2. スクロール可能メインエリア ─── */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <div
          ref={scrollRef}
          className="h-full w-full overflow-auto rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="flex flex-row flex-wrap items-start gap-4 p-1 pb-6 pr-6 sm:pr-1">
            {[...wards]
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map(ward => (
                <div
                  key={ward.id}
                  data-ward-id={ward.id}
                  style={{ gridColumn: ward.id === 1 ? "span 3" : undefined }}
                >
                  <WardGrid
                    title={ward.name}
                    minWidth={Math.max(90, wardCellSize * 1)}
                    cellSize={wardCellSize}
                    ward={ward}
                    onClick={() => openWardInfoModal(ward)}
                    infectionTypes={infectionTypes}
                    wardInfections={wardInfections}
                  >
                    <div className="flex flex-wrap gap-3">
                      {rooms
                        .filter(r => r.wardId === ward.id)
                        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
                        .map(room => (
                          <RoomContainer
                            key={room.id}
                            deviceList={deviceList}
                            deviceTypes={deviceTypes}
                            deviceModels={deviceModels}
                            rooms={rooms}
                            roomId={room.id}
                            roomName={room.name}
                            patientName={room.patientName}
                            startDrag={startDrag}
                            draggingDevice={draggingDevice}
                            pendingDevice={pendingDevice}
                            deleteDevice={deleteDevice}
                            openRoomDeviceInfoModal={openRoomDeviceInfoModal}
                            getMAlert={getMAlert}
                            cellSize={wardCellSize}
                            inspectionCounts={inspectionCounts}
                            todayInspections={todayInspections}
                            managementNumber={managementNumber}
                            serialNumber={serialNumber}
                            currentUser={currentUser}
                            isDragging={isDragging}
                            roomInfections={roomInfections}
                            infectionTypes={infectionTypes}
                            hospitalSettings={hospitalSettings}
                          />
                        ))}
                    </div>
                  </WardGrid>
                </div>
              ))}
          </div>
        </div>

        <QuickScrollBar targetRef={scrollRef} colorScheme="teal" mobileOnly={false} />
      </div>
    </div>
  )
}