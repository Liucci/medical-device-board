import { Device } from "../types/deviceTypes"
import { InfectionTypeType } from "../types/infectionTypeTypes"
import { RoomInfectionType } from "../types/roomInfectionTypes"
import { HospitalSettingsType } from "../types/hospitalSettingTypes"
import { TodayInspectionFrontType } from "../types/inspectionTypes/inspectionTypes" 

import { FaVirus } from "react-icons/fa"

import DeviceIcon from "../utils/DeviceIcon"
//import { deviceTypes, deviceModels } from "../types/deviceTypes"
import {useRef} from "react"
import {
  createLongPressState,
  startLongPress,
  finishLongPress,
  cancelLongPress,
} from "../drag/longPress"


//WardArea.tsxより
type Props = {
  deviceList: any[]
  deviceTypes: any[]
  deviceModels: any[] 
  rooms: any[]
  roomId: number
  roomName: string
  patientName?: string
  managementNumber?: string
  serialNumber?: string
  startDrag: (target: HTMLElement,clientX: number,  clientY: number,device: Device) => void
  draggingDevice: Device | null
  pendingDevice: Device | null
  deleteDevice: (id: number) => void
  openRoomDeviceInfoModal: (device: Device) => void
  getMAlert: (deviceId?: number) => "red" | "yellow" | "green"| null
  cellSize: number
  inspectionCounts: Record<number, number>
  todayInspections?: TodayInspectionFrontType[]
  currentUser: any
  isDragging: boolean
  infectionTypes:InfectionTypeType[]
  roomInfections:RoomInfectionType[]
  hospitalSettings: HospitalSettingsType | null
}

export default function RoomContainer({
                            deviceList,
                            deviceTypes,
                            deviceModels,
                            rooms,
                            roomId,
                            roomName,
                            patientName,
                            startDrag,
                            draggingDevice,
                            pendingDevice,   
                            deleteDevice,
                            openRoomDeviceInfoModal,
                            getMAlert,
                            cellSize,
                            inspectionCounts,
                            todayInspections,
                            managementNumber,
                            serialNumber,
                            currentUser,
                            isDragging,
                            infectionTypes,
                            roomInfections,
                            hospitalSettings

                            }: Props) {

const roomDevices = deviceList.filter(
  d => d.status === "room" && 
  d.roomId === roomId &&
  d.id !== pendingDevice?.id
)
  //console.log("患者名:",patientName)
  //console.log("rooms",rooms)
const longPress = useRef(createLongPressState())
//const longPressTimer = useRef<NodeJS.Timeout | null>(null)        
//const isLongPress = useRef(false)

//病室の感染症を取得
const roomInfectionsForRoom =
  roomInfections.filter(
    ri => ri.roomId === roomId
  )

// 病室に配置されている機器がない場合は病棟に何も表示しない
  if (roomDevices.length === 0) {
    return null;
  }

  const hasInfection = roomInfectionsForRoom.length > 0;

  return (
    <div
      data-room-container
      className={`
        rounded-xl
        p-3
        flex
        flex-col
        transition-all
        duration-150
        select-none
        border
        /* ─── 病室立体成型トレイ（病棟より一段明るいトレイ ＋ 上端光彩 ＋ 下端シェード） ─── */
        ${
          hasInfection
            ? "border-rose-500/80 bg-gradient-to-b from-[#381a24] via-[#2a141c] to-[#1e0e14] shadow-[0_4px_14px_-2px_rgba(244,63,94,0.3),inset_0_1.5px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(0,0,0,0.4)] hover:border-rose-400"
            : "border-slate-600/70 bg-gradient-to-b from-[#243247] via-[#1e293b] to-[#17212f] shadow-[0_4px_14px_-2px_rgba(0,0,0,0.4),inset_0_1.5px_0_0_rgba(255,255,255,0.12),inset_0_-1px_0_0_rgba(0,0,0,0.3)] hover:border-sky-400/50 hover:shadow-[0_8px_18px_-3px_rgba(0,0,0,0.55)]"
        }
        ${hasInfection ? "infection-glow" : ""}
      `}
      style={{
        minWidth: `${Math.max(cellSize + 24, 64)}px`,
        width: "fit-content",
      }}
    >
      {/* ─── 病室ヘッダー：病室名（文字枠なし・クリーン太字） ＆ 感染症マーク ─── */}
      <div
        className="flex items-center justify-between gap-2 mb-1"
        style={{
          fontSize:
            cellSize >= 88
              ? "14px"
              : cellSize >= 64
              ? "12px"
              : cellSize >= 40
              ? "10px"
              : "8px",
          lineHeight: 1.1,
        }}
      >
        {/* 文字枠なし、視認性の高い白文字タイトル */}
        <div className="font-bold text-slate-100 tracking-tight">
          {roomName}
        </div>

      {/* 感染症アイコン（この病室に感染症がある時だけ、アイコンのみ表示） */}
        {(() => {
          // ★ この病室（roomId）に該当する感染症だけに絞り込む
          const currentRoomInfections = roomInfections.filter(
            (ri) => ri.roomId === roomId
          );

          if (currentRoomInfections.length === 0) return null;

          return (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-700/80 shadow-2xs">
              {currentRoomInfections.map((ri) => {
                const infection = infectionTypes.find(
                  (i) => i.id === ri.infectionTypeId
                );
                if (!infection) return null;

                return (
                  <div
                    key={ri.id}
                    className="relative group cursor-pointer flex items-center justify-center"
                  >
                    {/* 感染症アイコン（本体） */}
                    <FaVirus
                      size={12}
                      color={infection.color || "#f43f5e"}
                      className="filter drop-shadow-xs transition-transform duration-150 group-hover:scale-125"
                    />

                    {/* マウスホバー時にフワッと浮き出る感染症名ツールチップ */}
                    <div
                      className="
                        absolute
                        bottom-full
                        left-1/2
                        -translate-x-1/2
                        mb-1.5
                        hidden
                        group-hover:flex
                        items-center
                        whitespace-nowrap
                        rounded-md
                        bg-slate-900/95
                        text-white
                        text-[10px]
                        font-bold
                        px-2
                        py-0.5
                        shadow-xl
                        border
                        border-rose-500/50
                        pointer-events-none
                        z-50
                      "
                    >
                      {infection.name}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}  
      </div>

      {/* ─── 患者名表示部 ─── */}
      {hospitalSettings?.showPatientName && (
        <div
          className="text-slate-400 font-medium mb-2 truncate"
          style={{
            fontSize:
              cellSize >= 88
                ? "12px"
                : cellSize >= 64
                ? "11px"
                : cellSize >= 40
                ? "9px"
                : "7px",
            lineHeight: 1.2,
          }}
        >
          {patientName ? (
            <span>
              <span className="text-slate-400 font-normal">患者:</span>{" "}
              <span className="text-slate-200 font-bold">{patientName}</span>
            </span>
          ) : (
            <span className="text-slate-500 font-normal">患者なし</span>
          )}
        </div>
      )}

      {/* ─── 機器配置領域（内枠なし・直接クリーンに配置） ─── */}
      <div className="flex flex-wrap gap-2.5 items-center">
        {roomDevices.slice(0, 6).map((d) => {
          const isCurrentDragging = draggingDevice?.id === d.id;
          const typeName =
            deviceTypes.find((t) => t.id === d.type)?.name ?? "不明";

          const iconColor =
            deviceTypes.find((t) => t.id === d.type)?.iconColor ?? "#BFDBFE";

          const modelName =
            deviceModels.find((m) => m.id === d.model)?.name ?? "不明";
          const assetType = d.assetType;

          return (
            <div
              key={d.id}
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                const target = e.currentTarget as HTMLElement;
                const clientX = e.clientX;
                const clientY = e.clientY;

                startLongPress(longPress.current, () => {
                  if (currentUser?.role === "viewer") {
                    alert("閲覧者は機器移動できません");
                    return;
                  }
                  startDrag(target, clientX, clientY, d);
                });
              }}
              onPointerUp={(e) => {
                if (e.button !== 0) return;
                finishLongPress(
                  longPress.current,
                  () => {
                    console.log("シングルクリック");
                    openRoomDeviceInfoModal(d);
                  },
                  isDragging
                );
              }}
              onPointerLeave={() => {
                cancelLongPress(longPress.current);
              }}
              style={{
                touchAction: "none",
                visibility: isCurrentDragging ? "hidden" : "visible",
                cursor: "grab",
              }}
              className="active:cursor-grabbing transition-transform"
            >
              <DeviceIcon
                deviceId={d.id}
                typeName={typeName}
                modelName={modelName}
                assetType={assetType}
                iconColor={iconColor}
                managementNumber={d.managementNumber}
                serialNumber={d.serialNumber}
                rentalEndDate={d.rentalEndDate}
                mAlert={getMAlert(d.id)}
                cellSize={cellSize}
                inspectionCount={inspectionCounts[d.id] ?? 0}
                todayInspections={todayInspections}
                isUnderMaintenance={d.isUnderMaintenance}
                standby={d.standby}
                standbyStartedAt={d.standbyStartedAt}
              />
            </div>
          );
        })}
      </div>
    </div>
  );  
}
