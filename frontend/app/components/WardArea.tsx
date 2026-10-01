import styles from "../page.module.css"
import WardGrid from "./WardGrid"
import { Device } from "../types/deviceTypes"
import { StockAreaType } from "../types/stockTypes"
import { DeviceTypeType } from "../types/deviceTypeTypes"
import { DeviceModelType } from "../types/deviceModelTypes"
import { WardType } from "../types/wardTypes"
import {CurrentUser  } from "../types/userTypes"
import { RoomType } from "../types/roomTypes"
import { WardLastUpdatedResponse} from "../types/deviceTypes"
import { InfectionTypeType } from "../types/infectionTypeTypes"
import { RoomInfectionType } from "../types/roomInfectionTypes"
import { WardInfectionType } from "../types/wardInfectionTypes"
import { HospitalSettingsType } from "../types/hospitalSettingTypes"
import { TodayInspectionFrontType } from "../types/inspectionTypes/inspectionTypes" 

import RoomContainer from "./RoomContainer"
import { formatDateTime } from "../utils/dateTime/dateUtils"

import { ActiveAnnouncementFrontType } from "../types/announcementTypes"

//page.tsxより
type Props = {
  deviceList:  Device[]
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
  wards:WardType[]
  managementNumber?: string
  serialNumber?: string
  startDrag: (target: HTMLElement,clientX: number,  clientY: number,device: Device) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
  pendingDevice: Device | null
  onDrop: (device: Device, id: number) => void
  rooms: RoomType[]
  openRoomDeviceInfoModal: (device: Device) => void
  openWardInfoModal:(ward:WardType)=>void
  getMAlert: (deviceId?: number) => "red" | "yellow" | "green"| null
  wardCellSize: number
  inspectionCounts: Record<number, number>
  todayInspections?: TodayInspectionFrontType[]
  setWardCellSize: React.Dispatch<React.SetStateAction<number>>
  currentUser:CurrentUser 
  scrollRef: React.RefObject<HTMLDivElement | null>
  isDragging: boolean
  wardLastUpdated: WardLastUpdatedResponse
  infectionTypes:InfectionTypeType[]
  roomInfections:RoomInfectionType[]
  wardInfections:WardInfectionType[]
  activeAnnouncements: ActiveAnnouncementFrontType[]
  hospitalSettings: HospitalSettingsType | null

}
//WardAreaの役割は、病棟エリア全体を管理すること。
// 病棟エリアのレイアウトを定義し、
// 各病棟に対してWardコンポーネントを配置する。
// さらに、ドラッグアンドドロップの処理も担当する。
export default function WardArea({
                                  deviceList,
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
  

return (
  <div
    className="h-full flex flex-col overflow-hidden bg-[#0f172a] p-3 sm:p-4 select-none"
  >
    {/* ─── エリアヘッダー ＆ ツールバー ─── */}
    <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800">
      
      {/* 左側：タイトル・更新日時・お知らせティッカー */}
      <div className="flex items-center flex-1 min-w-0 overflow-hidden">
        <h2 className="text-sm font-bold text-slate-100 tracking-tight whitespace-nowrap">
          病棟一覧
        </h2>

        <span className="ml-3 font-mono text-xs text-slate-400 whitespace-nowrap">
          最終更新：{wardLastUpdated.updatedAt
            ? formatDateTime(wardLastUpdated.updatedAt)
            : "-"}
        </span>

        {activeAnnouncements.length > 0 && (
          <div className="flex-1 ml-4 min-w-0 max-w-2xl overflow-hidden">
            <div className="px-3 py-1 rounded-lg bg-amber-950/50 border border-amber-700/80 text-amber-200 text-xs shadow-xs overflow-hidden">
              <div className={styles.announcementTicker}>
                <span className="font-bold text-amber-300">【お知らせ】📢</span>{" "}
                {activeAnnouncements
                  .map((announcement) => announcement.message)
                  .join("　◆　")}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 右側：ズームコントロールバー（クールスレート調） */}
      <div className="flex items-center gap-2 bg-[#1e293b] px-2.5 py-1 rounded-xl border border-slate-700 shadow-md">
        <span className="font-mono text-xs font-bold text-slate-200 bg-[#0f172a] border border-slate-700 px-2 py-0.5 rounded-md min-w-[46px] text-center">
          {Math.round((wardCellSize / 80) * 100)}%
        </span>

        <button
          type="button"
          onClick={() => setWardCellSize((s) => Math.max(24, s - 4))}
          className="h-7 w-7 rounded-lg border border-slate-600/80 bg-[#283548] hover:bg-[#33435c] active:bg-[#1a2330] text-slate-200 flex items-center justify-center font-bold text-xs transition-all cursor-pointer"
          title="縮小"
        >
          −
        </button>

        <button
          type="button"
          onClick={() => setWardCellSize((s) => Math.min(120, s + 4))}
          className="h-7 w-7 rounded-lg border border-slate-600/80 bg-[#283548] hover:bg-[#33435c] active:bg-[#1a2330] text-slate-200 flex items-center justify-center font-bold text-xs transition-all cursor-pointer"
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
          onChange={(e) => setWardCellSize(Number(e.target.value))}
          className="w-28 sm:w-36 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
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
        {[...wards]
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((ward) => (
            <div
              key={ward.id}
              data-ward-id={ward.id}
              style={{
                gridColumn: ward.id === 1 ? "span 3" : undefined,
              }}
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
                    .filter((r) => r.wardId === ward.id)
                    .sort((a, b) =>
                      a.name.localeCompare(b.name, undefined, { numeric: true })
                    )
                    .map((room) => (
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
  </div>
);}