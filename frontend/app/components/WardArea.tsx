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

import RoomContainer from "./RoomContainer"
import { formatDateTime } from "../utils/dateUtils"

import { ActiveAnnouncementFrontType } from "../types/announcementType"

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
  getMAlert: (deviceId?: number) => "red" | "yellow" | "green"
  wardCellSize: number
  setWardCellSize: React.Dispatch<React.SetStateAction<number>>
  currentUser:CurrentUser 
  scrollRef: React.RefObject<HTMLDivElement | null>
  isDragging: boolean
  wardLastUpdated: WardLastUpdatedResponse
  infectionTypes:InfectionTypeType[]
  roomInfections:RoomInfectionType[]
  activeAnnouncements: ActiveAnnouncementFrontType[]
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
                                  getMAlert,
                                  wardCellSize,
                                  managementNumber,
                                  serialNumber,
                                  setWardCellSize,
                                  currentUser,
                                  scrollRef,
                                  isDragging,
                                  wardLastUpdated,
                                  infectionTypes,
                                  roomInfections,
                                  activeAnnouncements

                                }: Props) {
  

return (
  <div
    className="p-3"
    style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}
  >
    {/* header */}
    
    <div
      style={{
        flexShrink: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "0px",
        paddingBottom: "4px",
        marginBottom: "6px",
        borderBottom: "1px solid #ddd",
      }}
    >
<div
    className="flex items-center"
    style={{
        flex: 1,
        overflow: "hidden"
    }}
>        <h2 className="font-bold">
          病棟一覧
        </h2>

        <span className="ml-3 text-xs text-gray-500">
          最終更新：{wardLastUpdated.updatedAt
          ? formatDateTime(wardLastUpdated.updatedAt)
          : "-"}
        </span>

{
    activeAnnouncements.length > 0 && (
    <div
        style={{
            flex: 1,
            marginLeft: "16px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontSize: "13px",
            color: "#92400e"
        }}
    >
        <div className={styles.announcementTicker}>
            【お知らせ】📢 {
                activeAnnouncements
                    .map(announcement => announcement.message)
                    .join("　◆　")
            }
        </div>

    </div>
    )}

      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <div
          style={{
            minWidth: "48px",
            textAlign: "right",
            fontSize: "12px"
          }}
        >
          {Math.round(wardCellSize / 80 * 100)}%
        </div>

        <button
          onClick={() =>
            setWardCellSize(s => Math.max(24, s - 4))
          }
        >
          −
        </button>

        <button
          onClick={() =>
            setWardCellSize(s => Math.min(120, s + 4))
          }
        >
          ＋
        </button>

        <input
          type="range"
          min={24}
          max={120}
          step={4}
          value={wardCellSize}
          onChange={(e) =>
            setWardCellSize(Number(e.target.value))
          }
          style={{
            width: "140px"
          }}
        />
      </div>
    </div>

    {/* scroll body */}
    <div
      ref={scrollRef}
      style={{
        flex:1,
        overflow:"auto"
      }}
    >
    <div
      style={{
        display: "flex",

        // ★ 横並び化
        flexDirection: "row",

        // ★ 横いっぱいで折返し
        flexWrap: "wrap",

        alignItems: "flex-start",

        gap: "12px"
      }}
    >       
    {
    [...wards]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((ward) => (          
          <div
            key={ward.id}
            //DOMの識別用ID
            data-ward-id={ward.id}

            style={{
              gridColumn:
                ward.id === 1
                  ? "span 3"
                  : undefined
            }}



          >
            {/* WardGridは病棟コンテナのUIを定義する関数コンポーネント */}
            {/* WardGridの中に、病室コンテナであるRoomContainerを配置する。 */}
            <WardGrid
              title={ward.name}
              minWidth={Math.max(
                                  90,
                                  wardCellSize * 1
                                )}
              cellSize={wardCellSize}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                {
                  rooms.filter(r => r.wardId === ward.id)
                       .sort((a, b) =>a.name.localeCompare(
                                            b.name,
                                            undefined,
                                            { numeric: true }
                                          )
                        )
                        .map(room => (
                    <RoomContainer
                      key={room.id}
                      deviceList={deviceList}
                      deviceTypes={deviceTypes}
                      deviceModels={deviceModels}
                      rooms={rooms}
                      roomId={room.id}
                      roomName={room.name}
                      patientName={
              
                        room.patientName
                      }
                      startDrag={startDrag}
                      draggingDevice={
                        draggingDevice
                      }
                      pendingDevice={
                        pendingDevice
                      }
                      deleteDevice={deleteDevice}
                      openRoomDeviceInfoModal={
                        openRoomDeviceInfoModal
                      }
                      getMAlert={getMAlert}
                      cellSize={wardCellSize}
                      managementNumber={managementNumber}
                      serialNumber={serialNumber}
                      currentUser={currentUser}
                      isDragging={isDragging}
                      roomInfections={roomInfections}
                      infectionTypes={infectionTypes}
                    />
                  ))
                }
              </div>
            </WardGrid>
          </div>
        ))}
      </div>
    </div>
  </div>
)}