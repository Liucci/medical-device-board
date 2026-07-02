import { Device } from "../types/deviceTypes"
import { InfectionTypeType } from "../types/infectionTypeTypes"
import { RoomInfectionType } from "../types/roomInfectionTypes"
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
  getMAlert: (deviceId?: number) => "red" | "yellow" | "green"
  cellSize: number
  currentUser: any
  isDragging: boolean
  infectionTypes:InfectionTypeType[]
  roomInfections:RoomInfectionType[]
  
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
                            managementNumber,
                            serialNumber,
                            currentUser,
                            isDragging,
                            infectionTypes,
                            roomInfections

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


   
return (
    <div
      style={{
        border: "1px solid #888",
        borderRadius: "8px",
        padding: "8px",
        //感染症時背景色変える
        background:
          roomInfectionsForRoom.length > 0
            ? "#fff5f5"
            : "#f9fafb",        
        minWidth: `${Math.max(cellSize + 24, 64)}px`,
        width: "fit-content"
        }}
    >   
     {/* 病室名と感染マーク */}
    <div
      className="flex items-center justify-between mb-1"
      style={{
        fontSize:
          cellSize >= 88
            ? "14px"
            : cellSize >= 64
            ? "12px"
            : cellSize >= 40
            ? "10px"
            : "8px",
        lineHeight: 1.1
      }}
    >

      <div className="font-bold">
        {roomName}
      </div>

      <div className="flex gap-1">

        {roomInfectionsForRoom.map(ri => {

          const infection =
            infectionTypes.find(
              i => i.id === ri.infectionTypeId
            )

          if (!infection) {return null}

          return (
            <FaVirus
              key={ri.id}
              size={12}
              color={infection.color}
              title={infection.name}
            />
          )

        })}

      </div>

    </div>

        {/* 🔥 患者名 */}
    <div
      className="text-gray-600 mb-1"
      style={{
        fontSize:
          cellSize >= 88
            ? "12px"
            : cellSize >= 64
            ? "11px"
            : cellSize >= 40
            ? "9px"
            : "7px",

        lineHeight: 1.1
      }}
    >
      {patientName ? `患者: ${patientName}` : "患者なし"}
    </div>
          {/* 👇 flex配置 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px"
        }}
      >

      {roomDevices.slice(0, 6).map(d => {
        const isCurrentDragging = draggingDevice?.id === d.id
        const typeName =
          deviceTypes.find(t => t.id === d.type)?.name ?? "不明"

        const iconColor =
          deviceTypes.find((t) => t.id === d.type)?.iconColor
          ?? "#BFDBFE"



        const modelName =
          deviceModels.find(m => m.id === d.model)?.name ?? "不明"
        const assetType=d.assetType

        return (
          <div
            key={d.id}
              onPointerDown={(e) => {
                //左クリック以外は排除
                if (e.button !== 0) return
                    const target = e.currentTarget as HTMLElement
                    const clientX = e.clientX
                    const clientY = e.clientY

                    startLongPress(
                      longPress.current,
                      () => {
                        if (currentUser?.role === "viewer") {
                          alert("閲覧者は機器移動できません")
                          return
                        }

                        startDrag(
                          target,
                          clientX,
                          clientY,
                          d
                        )
                      }
                    )
              }}

              onPointerUp={(e) => {
                // 左クリック以外排除
                if (e.button !== 0) return
                  
                    finishLongPress(
                      longPress.current,
                      () => {
                    console.log("シングルクリック")
                    console.log("roomDevice", d)
                    openRoomDeviceInfoModal(d)
                      },
                      isDragging
                    )
              }}

              onPointerLeave={() => {
                cancelLongPress(longPress.current)
              }}



              onContextMenu={(e) => {
                console.log("右クリック検知")
                e.preventDefault()
                if (confirm(`${typeName} ${modelName} を削除しますか？`)) {
                  deleteDevice(d.id)
              }
            }}
            //機器アイコンdrag中は元位置のアイコンは見えなくする
            style={{
              touchAction: "none",
              visibility: isCurrentDragging ? "hidden" : "visible"
            }}
          >
            <DeviceIcon 
              typeName={typeName}
              modelName={modelName}
              assetType={assetType}
              iconColor={iconColor}

              managementNumber={d.managementNumber}
              serialNumber={d.serialNumber}
              rentalEndDate={d.rentalEndDate}
              mAlert={getMAlert(d.id)}
              cellSize={cellSize}
              isUnderMaintenance={d.isUnderMaintenance}
              standby={d.standby}
              standbyStartedAt={d.standbyStartedAt}
             />
          </div>
        )
      })}
      </div>
    </div>
  )
}
