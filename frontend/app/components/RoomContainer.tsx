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
  return 
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
        /* ─── 病室自体の強い立体感（多層ドロップシャドウ ＋ 上端光彩 ＋ 下端シェード ＋ 微細曲面グラデーション） ─── */
        ${
          hasInfection
            ? "border-rose-300/90 bg-gradient-to-b from-rose-50/95 via-white to-rose-100/60 shadow-[0_6px_18px_-3px_rgba(244,63,94,0.18),0_2px_5px_-1px_rgba(244,63,94,0.10),inset_0_1.5px_0_0_rgba(255,255,255,1),inset_0_-1.5px_0_0_rgba(244,63,94,0.12)] hover:border-rose-400"
            : "border-slate-300/80 bg-gradient-to-b from-white via-slate-50 to-slate-100/90 shadow-[0_6px_16px_-3px_rgba(15,23,42,0.10),0_2px_4px_-1px_rgba(15,23,42,0.06),inset_0_1.5px_0_0_rgba(255,255,255,1),inset_0_-1.5px_0_0_rgba(15,23,42,0.05)] hover:border-slate-400/80 hover:shadow-[0_10px_22px_-4px_rgba(15,23,42,0.14),0_3px_6px_-2px_rgba(15,23,42,0.08)]"
        }
        ${hasInfection ? "infection-glow" : ""}
      `}
      style={{
        minWidth: `${Math.max(cellSize + 24, 64)}px`,
        width: "fit-content",
      }}
    >
      {/* ─── 病室ヘッダー：病室名（文字枠なし・クリーン表示） ＆ 感染症マーク ─── */}
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
        {/* 文字枠なし、視認性の高いクリーンな太字タイトル */}
        <div className="font-bold text-slate-900 tracking-tight">
          {roomName}
        </div>

        {/* 感染症アイコン */}
        {hasInfection && (
          <div className="flex items-center gap-1">
            {roomInfectionsForRoom.map((ri) => {
              const infection = infectionTypes.find(
                (i) => i.id === ri.infectionTypeId
              );
              if (!infection) return null;

              return (
                <FaVirus
                  key={ri.id}
                  size={12}
                  color={infection.color}
                  title={infection.name}
                  className="filter drop-shadow-xs"
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ─── 患者名表示部 ─── */}
      {hospitalSettings?.showPatientName && (
        <div
          className="text-slate-500 font-medium mb-2 truncate"
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
              <span className="text-slate-700 font-bold">{patientName}</span>
            </span>
          ) : (
            <span className="text-slate-400 font-normal">患者なし</span>
          )}
        </div>
      )}

      {/* ─── 機器配置領域（内側の枠は削除し、直接すっきり並べる） ─── */}
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
