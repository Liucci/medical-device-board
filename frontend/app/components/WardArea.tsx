import WardGrid from "./WardGrid"
import { Device } from "../types/deviceTypes"
import { StockAreaType } from "../types/stockTypes"
import { DeviceTypeType } from "../types/deviceTypeTypes"
import { DeviceModelType } from "../types/deviceModelTypes"
import { WardType } from "../types/wardTypes"
import {CurrentUser  } from "../types/userTypes"
import { RoomType } from "../types/roomTypes"

import RoomContainer from "./RoomContainer"

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
  isDraggingRef: React.MutableRefObject<boolean>
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
                                  isDraggingRef

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
      <h2 className="text-1xl font-bold m-0">
        病棟一覧
      </h2>

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
            style={{
              gridColumn:
                ward.id === 1
                  ? "span 3"
                  : undefined
            }}
            onPointerUp={() => {

 alert(`Ward Drop: ${draggingDevice ? "あり" : "なし"}`)
              
              if (!draggingDevice) return

              onDrop(
                draggingDevice,
                ward.id
              )
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
                  rooms
                    .filter(r => r.wardId === ward.id)

                    .sort((a, b) => {

                      const aCount =
                        deviceList.filter(
                          d =>
                            d.status === "room" &&
                            d.roomId === a.id
                        ).length

                      const bCount =
                        deviceList.filter(
                          d =>
                            d.status === "room" &&
                            d.roomId === b.id
                        ).length

                      // ===== 機器数多い順 =====
                      if (aCount !== bCount) {
                        return bCount - aCount
                      }

                      // ===== 同数なら部屋番号順 =====
                      return a.name.localeCompare(
                        b.name,
                        undefined,
                        { numeric: true }
                      )
                    })
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
                      isDraggingRef={isDraggingRef}
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